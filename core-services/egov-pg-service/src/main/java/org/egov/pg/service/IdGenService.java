package org.egov.pg.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.pg.config.AppProperties;
import org.egov.pg.models.IdGenerationResponse;
import org.egov.pg.models.Transaction;
import org.egov.pg.repository.IdGenRepository;
import org.egov.pg.repository.TransactionRepository;
import org.egov.pg.web.models.TransactionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class IdGenService {


    private IdGenRepository idGenRepository;
    private AppProperties appProperties;

    @Autowired
    public IdGenService(IdGenRepository idGenRepository, TransactionRepository transactionRepository, AppProperties
            appProperties) {
        this.idGenRepository = idGenRepository;
        this.appProperties = appProperties;
    }

    /**
     * Generate a transaction id from the ID Gen service
     * *
     *
     * @param transactionRequest Request for which ID should be generated
     * @return Transaction ID
     */
    String generateTxnId(TransactionRequest transactionRequest) {
        Transaction txn = transactionRequest.getTransaction();
        IdGenerationResponse response = idGenRepository.getId(transactionRequest.getRequestInfo(), txn.getTenantId(),
                appProperties.getIdGenName(), appProperties.getIdGenFormat(), 1);

        String txnId = response.getIdResponses().get(0).getId();
        log.info("Transaction ID Generated: " + txnId);

        return txnId;

    }


}

