package org.egov.pg.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pg.config.AppProperties;
import org.egov.pg.constants.PgConstants;
import org.egov.pg.models.Receipt;
import org.egov.pg.models.Transaction;
import org.egov.pg.models.TransactionDump;
import org.egov.pg.models.TransactionDumpRequest;
import org.egov.pg.producer.Producer;
import org.egov.pg.repository.TransactionRepository;
import org.egov.pg.validator.TransactionValidator;
import org.egov.pg.web.models.TransactionCriteria;
import org.egov.pg.web.models.TransactionRequest;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Handles all transaction related requests
 */
@Service
@Slf4j
public class TransactionService {

    private TransactionValidator validator;
    private GatewayService gatewayService;
    private Producer producer;
    private EnrichmentService enrichmentService;
    private AppProperties appProperties;
    private TransactionRepository transactionRepository;
    private CollectionService collectionService;


    @Autowired
    TransactionService(TransactionValidator validator, GatewayService gatewayService, Producer producer,
                       TransactionRepository
                               transactionRepository, CollectionService collectionService,
                       EnrichmentService enrichmentService,
                       AppProperties appProperties) {
        this.validator = validator;
        this.gatewayService = gatewayService;
        this.producer = producer;
        this.transactionRepository = transactionRepository;
        this.collectionService = collectionService;
        this.enrichmentService = enrichmentService;
        this.appProperties = appProperties;
    }

    /**
     * Initiates a transaction by generating a gateway redirect URI for the request
     * <p>
     * 1. Validates transaction object
     * 2. Enriches the request by assigning a TxnID and a default status of PENDING
     * 3. If yes, calls the gateway's implementation to generate a redirect URI
     * 4. Persists the transaction and a transaction dump with the RAW requests asynchronously
     * 5. Returns the redirect URI
     *
     * @param transactionRequest Valid transaction request for which transaction needs to be initiated
     * @return Redirect URI to the gateway for the particular transaction
     */
    public Transaction initiateTransaction(TransactionRequest transactionRequest) {
        validator.validateCreateTxn(transactionRequest);

        // Enrich transaction by generating txnid, audit details, default status
        enrichmentService.enrichCreateTransaction(transactionRequest);

        RequestInfo requestInfo = transactionRequest.getRequestInfo();
        Transaction transaction = transactionRequest.getTransaction();

        TransactionDump dump = TransactionDump.builder()
                .txnId(transaction.getTxnId())
                .auditDetails(transaction.getAuditDetails())
                .build();

        if(validator.skipGateway(transaction)){
            transaction.setTxnStatus(Transaction.TxnStatusEnum.SUCCESS);
            generateReceipt(requestInfo, transaction);
        }
        else{
            URI uri = gatewayService.initiateTxn(transaction);
            transaction.setRedirectUrl(uri.toString());

            dump.setTxnRequest(uri.toString());
        }

        // Persist transaction and transaction dump objects
        producer.push(appProperties.getSaveTxnTopic(), new org.egov.pg.models.TransactionRequest
                (requestInfo, transaction));
        producer.push(appProperties.getSaveTxnDumpTopic(), new TransactionDumpRequest(requestInfo, dump));

        return transaction;
    }


    /**
     * Fetches a list of transactions matching the current criteria
     * <p>
     * Currently has a hard limit of 5 records, configurable
     *
     * @param transactionCriteria Search Conditions that should be matched
     * @return List of transactions matching the conditions.
     */
    public List<Transaction> getTransactions(TransactionCriteria transactionCriteria) {
        log.info(transactionCriteria.toString());
        try {
            return transactionRepository.fetchTransactions(transactionCriteria);
        } catch (DataAccessException e) {
            log.error("Unable to fetch data from the database for criteria: " + transactionCriteria.toString(), e);
            throw new CustomException("FETCH_TXNS_FAILED", "Unable to fetch transactions from store");
        }
    }

    /**
     * Updates the status of the transaction from the gateway
     * <p>
     * 1. Fetch TXN ID from the request params, if not found, exit!
     * 2. Fetch current transaction status from DB, if not found, exit!
     * 3. Fetch the current transaction status from the payment gateway
     * 4. Verify the amount returned from the gateway matches our records
     * 5. If successful, generate receipt
     * 6. Persist the updated transaction status and raw gateway transaction response
     *
     * @param requestInfo
     * @param requestParams Response parameters posted by the gateway
     * @return Updated transaction
     */
    public List<Transaction> updateTransaction(RequestInfo requestInfo, Map<String, String> requestParams) {

        Transaction currentTxnStatus = validator.validateUpdateTxn(requestParams);

        log.debug(currentTxnStatus.toString());
        log.debug(requestParams.toString());

        Transaction newTxn = null;

        if(validator.skipGateway(currentTxnStatus)) {
            newTxn = currentTxnStatus;

        } else{
            newTxn = gatewayService.getLiveStatus(currentTxnStatus, requestParams);

            // Enrich the new transaction status before persisting
            enrichmentService.enrichUpdateTransaction(new TransactionRequest(requestInfo, currentTxnStatus), newTxn);
        }

        // Check if transaction is successful, amount matches etc
        if (validator.shouldGenerateReceipt(currentTxnStatus, newTxn)) {
            generateReceipt(requestInfo, newTxn);
        }

        TransactionDump dump = TransactionDump.builder()
                .txnId(currentTxnStatus.getTxnId())
                .txnResponse(newTxn.getResponseJson())
                .auditDetails(newTxn.getAuditDetails())
                .build();

        producer.push(appProperties.getUpdateTxnTopic(), new org.egov.pg.models.TransactionRequest(requestInfo, newTxn));
        producer.push(appProperties.getUpdateTxnDumpTopic(), new TransactionDumpRequest(requestInfo, dump));

        return Collections.singletonList(newTxn);
    }

    private void generateReceipt(RequestInfo requestInfo, Transaction transaction) {
        try {
            List<Receipt> receipts = collectionService.generateReceipt(requestInfo, transaction);
            transaction.setReceipt(receipts.get(0).getBill().get(0).getBillDetails().get(0).getReceiptNumber());
        } catch (CustomException | ServiceCallException e) {
            log.error("Unable to generate receipt ", e);
            transaction.setTxnStatusMsg(PgConstants.TXN_RECEIPT_GEN_FAILED);
        }

    }

}
