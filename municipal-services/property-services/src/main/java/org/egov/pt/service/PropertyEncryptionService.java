package org.egov.pt.service;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.EncryptionCount;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.models.collection.BillResponse;
import org.egov.pt.producer.PropertyProducer;
import org.egov.pt.repository.PropertyRepository;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.util.EncryptionDecryptionUtil;
import org.egov.pt.util.ErrorConstants;
import org.egov.pt.util.PTConstants;
import org.egov.pt.web.contracts.PropertyRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.*;

/* Encrypts Property Address data(street, doorNo, landmark) for existing records */
@Slf4j
@Service
public class PropertyEncryptionService {

    @Autowired
    private PropertyProducer producer;

    @Autowired
    private PropertyRepository repository;

    @Autowired
    private PropertyConfiguration config;

    @Autowired
    PropertyService propertyService;

    @Autowired
    EncryptionDecryptionUtil encryptionDecryptionUtil;

    @Value("${encryption.batch.value}")
    private Integer batchSize;

    @Value("${encryption.offset.value}")
    private Integer batchOffset;

    private Integer countPushed = 0;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    /**
     * Initiates property data encryption
     *
     * @param criteria    PropertyCriteria - takes tenantId
     * @param requestInfo
     * @return all properties with encrypted data
     */
    public List<Property> updateOldData(PropertyCriteria criteria, RequestInfo requestInfo) {
        List<Property> properties = updateBatchCriteria(requestInfo, criteria);
        return properties;
    }

    /**
     * Data encryption process takes place in batches.
     * <p>
     * Setting the batch size and initial offset values below
     */
    public List<Property> updateBatchCriteria(RequestInfo requestInfo, PropertyCriteria criteria) {
        List<Property> propertyList = new ArrayList<>();
        Set<String> tenantIds = new HashSet<>();
        if (CollectionUtils.isEmpty(criteria.getTenantIds())) {
            //mdms call for tenantIds in case tenantIds array is not sent in criteria
            tenantIds = getAllTenantsFromMdms(requestInfo);
        }
        List<Property> finalPropertyList = new LinkedList<>();
        for (String tenantId : tenantIds) {
            criteria.setTenantIds(Collections.singleton(tenantId));
            criteria.setTenantId(tenantId);
            EncryptionCount encryptionCount = repository.getLastExecutionDetail(criteria);

            if (criteria.getLimit() == null)
                criteria.setLimit(Long.valueOf(batchSize));

            if (encryptionCount.getRecordCount() != null)
                criteria.setOffset(encryptionCount.getBatchOffset() + encryptionCount.getRecordCount());
            else if (criteria.getOffset() == null)
                criteria.setOffset(Long.valueOf(batchOffset));

            propertyList = initiateEncryption(requestInfo, criteria);
            finalPropertyList.addAll(propertyList);
        }
        return finalPropertyList;
    }

    /**
     * Encrypts existing Properties' data
     *
     * @param criteria    PropertyCriteria - has Limit and offset values
     * @param requestInfo
     * @return all properties with encrypted data
     */
    public List<Property> initiateEncryption(RequestInfo requestInfo, PropertyCriteria criteria) {
        List<Property> finalPropertyList = new LinkedList<>();
        Map<String, String> responseMap = new HashMap<>();

        EncryptionCount encryptionCount;

        Integer startBatch = Math.toIntExact(criteria.getOffset());
        Integer batchSizeInput = Math.toIntExact(criteria.getLimit());

        Integer count = repository.getTotalApplications(criteria);
        Map<String, String> map = new HashMap<>();

        log.info("Count: " + count);
        log.info("startbatch: " + startBatch);

        while (startBatch < count) {
            long startTime = System.nanoTime();
            List<Property> propertyList = new LinkedList<>();
            List<Property> encryptedPropertyList = new LinkedList<>();
            try {
                propertyList = propertyService.searchPropertyPlainSearch(criteria, requestInfo);

                countPushed = 0;

                for (Property property : propertyList) {
                    /* encrypt here */
                    property = encryptionDecryptionUtil.encryptObject(property, PTConstants.PROPERTY_MODEL, Property.class);

                    PropertyRequest request = PropertyRequest.builder()
                            .requestInfo(requestInfo)
                            .property(property)
                            .build();

                    request.getProperty().setOldDataEncryptionRequest(Boolean.TRUE);

                    producer.push(config.getUpdatePropertyTopic(), request);
                    countPushed++;
                    encryptedPropertyList.add(property);
                    map.put("message", "Encryption successfull till batchOffset : " + criteria.getOffset() + ". Records encrypted in current batch : " + countPushed);
                }
            } catch (Exception e) {
                map.put("message", "Encryption failed at batchOffset  :  " + startBatch + "  with message : " + e.getMessage() + ". Records encrypted in current batch : " + countPushed);
                log.error("Encryption failed at batch count of : " + startBatch);
                log.error("Encryption failed at batch count : " + startBatch + "=>" + e.getMessage());

                encryptionCount = EncryptionCount.builder()
                        .tenantid(criteria.getTenantId())
                        .limit(Long.valueOf(criteria.getLimit()))
                        .id(UUID.randomUUID().toString())
                        .batchOffset(Long.valueOf(startBatch))
                        .createdTime(System.currentTimeMillis())
                        .recordCount(Long.valueOf(countPushed))
                        .message(map.get("message"))
                        .encryptiontime(System.currentTimeMillis())
                        .build();

                producer.push(config.getEncryptionStatusTopic(), encryptionCount);

                finalPropertyList.addAll(encryptedPropertyList);
                return finalPropertyList;
            }

            log.debug(" count completed for batch : " + startBatch);
            long endtime = System.nanoTime();
            long elapsetime = endtime - startTime;
            log.debug("\n\nBatch elapsed time: " + elapsetime + "\n\n");

            encryptionCount = EncryptionCount.builder()
                    .tenantid(criteria.getTenantId())
                    .limit(Long.valueOf(criteria.getLimit()))
                    .id(UUID.randomUUID().toString())
                    .batchOffset(Long.valueOf(startBatch))
                    .createdTime(System.currentTimeMillis())
                    .recordCount(Long.valueOf(countPushed))
                    .message(map.get("message"))
                    .encryptiontime(System.currentTimeMillis())
                    .build();

            producer.push(config.getEncryptionStatusTopic(), encryptionCount);

            startBatch = startBatch + batchSizeInput;
            criteria.setOffset(Long.valueOf(startBatch));
            log.info("Property Count pushed into kafka topic:" + countPushed);
            finalPropertyList.addAll(encryptedPropertyList);
        }
        criteria.setOffset(Long.valueOf(batchOffset));

        return finalPropertyList;

    }

    /**
     *
     * @param requestInfo RequestInfo Object
     *
     * @return MdmsCriteria
     */
    private Set<String> getAllTenantsFromMdms(RequestInfo requestInfo) {

        String tenantId = (requestInfo.getUserInfo().getTenantId());
        List<String> tenantsModuleMasters = new ArrayList<>(Arrays.asList("tenants"));
        String jsonPath = PTConstants.TENANTS_JSONPATH_ROOT;

        MasterDetail mstrDetail = MasterDetail.builder().name(PTConstants.TENANTS_MASTER_ROOT)
                .filter("$.*").build();
        ModuleDetail moduleDetail = ModuleDetail.builder().moduleName(PTConstants.TENANT_MASTER_MODULE)
                .masterDetails(Arrays.asList(mstrDetail)).build();
        MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Arrays.asList(moduleDetail)).tenantId(tenantId)
                .build();
        MdmsCriteriaReq mdmsCriteriaReq = MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
        StringBuilder uri = new StringBuilder(config.getMdmsHost()).append(config.getMdmsEndpoint());
        try {
            Optional<Object> result = serviceRequestRepository.fetchResult(uri, mdmsCriteriaReq);
            List<Map<String, Object>> jsonOutput = new ArrayList<>();
            if (result.isPresent())
                jsonOutput = JsonPath.read(result.get(), jsonPath);

            Set<String> state = new HashSet<String>();
            for (Map<String, Object> json : jsonOutput) {
                state.add((String) json.get("code"));
            }
            return state;
        } catch (Exception e) {
            throw new CustomException(ErrorConstants.INVALID_TENANT_ID_MDMS_KEY, ErrorConstants.INVALID_TENANT_ID_MDMS_MSG);
        }
    }

}
