package org.egov.pg.validator;

import static java.util.Objects.isNull;
import static org.springframework.util.StringUtils.isEmpty;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.egov.common.contract.request.User;
import org.egov.pg.config.AppProperties;
import org.egov.pg.constants.PgConstants;
import org.egov.pg.models.TaxAndPayment;
import org.egov.pg.models.Transaction;
import org.egov.pg.repository.TransactionRepository;
import org.egov.pg.service.GatewayService;
import org.egov.pg.service.PaymentsService;
import org.egov.pg.web.models.TransactionCriteria;
import org.egov.pg.web.models.TransactionRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class TransactionValidator {

    private GatewayService gatewayService;
    private TransactionRepository transactionRepository;
    private PaymentsService paymentsService;
    private AppProperties props;


    @Autowired
    public TransactionValidator(GatewayService gatewayService, TransactionRepository transactionRepository, 
    		PaymentsService paymentsService, AppProperties props) {
        this.gatewayService = gatewayService;
        this.transactionRepository = transactionRepository;
        this.paymentsService = paymentsService;
        this.props = props;
    }

    /**
     * Validate the transaction,
     * Check if gateway is available and active
     * Check if module specific order id is unique
     *
     * @param transactionRequest txn object to be validated
     */
    public void validateCreateTxn(TransactionRequest transactionRequest) {
        Map<String, String> errorMap = new HashMap<>();
        isUserDetailPresent(transactionRequest, errorMap);
        isGatewayActive(transactionRequest.getTransaction(), errorMap);
        validateIfTxnExistsForBill(transactionRequest, errorMap);
        validateTxnAmount(transactionRequest, errorMap);


        if (!errorMap.isEmpty())
            throw new CustomException(errorMap);
        else
        	paymentsService.validatePayment(transactionRequest);

    }

    /**
     * Validate update of transaction
     * Check if transaction id exists in query params provided
     * Check if transaction id exists in system
     *
     * @param requestParams
     * @return
     */
    public Transaction validateUpdateTxn(Map<String, String> requestParams) {

        Optional<String> optional = gatewayService.getTxnId(requestParams);

        if (!optional.isPresent())
            throw new CustomException("MISSING_UPDATE_TXN_ID", "Cannot process request, missing transaction id");

        TransactionCriteria criteria = TransactionCriteria.builder()
                .txnId(optional.get())
                .build();

        List<Transaction> statuses = transactionRepository.fetchTransactions(criteria);

        //TODO Add to error queue
        if (statuses.isEmpty()) {
            throw new CustomException("TXN_UPDATE_NOT_FOUND", "Transaction not found");
        }

        return statuses.get(0);
    }

    public boolean skipGateway(Transaction transaction){
        return new BigDecimal(transaction.getTxnAmount()).compareTo(BigDecimal.ZERO) == 0;
    }

    public boolean shouldGenerateReceipt(Transaction prevStatus, Transaction newStatus) {
        if(prevStatus.getTxnStatus().equals(Transaction.TxnStatusEnum.SUCCESS) && !isEmpty(prevStatus.getReceipt())) {
            return false;
        }

        if (newStatus.getTxnStatus().equals(Transaction.TxnStatusEnum.SUCCESS)) {
            if (new BigDecimal(prevStatus.getTxnAmount()).compareTo(new BigDecimal(newStatus.getTxnAmount())) == 0) {
                newStatus.setTxnStatus(Transaction.TxnStatusEnum.SUCCESS);
                newStatus.setTxnStatusMsg(PgConstants.TXN_SUCCESS);
                return true;
            } else {
                log.error("Transaction Amount mismatch, expected {} got {}", prevStatus.getTxnAmount(), newStatus
                        .getTxnAmount());
                newStatus.setTxnStatus(Transaction.TxnStatusEnum.FAILURE);
                newStatus.setTxnStatusMsg(PgConstants.TXN_FAILURE_AMT_MISMATCH);
                return false;
            }
        } else {
            newStatus.setTxnStatus(Transaction.TxnStatusEnum.FAILURE);
            newStatus.setTxnStatusMsg(PgConstants.TXN_FAILURE_GATEWAY);
            return false;
        }
    }


    /**
     * Validations if transaction(s) already exists for this bill
     * No transaction should exists in success / pending state for this bill     *
     *
     * @param transactionRequest Request for which validation should happen
     * @param errorMap     Map of errors occurred during validations
     */
    private void validateIfTxnExistsForBill(TransactionRequest transactionRequest, Map<String, String> errorMap) {
        Transaction txn = transactionRequest.getTransaction();
        TransactionCriteria criteria = TransactionCriteria.builder()
                .billId(txn.getBillId())
                .build();

        List<Transaction> existingTxnsForBill = transactionRepository.fetchTransactions(criteria);

        for (Transaction curr : existingTxnsForBill) {
            if (curr.getTxnStatus().equals(Transaction.TxnStatusEnum.PENDING)) {
                errorMap.put("TXN_ABRUPTLY_DISCARDED", 
                		"A transaction for this bill has been abruptly discarded, please retry after "+(props.getEarlyReconcileJobRunInterval() * 2)+" mins");
            }
            if(curr.getTxnStatus().equals(Transaction.TxnStatusEnum.SUCCESS)) {
                errorMap.put("TXN_CREATE_BILL_ALREADY_PAID", "Bill has already been paid or is in pending state");
            }
        }

    }

    private void isUserDetailPresent(TransactionRequest transactionRequest, Map<String, String> errorMap) {
        User user = transactionRequest.getRequestInfo().getUserInfo();
        if (isNull(user) || isNull(user.getUuid()) || isEmpty(user.getName()) || isNull(user.getUserName()) ||
                isNull(user.getTenantId()) || isNull(user.getMobileNumber()))
            errorMap.put("INVALID_USER_DETAILS", "User UUID, Name, Username, Mobile Number and Tenant Id are " +
                    "mandatory");
    }

    private void validateTxnAmount(TransactionRequest transactionRequest, Map<String, String> errorMap){
        Transaction txn = transactionRequest.getTransaction();
        BigDecimal totalPaid = BigDecimal.ZERO;

        for(TaxAndPayment taxAndPayment : txn.getTaxAndPayments()){
            totalPaid = totalPaid.add(taxAndPayment.getAmountPaid());
        }
        if(totalPaid.compareTo(new BigDecimal(txn.getTxnAmount())) != 0)
            errorMap.put("TXN_CREATE_INVALID_TXN_AMT", "Transaction amount should be equal to sum of all " +
                    " amountPaids in taxAndPayments");

    }

    private void isGatewayActive(Transaction transaction, Map<String, String> errorMap) {
        if (!gatewayService.isGatewayActive(transaction.getGateway()))
            errorMap.put("INVALID_PAYMENT_GATEWAY", "Invalid or inactive payment gateway provided");
    }


}
