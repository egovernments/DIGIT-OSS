package org.egov.waterconnection.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.waterconnection.repository.WaterDao;
import org.egov.waterconnection.util.EncryptionDecryptionUtil;
import org.egov.waterconnection.web.models.SearchCriteria;
import org.egov.waterconnection.web.models.WaterConnection;
import org.egov.waterconnection.web.models.WaterConnectionRequest;
import org.egov.waterconnection.web.models.WaterConnectionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

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

        if (StringUtils.isEmpty(criteria.getLimit()))
            criteria.setLimit(Integer.valueOf(batchSize));

        if (StringUtils.isEmpty(criteria.getOffset()))
            criteria.setOffset(Integer.valueOf(batchOffset));

        waterConnectionList = initiateEncryption(requestInfo, criteria);
        waterConnectionResponse = WaterConnectionResponse.builder().waterConnection(waterConnectionList)
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

        Integer startBatch = Math.toIntExact(criteria.getOffset());
        Integer batchSizeInput = Math.toIntExact(criteria.getLimit());

        Integer count = waterDao.getTotalApplications(criteria);

        log.info("Count: " + count);
        log.info("startbatch: " + startBatch);

        while (startBatch < count) {
            long startTime = System.nanoTime();
            List<WaterConnection> waterConnectionList = new LinkedList<>();
            waterConnectionResponse = waterService.plainSearch(criteria, requestInfo);
            try {
                for (WaterConnection waterConnection : waterConnectionResponse.getWaterConnection()) {
                    /* encrypt here */
                    waterConnection = encryptionDecryptionUtil.encryptObject(waterConnection, WNS_ENCRYPTION_MODEL, WaterConnection.class);
                    waterConnection = encryptionDecryptionUtil.encryptObject(waterConnection, WNS_PLUMBER_ENCRYPTION_MODEL, WaterConnection.class);

                    WaterConnectionRequest waterConnectionRequest = WaterConnectionRequest.builder()
                            .requestInfo(requestInfo)
                            .waterConnection(waterConnection)
                            .build();

                    waterDao.updateOldWaterConnections(waterConnectionRequest);
                    countPushed++;
                    /* decrypt here */
                    waterConnection = encryptionDecryptionUtil.decryptObject(waterConnection, WNS_ENCRYPTION_MODEL, WaterConnection.class, requestInfo);
                    waterConnectionList.add(waterConnection);
                }
            } catch (Exception e) {
                log.error("Encryption failed at batch count of : " + startBatch);
                log.error("Encryption failed at batch count : " + startBatch + "=>" + e.getMessage());
                return finalWaterList;
            }

            log.debug(" count completed for batch : " + startBatch);
            long endTime = System.nanoTime();
            long elapseTime = endTime - startTime;
            log.debug("\n\nBatch elapsed time: " + elapseTime + "\n\n");

            startBatch = startBatch + batchSizeInput;
            criteria.setOffset(Integer.valueOf(startBatch));
            log.info("WaterConnections Count which pushed into kafka topic:" + countPushed);
            finalWaterList.addAll(waterConnectionList);
        }
        criteria.setOffset(Integer.valueOf(batchOffset));

        return finalWaterList;
    }

}
