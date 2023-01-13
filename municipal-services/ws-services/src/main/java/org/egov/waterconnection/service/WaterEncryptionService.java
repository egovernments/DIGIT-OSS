package org.egov.waterconnection.service;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.tracer.model.CustomException;
import org.egov.waterconnection.constants.WCConstants;
import org.egov.waterconnection.repository.ServiceRequestRepository;
import org.egov.waterconnection.repository.WaterDao;
import org.egov.waterconnection.util.EncryptionDecryptionUtil;
import org.egov.waterconnection.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;

/* Encrypts Water Applications' data(connectionHolderDetails, PlumberInfo) for existing records */
import static org.egov.waterconnection.constants.WCConstants.WNS_ENCRYPTION_MODEL;
import static org.egov.waterconnection.constants.WCConstants.WNS_PLUMBER_ENCRYPTION_MODEL;

@Slf4j
@Service
public class WaterEncryptionService {

    @Autowired
    private WaterDao waterDao;

    @Autowired
    WaterServiceImpl waterService;

    @Autowired
    EncryptionDecryptionUtil encryptionDecryptionUtil;

    @Value("${encryption.batch.value}")
    private Integer batchSize;

    @Value("${encryption.offset.value}")
    private Integer batchOffset;

    private Integer countPushed = 0;

    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsEndpoint;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    /**
     * Initiates Water applications/connections data encryption
     *
     * @param criteria    SearchCriteria - takes tenantId
     * @param requestInfo
     * @return all water applications with encrypted data
     */
    public WaterConnectionResponse updateOldData(SearchCriteria criteria, RequestInfo requestInfo) {
        WaterConnectionResponse waterConnectionResponse = updateBatchCriteria(requestInfo, criteria);
        return waterConnectionResponse;
    }

    /**
     * Data encryption process takes place in batches.
     * <p>
     * Setting the batch size and initial offset values below
     */
    public WaterConnectionResponse updateBatchCriteria(RequestInfo requestInfo, SearchCriteria criteria) {
        List<WaterConnection> waterConnectionList = new ArrayList();
        WaterConnectionResponse waterConnectionResponse;

        if (CollectionUtils.isEmpty(criteria.getTenantIds())) {
            //mdms call for tenantIds in case tenantIds array is not sent in criteria
            Set<String> tenantIds = getAllTenantsFromMdms(requestInfo);
            criteria.setTenantIds(tenantIds);
        }
        List<WaterConnection> finalWaterList = new LinkedList<>();
        for (String tenantId : criteria.getTenantIds()) {
            criteria.setTenantId(tenantId);

            EncryptionCount encryptionCount = waterDao.getLastExecutionDetail(criteria);

            if (criteria.getLimit() == null)
                criteria.setLimit(Integer.valueOf(batchSize));

            if (encryptionCount.getRecordCount() != null)
                criteria.setOffset((int) (encryptionCount.getBatchOffset() + encryptionCount.getRecordCount()));
            else if (criteria.getOffset() == null)
                criteria.setOffset(Integer.valueOf(batchOffset));

            waterConnectionList = initiateEncryption(requestInfo, criteria);
            finalWaterList.addAll(waterConnectionList);
        }
        waterConnectionResponse = WaterConnectionResponse.builder().waterConnection(finalWaterList)
                .build();
        return waterConnectionResponse;
    }

    /**
     * Encrypts existing Water applications' data
     *
     * @param criteria    SearchCriteria - has Limit and offset values
     * @param requestInfo
     * @return all water applications with encrypted data
     */
    public List<WaterConnection> initiateEncryption(RequestInfo requestInfo, SearchCriteria criteria) {
        List<WaterConnection> finalWaterList = new LinkedList<>();
        Map<String, String> responseMap = new HashMap<>();

        WaterConnectionResponse waterConnectionResponse;

        EncryptionCount encryptionCount;

        Integer startBatch = Math.toIntExact(criteria.getOffset());
        Integer batchSizeInput = Math.toIntExact(criteria.getLimit());

        Integer count = waterDao.getTotalApplications(criteria);
        Map<String, String> map = new HashMap<>();

        log.info("Count: " + count);
        log.info("startbatch: " + startBatch);

        while (startBatch < count) {
            long startTime = System.nanoTime();
            List<WaterConnection> waterConnectionList = new LinkedList<>();
            try {
                waterConnectionResponse = waterService.plainSearch(criteria, requestInfo);
                countPushed = 0;

                for (WaterConnection waterConnection : waterConnectionResponse.getWaterConnection()) {
                    /* encrypt here */
                    waterConnection = encryptionDecryptionUtil.encryptObject(waterConnection, WNS_ENCRYPTION_MODEL, WaterConnection.class);
                    waterConnection = encryptionDecryptionUtil.encryptObject(waterConnection, WNS_PLUMBER_ENCRYPTION_MODEL, WaterConnection.class);

                    WaterConnectionRequest waterConnectionRequest = WaterConnectionRequest.builder()
                            .requestInfo(requestInfo)
                            .waterConnection(waterConnection)
                            .isOldDataEncryptionRequest(Boolean.TRUE)
                            .build();

                    waterDao.updateOldWaterConnections(waterConnectionRequest);
                    countPushed++;
                    waterConnectionList.add(waterConnection);
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

                waterDao.updateEncryptionStatus(encryptionCount);

                finalWaterList.addAll(waterConnectionList);
                return finalWaterList;
            }

            log.debug(" count completed for batch : " + startBatch);
            long endTime = System.nanoTime();
            long elapseTime = endTime - startTime;
            log.debug("\n\nBatch elapsed time: " + elapseTime + "\n\n");

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

            waterDao.updateEncryptionStatus(encryptionCount);
            startBatch = startBatch + batchSizeInput;
            criteria.setOffset(Integer.valueOf(startBatch));
            log.info("WaterConnections Count which pushed into kafka topic:" + countPushed);
            finalWaterList.addAll(waterConnectionList);
        }
        criteria.setOffset(Integer.valueOf(batchOffset));

        return finalWaterList;
    }

    /**
     *
     * @param requestInfo RequestInfo Object
     *
     * @return MdmsCriteria
     */
    private Set<String> getAllTenantsFromMdms(RequestInfo requestInfo) {

        String tenantId = (requestInfo.getUserInfo().getTenantId());
        String jsonPath = WCConstants.TENANTS_JSONPATH_ROOT;

        MasterDetail mstrDetail = MasterDetail.builder().name(WCConstants.TENANTS_MASTER_ROOT)
                .filter("$.*").build();
        ModuleDetail moduleDetail = ModuleDetail.builder().moduleName(WCConstants.TENANT_MASTER_MODULE)
                .masterDetails(Arrays.asList(mstrDetail)).build();
        MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Arrays.asList(moduleDetail)).tenantId(tenantId)
                .build();
        MdmsCriteriaReq mdmsCriteriaReq = MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
        StringBuilder uri = new StringBuilder(mdmsHost).append(mdmsEndpoint);
        try {
            Object result = serviceRequestRepository.fetchResult(uri, mdmsCriteriaReq);
            List<Map<String, Object>> jsonOutput = JsonPath.read(result, jsonPath);
            Set<String> state = new HashSet<String>();
            for (Map<String, Object> json : jsonOutput) {
                state.add((String) json.get("code"));
            }
            return state;
        } catch (Exception e) {
            throw new CustomException("INVALID_TENANT_FILE_SEARCH", "Exception in TenantId File search in MDMS: " + e.getMessage());
        }
    }

}
