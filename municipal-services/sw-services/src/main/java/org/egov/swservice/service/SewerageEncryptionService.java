package org.egov.swservice.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.swservice.repository.SewerageDao;
import org.egov.swservice.util.EncryptionDecryptionUtil;
import org.egov.swservice.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/* Encrypts Water Applications' data(connectionHolderDetails, PlumberInfo) for existing records */
import static org.egov.swservice.util.SWConstants.WNS_ENCRYPTION_MODEL;
import static org.egov.swservice.util.SWConstants.WNS_PLUMBER_ENCRYPTION_MODEL;

@Slf4j
@Service
public class SewerageEncryptionService {

    @Autowired
    SewerageDao sewerageDao;

    @Autowired
    SewerageServiceImpl sewerageService;
    @Autowired
    EncryptionDecryptionUtil encryptionDecryptionUtil;

    @Value("${encryption.batch.value}")
    private Integer batchSize;

    @Value("${encryption.offset.value}")
    private Integer batchOffset;

    private Integer countPushed = 0;

    /**
     * Initiates Sewerage applications/connections data encryption
     *
     * @param criteria    SearchCriteria - takes tenantId
     * @param requestInfo
     * @return all sewerage applications with encrypted data
     */
    public List<SewerageConnection> updateOldData(SearchCriteria criteria, RequestInfo requestInfo) {
        SewerageConnectionResponse sewerageConnectionResponse = updateBatchCriteria(requestInfo, criteria);
        return sewerageConnectionResponse.getSewerageConnections();
    }

    /**
     * Data encryption process takes place in batches.
     * <p>
     * Setting the batch size and initial offset values below
     */
    public SewerageConnectionResponse updateBatchCriteria(RequestInfo requestInfo, SearchCriteria criteria) {
        List<SewerageConnection> sewerageConnectionList = new ArrayList<>();
        SewerageConnectionResponse sewerageConnectionResponse;

        EncryptionCount encryptionCount = sewerageDao.getLastExecutionDetail(criteria);

        if (criteria.getLimit() == null)
            criteria.setLimit(Integer.valueOf(batchSize));

        if (encryptionCount.getRecordCount() != null)
            criteria.setOffset((int) (encryptionCount.getBatchOffset() + encryptionCount.getRecordCount()));
        else if (criteria.getOffset() == null)
            criteria.setOffset(Integer.valueOf(batchOffset));

        sewerageConnectionList = initiateEncryption(requestInfo, criteria);
        sewerageConnectionResponse = SewerageConnectionResponse.builder().sewerageConnections(sewerageConnectionList)
                .build();
        return sewerageConnectionResponse;
    }

    /**
     * Encrypts existing Sewerage applications' data
     *
     * @param criteria    SearchCriteria - has Limit and offset values
     * @param requestInfo
     * @return all sewerage applications with encrypted data
     */
    public List<SewerageConnection> initiateEncryption(RequestInfo requestInfo, SearchCriteria criteria) {
        List<SewerageConnection> finalSewerageList = new LinkedList<>();
        Map<String, String> responseMap = new HashMap<>();

        SewerageConnectionResponse sewerageConnectionResponse;

        EncryptionCount encryptionCount;

        Integer startBatch = Math.toIntExact(criteria.getOffset());
        Integer batchSizeInput = Math.toIntExact(criteria.getLimit());

        Integer count = sewerageDao.getTotalApplications(criteria);
        Map<String, String> map = new HashMap<>();

        log.info("Count: " + count);
        log.info("startbatch: " + startBatch);

        while (startBatch < count) {
            long startTime = System.nanoTime();
            List<SewerageConnection> sewerageConnectionList = new LinkedList<>();
            List<SewerageConnection> encryptedSewerageConnectionList = new LinkedList<>();
            try {
                sewerageConnectionList = sewerageService.plainSearch(criteria, requestInfo);
                countPushed = 0;

                for (SewerageConnection sewerageConnection : sewerageConnectionList) {
                    /* encrypt here */
                    sewerageConnection = encryptionDecryptionUtil.encryptObject(sewerageConnection, WNS_ENCRYPTION_MODEL, SewerageConnection.class);
                    sewerageConnection = encryptionDecryptionUtil.encryptObject(sewerageConnection, WNS_PLUMBER_ENCRYPTION_MODEL, SewerageConnection.class);

                    SewerageConnectionRequest sewerageConnectionRequest = SewerageConnectionRequest.builder()
                            .requestInfo(requestInfo)
                            .sewerageConnection(sewerageConnection)
                            .isOldDataEncryptionRequest(Boolean.TRUE)
                            .build();

                    sewerageDao.updateOldSewerageConnections(sewerageConnectionRequest);
                    countPushed++;

                    encryptedSewerageConnectionList.add(sewerageConnection);
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

                sewerageDao.updateEncryptionStatus(encryptionCount);

                finalSewerageList.addAll(encryptedSewerageConnectionList);
                return finalSewerageList;
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

            sewerageDao.updateEncryptionStatus(encryptionCount);
            startBatch = startBatch + batchSizeInput;
            criteria.setOffset(Integer.valueOf(startBatch));
            log.info("SewerageConnections Count which pushed into kafka topic:" + countPushed);
            finalSewerageList.addAll(encryptedSewerageConnectionList);
        }
        criteria.setOffset(Integer.valueOf(batchOffset));

        return finalSewerageList;
    }

}
