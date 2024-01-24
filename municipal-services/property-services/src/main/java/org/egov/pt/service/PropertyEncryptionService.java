package org.egov.pt.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.producer.PropertyProducer;
import org.egov.pt.repository.PropertyRepository;
import org.egov.pt.util.EncryptionDecryptionUtil;
import org.egov.pt.web.contracts.PropertyRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;

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
        if (StringUtils.isEmpty(criteria.getLimit()))
            criteria.setLimit(Long.valueOf(batchSize));

        if (StringUtils.isEmpty(criteria.getOffset()))
            criteria.setOffset(Long.valueOf(batchOffset));

        propertyList = initiateEncryption(requestInfo, criteria);
        return propertyList;
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

        Integer startBatch = Math.toIntExact(criteria.getOffset());
        Integer batchSizeInput = Math.toIntExact(criteria.getLimit());

        Integer count = repository.getTotalApplications(criteria);

        log.info("Count: " + count);
        log.info("startbatch: " + startBatch);

        while (startBatch < count) {
            long startTime = System.nanoTime();
            List<Property> propertyList = new LinkedList<>();
            propertyList = propertyService.searchPropertyPlainSearch(criteria, requestInfo);
            try {
                for (Property property : propertyList) {
                    /* encrypt here */
                    property = encryptionDecryptionUtil.encryptObject(property, "Property", Property.class);

                    PropertyRequest request = PropertyRequest.builder()
                            .requestInfo(requestInfo)
                            .property(property)
                            .build();
//TODO FIXME check if enc works on multiinstance
                    producer.push(criteria.getTenantId(), config.getUpdatePropertyTopic(), request);
                    countPushed++;
                    /* decrypt here */
                    property = encryptionDecryptionUtil.decryptObject(property, "Property", Property.class, requestInfo);
                }
            } catch (Exception e) {

                log.error("Encryption failed at batch count of : " + startBatch);
                log.error("Encryption failed at batch count : " + startBatch + "=>" + e.getMessage());
                return finalPropertyList;
            }

            log.debug(" count completed for batch : " + startBatch);
            long endtime = System.nanoTime();
            long elapsetime = endtime - startTime;
            log.debug("\n\nBatch elapsed time: " + elapsetime + "\n\n");

            startBatch = startBatch + batchSizeInput;
            criteria.setOffset(Long.valueOf(startBatch));
            log.info("Property Count pushed into kafka topic:" + countPushed);
            finalPropertyList.addAll(propertyList);
        }
        criteria.setOffset(Long.valueOf(batchOffset));

        return finalPropertyList;

    }

}
