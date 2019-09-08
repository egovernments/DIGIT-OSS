package org.egov.pg.validator;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.pg.models.*;
import org.egov.pg.repository.TransactionRepository;
import org.egov.pg.service.CollectionService;
import org.egov.pg.service.GatewayService;
import org.egov.pg.web.models.TransactionCriteria;
import org.egov.pg.web.models.TransactionRequest;
import org.egov.tracer.model.CustomException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class TransactionValidatorTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private GatewayService gatewayService;

    @Mock
    private CollectionService collectionService;

    private TransactionValidator validator;
    private List<Bill> bills;
    private Transaction txn;

    @Before
    public void setUp() {
        validator = new TransactionValidator(gatewayService, transactionRepository, collectionService);
        TaxAndPayment taxAndPayment = TaxAndPayment.builder()
                .amountPaid(new BigDecimal("100"))
                .businessService("PT")
                .taxAmount(new BigDecimal("100"))
                .build();
        txn = Transaction.builder().txnAmount("100")
                .txnStatus(Transaction.TxnStatusEnum.PENDING)
                .billId("ORDER0012")
                .module("PT")
                .txnAmount("100")
                .productInfo("Property Tax Payment")
                .gateway("ABCD123")
                .consumerCode("PT-21055")
                .taxAndPayments(Collections.singletonList(taxAndPayment))
                .build();
        BillDetail billDetail = BillDetail.builder().partPaymentAllowed(false).totalAmount(new BigDecimal(100)).build();
        bills = Collections.singletonList(Bill.builder().billDetails(Collections.singletonList(billDetail))
                .build());
    }

    @Test
    public void validateCreateTxnSuccess() {
        User user = User.builder().userName("").name("XYZ").uuid("").tenantId("").mobileNumber("9999999999").build();
        RequestInfo requestInfo = RequestInfo.builder().userInfo(user).build();
        TransactionRequest transactionRequest = new TransactionRequest(requestInfo, txn);


        when(transactionRepository.fetchTransactions(any(TransactionCriteria.class))).thenReturn(Collections.emptyList());
        when(gatewayService.isGatewayActive(txn.getGateway())).thenReturn(true);
        when(collectionService.validateProvisionalReceipt(transactionRequest)).thenReturn(Collections.singletonList(new Receipt()));

        validator.validateCreateTxn(transactionRequest);

    }

    /**
     * Txn Amount lesser than bill amount but partial payment is enabled
     */
    @Test(expected = CustomException.class)
    public void validateCreateTxnByValidatingProvReceipt() {
        User user = User.builder().userName("").name("XYZ").uuid("").tenantId("").mobileNumber("9999999999").build();
        RequestInfo requestInfo = RequestInfo.builder().userInfo(user).build();
        TransactionRequest transactionRequest = new TransactionRequest(requestInfo, txn);

        when(transactionRepository.fetchTransactions(any(TransactionCriteria.class))).thenReturn(Collections.emptyList());
        when(gatewayService.isGatewayActive(txn.getGateway())).thenReturn(true);
        when(collectionService.validateProvisionalReceipt(transactionRequest)).thenThrow(new CustomException());


        validator.validateCreateTxn(transactionRequest);

    }

    /**
     * Duplicate order id and module combination
     */
    @Test(expected = CustomException.class)
    public void validateCreateTxnDuplicateOrder() {
        User user = User.builder().userName("").name("XYZ").uuid("").tenantId("").mobileNumber("9999999999").build();
        RequestInfo requestInfo = RequestInfo.builder().userInfo(user).build();
        TransactionRequest transactionRequest = new TransactionRequest(requestInfo, txn);

        when(transactionRepository.fetchTransactions(any(TransactionCriteria.class))).thenReturn(Collections.singletonList(txn));
        when(gatewayService.isGatewayActive(txn.getGateway())).thenReturn(true);
        when(collectionService.validateProvisionalReceipt(transactionRequest)).thenReturn(Collections.singletonList(new Receipt()));


        validator.validateCreateTxn(transactionRequest);

    }

    /**
     * Invalid Gateway, inactive or not available
     */
    @Test(expected = CustomException.class)
    public void validateCreateTxnInvalidGateway() {
        User user = User.builder().userName("").name("XYZ").uuid("").tenantId("").mobileNumber("9999999999").build();
        RequestInfo requestInfo = RequestInfo.builder().userInfo(user).build();
        TransactionRequest transactionRequest = new TransactionRequest(requestInfo, txn);

        when(gatewayService.isGatewayActive(txn.getGateway())).thenReturn(false);
        when(collectionService.validateProvisionalReceipt(transactionRequest)).thenReturn(Collections.singletonList(new Receipt()));

        validator.validateCreateTxn(transactionRequest);

    }


    @Test
    public void validateUpdateTxnSuccess() {
        Transaction txnStatus = Transaction.builder().txnId("PT_001")
                .txnAmount("100")
                .billId("ORDER0012")
                .txnStatus(Transaction.TxnStatusEnum.PENDING)
                .productInfo("Property Tax Payment")
                .gateway("PAYTM")
                .build();

        when(gatewayService.getTxnId(any(Map.class))).thenReturn(Optional.of("PB_PG_001"));
        when(transactionRepository.fetchTransactions(any(TransactionCriteria.class))).thenReturn(Collections.singletonList
                (txnStatus));

        validator.validateUpdateTxn(Collections.singletonMap("transactionId", "PB_PG_001"));

    }

    /**
     * Transaction Id not found in the request params
     */
    @Test(expected = CustomException.class)
    public void validateUpdateTxnIdNotFound() {

        when(gatewayService.getTxnId(any(Map.class))).thenReturn(Optional.empty());

        validator.validateUpdateTxn(Collections.singletonMap("transactionId", "PB_PG_001"));
    }

    /**
     * Invalid Transaction id, not available in our store
     */
    @Test(expected = CustomException.class)
    public void validateUpdateTxnInvalidId() {

        when(gatewayService.getTxnId(any(Map.class))).thenReturn(Optional.of("PB_PG_001"));
        when(transactionRepository.fetchTransactions(any(TransactionCriteria.class))).thenReturn(Collections.emptyList());

        validator.validateUpdateTxn(Collections.singletonMap("transactionId", "PB_PG_001"));
    }

}
