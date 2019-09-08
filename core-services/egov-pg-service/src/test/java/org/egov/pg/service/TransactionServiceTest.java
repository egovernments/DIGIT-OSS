package org.egov.pg.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pg.config.AppProperties;
import org.egov.pg.models.Bill;
import org.egov.pg.models.BillDetail;
import org.egov.pg.models.Receipt;
import org.egov.pg.models.Transaction;
import org.egov.pg.producer.Producer;
import org.egov.pg.repository.TransactionRepository;
import org.egov.pg.validator.TransactionValidator;
import org.egov.pg.web.models.TransactionCriteria;
import org.egov.pg.web.models.TransactionRequest;
import org.egov.pg.web.models.User;
import org.egov.tracer.model.CustomException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.dao.TransientDataAccessResourceException;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class TransactionServiceTest {

    private TransactionService transactionService;

    @Mock
    private Producer producer;

    @Mock
    private GatewayService gatewayService;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private EnrichmentService enrichmentService;

    @Mock
    private AppProperties appProperties;

    @Mock
    private TransactionValidator validator;

    @Mock
    private CollectionService collectionService;

    private User user;
    private RequestInfo requestInfo;

    @Before
    public void setUp() {
        user = User.builder().userName("USER001").mobileNumber("9XXXXXXXXX").name("XYZ").tenantId("pb").emailId("").build();
        requestInfo = new RequestInfo("", "", 0L, "", "", "", "", "", "", null);


        when(gatewayService.getTxnId(any(Map.class))).thenReturn(Optional.of("ORDERID"));

        Mockito.doNothing().when(producer).push(any(String.class), any(Object.class));

        Mockito.doNothing().when(enrichmentService).enrichCreateTransaction(any(TransactionRequest.class));

        this.transactionService = new TransactionService(validator, gatewayService, producer, transactionRepository,
                collectionService,
                enrichmentService,
                appProperties);
    }

    /**
     * Valid test for initiating a transaction
     * @throws URISyntaxException
     */

    @Test
    public void initiateTransactionSuccessTest() throws URISyntaxException {
        String redirectUrl = "https://paytm.com";


        Transaction txn = Transaction.builder().txnAmount("100")
                .billId("ORDER0012")
                .productInfo("Property Tax Payment")
                .gateway("PAYTM")
                .build();
        TransactionRequest transactionRequest = new TransactionRequest(requestInfo, txn);

        Mockito.doNothing().when(validator).validateCreateTxn(any(TransactionRequest.class));
        when(validator.skipGateway(txn)).thenReturn(false);
        when(gatewayService.initiateTxn(any(Transaction.class))).thenReturn(new URI(redirectUrl));

        Transaction resp = transactionService.initiateTransaction(transactionRequest);

        assertTrue(resp.getRedirectUrl().equalsIgnoreCase(redirectUrl));

    }

    /**
     * Test for invalid or inactive gateway
     */
    @Test(expected = CustomException.class)
    public void initiateTransactionFailTest(){
        Transaction txn = Transaction.builder().txnAmount("100")
                .billId("ORDER0012")
                .productInfo("Property Tax Payment")
                .gateway("ABCD123")
                .build();
        TransactionRequest transactionRequest = new TransactionRequest(requestInfo, txn);

        Mockito.doThrow(new CustomException("INVALID_GATEWAY", "Invalid Gateway")).when(validator).validateCreateTxn(any(TransactionRequest.class));
        when(gatewayService.initiateTxn(any(Transaction.class))).thenThrow(new CustomException());

        Transaction resp = transactionService.initiateTransaction(transactionRequest);

    }

    /**
     * Test for invalid or inactive gateway
     */
    @Test
    public void initiateTransactionSkipGatewayTest(){
        String receiptNumber = "XYZ";
        Transaction txn = Transaction.builder().txnAmount("100")
                .billId("ORDER0012")
                .productInfo("Property Tax Payment")
                .gateway("ABCD123")
                .txnAmount("0")
                .build();
        TransactionRequest transactionRequest = new TransactionRequest(requestInfo, txn);

        BillDetail billDetail = BillDetail.builder().receiptNumber(receiptNumber).build();

        Bill bill = Bill.builder().billDetails(Collections.singletonList(billDetail)).build();

        Receipt receipt = Receipt.builder()
                .transactionId("DEFA15273")
                .bill(Collections.singletonList(bill))
                .build();

        Mockito.doNothing().when(validator).validateCreateTxn(any(TransactionRequest.class));

        when(gatewayService.initiateTxn(any(Transaction.class))).thenThrow(new CustomException());
        when(validator.skipGateway(txn)).thenReturn(true);
        when(collectionService.generateReceipt(any(RequestInfo.class), any(Transaction.class))).thenReturn
                (Collections.singletonList(receipt));
        Transaction resp = transactionService.initiateTransaction(transactionRequest);

        assertTrue(resp.getReceipt().equalsIgnoreCase(receiptNumber));

    }


    /**
     * Test for fetching transactions based on criteria
     */
    @Test
    public void getTransactionsSuccessTest(){
        Transaction txn = Transaction.builder().txnId("PT_001")
                .txnAmount("100")
                .tenantId("pb")
                .billId("ORDER0012")
                .productInfo("Property Tax Payment")
                .gateway("ABCD123")
                .build();
        TransactionCriteria criteria = TransactionCriteria.builder().tenantId("pb").txnId("PT_001").build();

        when(transactionRepository.fetchTransactions(criteria)).thenReturn(Collections.singletonList(txn));
        assertEquals(1, transactionService.getTransactions(criteria).size());

        when(transactionRepository.fetchTransactions(criteria)).thenReturn(Collections.emptyList());
        assertEquals(0, transactionService.getTransactions(criteria).size());
    }

    /**
     * DB error occurs while running fetch
     */
    @Test(expected = CustomException.class)
    public void getTransactionsFailTest(){
        TransactionCriteria criteria = TransactionCriteria.builder().tenantId("pb").txnId("PT_001").build();
        when(transactionRepository.fetchTransactions(criteria)).thenThrow(new TransientDataAccessResourceException("test"));

        transactionService.getTransactions(criteria);
    }

    @Test
    public void updateTransactionSuccessTest() {

        Transaction txnStatus = Transaction.builder().txnId("PT_001")
                .txnAmount("100")
                .billId("ORDER0012")
                .txnStatus(Transaction.TxnStatusEnum.PENDING)
                .productInfo("Property Tax Payment")
                .gateway("PAYTM")
                .build();

        Transaction finalTxnStatus = Transaction.builder().txnId("PT_001")
                .txnAmount("100.00")
                .billId("ORDER0012")
                .txnStatus(Transaction.TxnStatusEnum.SUCCESS)
                .productInfo("Property Tax Payment")
                .gateway("PAYTM")
                .build();


        BillDetail billDetail = BillDetail.builder().receiptNumber("XYZ").build();

        Bill bill = Bill.builder().billDetails(Collections.singletonList(billDetail)).build();

        Receipt receipt = Receipt.builder()
                .transactionId("DEFA15273")
                .bill(Collections.singletonList(bill))
                .build();

        when(validator.validateUpdateTxn(any(Map.class))).thenReturn(txnStatus);
        when(validator.skipGateway(any(Transaction.class))).thenReturn(false);
        when(validator.shouldGenerateReceipt(any(Transaction.class), any(Transaction.class))).thenReturn(true);
        when(gatewayService.getLiveStatus(txnStatus, Collections.singletonMap("ORDERID", "PT_001"))).thenReturn(finalTxnStatus);
        when(collectionService.generateReceipt(any(RequestInfo.class), any(Transaction.class))).thenReturn
                (Collections.singletonList(receipt));

        assertEquals(transactionService.updateTransaction(requestInfo, Collections.singletonMap
                ("ORDERID", "PT_001")).get(0).getTxnStatus(), Transaction.TxnStatusEnum.SUCCESS);
    }

    /**
     * Invalid transaction id key,
     *  ex, ORDERID, specific to gateway
     */
    @Test(expected = CustomException.class)
    public void updateTransactionFailTest(){

        when(validator.validateUpdateTxn(any(Map.class))).thenThrow(new CustomException("MISSING_TXN_ID", "Cannot process request, missing transaction id"));

        transactionService.updateTransaction(requestInfo, Collections.singletonMap("abc", "PT_001"));

    }

    /**
     * No record of the Transaction exists in DB
     */
    @Test(expected = CustomException.class)
    public void updateTransactionInvalidTxnIdTest() {

        when(validator.validateUpdateTxn(any(Map.class))).thenThrow(new CustomException("TXN_NOT_FOUND", "Transaction not found"));

        transactionService.updateTransaction(requestInfo, Collections.singletonMap("abc", "PT_001"));
    }
}
