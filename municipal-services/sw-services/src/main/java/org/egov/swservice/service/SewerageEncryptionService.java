package org.egov.swservice.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.swservice.repository.SewerageDao;
import org.egov.swservice.util.EncryptionDecryptionUtil;
import org.egov.swservice.web.models.SearchCriteria;
import org.egov.swservice.web.models.SewerageConnection;
import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.egov.swservice.web.models.SewerageConnectionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/* Encrypts Water Applications' data(connectionHolderDetails, PlumberInfo) for existing records */
import static org.egov.swservice.util.SWConstants.WNS_ENCRYPTION_MODEL;

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
        if (StringUtils.isEmpty(criteria.getLimit()))
            criteria.setLimit(Integer.valueOf(batchSize));

        if (StringUtils.isEmpty(criteria.getOffset()))
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

        Integer startBatch = Math.toIntExact(criteria.getOffset());
        Integer batchSizeInput = Math.toIntExact(criteria.getLimit());

        Integer count = sewerageDao.getTotalApplications(criteria);

        log.info("Count: " + count);
        log.info("startbatch: " + startBatch);

        while (startBatch < count) {
            long startTime = System.nanoTime();
            List<SewerageConnection> sewerageConnectionList = new LinkedList<>();
            sewerageConnectionList = sewerageService.plainSearch(criteria, requestInfo);
            try {
                for (SewerageConnection sewerageConnection : sewerageConnectionList) {
                    /* encrypt here */
                    /*sewerageConnection = encryptionDecryptionUtil.encryptObject(sewerageConnection, WNS_ENCRYPTION_MODEL, SewerageConnection.class);
*/
                    SewerageConnectionRequest sewerageConnectionRequest = SewerageConnectionRequest.builder()
                            .requestInfo(requestInfo)
                            .sewerageConnection(sewerageConnection)
                            .build();

                    sewerageDao.updateOldSewerageConnections(sewerageConnectionRequest);

                    /* decrypt here */
                   /* sewerageConnection = encryptionDecryptionUtil.decryptObject(sewerageConnection, WNS_ENCRYPTION_MODEL, SewerageConnection.class, requestInfo);*/
                }
            } catch (Exception e) {
                log.error("Encryption failed at batch count of : " + startBatch);
                log.error("Encryption failed at batch count : " + startBatch + "=>" + e.getMessage());
                return finalSewerageList;
            }

            log.debug(" count completed for batch : " + startBatch);
            long endTime = System.nanoTime();
            long elapseTime = endTime - startTime;
            log.debug("\n\nBatch elapsed time: " + elapseTime + "\n\n");

            startBatch = startBatch + batchSizeInput;
            criteria.setOffset(Integer.valueOf(startBatch));
            log.info("SewerageConnections Count which pushed into kafka topic:" + countPushed);
            finalSewerageList.addAll(sewerageConnectionList);
        }
        criteria.setOffset(Integer.valueOf(batchOffset));

        return finalSewerageList;
    }

}
