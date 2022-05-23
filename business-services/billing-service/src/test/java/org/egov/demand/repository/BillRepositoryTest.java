package org.egov.demand.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.AuditDetail;
import org.egov.demand.model.AuditDetails;
import org.egov.demand.model.Bill;
import org.egov.demand.model.BillAccountDetail;
import org.egov.demand.model.BillDetail;
import org.egov.demand.model.BillSearchCriteria;
import org.egov.demand.model.BusinessServiceDetail;
import org.egov.demand.repository.querybuilder.BillQueryBuilder;
import org.egov.demand.repository.rowmapper.BillRowMapper;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.BillRequest;
import org.egov.demand.web.contract.BillResponse;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@ContextConfiguration(classes = {BillRepository.class})
@ExtendWith(SpringExtension.class)
class BillRepositoryTest {
    @MockBean
    private BillQueryBuilder billQueryBuilder;

    @Autowired
    private BillRepository billRepository;

    @MockBean
    private BillRowMapper billRowMapper;

    @MockBean
    private BusinessServiceDetailRepository businessServiceDetailRepository;

    @MockBean
    private JdbcTemplate jdbcTemplate;

    @MockBean
    private RestTemplate restTemplate;

    @MockBean
    private Util util;

    /**
     * Method under test: {@link BillRepository#findBill(BillSearchCriteria)}
     */
    @Test
    void testFindBill() throws DataAccessException {
        ArrayList<Object> objectList = new ArrayList<>();
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn(objectList);
        when(this.billQueryBuilder.getBillQuery((BillSearchCriteria) any(), (List<Object>) any())).thenReturn("Bill Query");
        List<Bill> actualFindBillResult = this.billRepository.findBill(new BillSearchCriteria());
        assertSame(objectList, actualFindBillResult);
        assertTrue(actualFindBillResult.isEmpty());
        verify(this.jdbcTemplate).query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any());
        verify(this.billQueryBuilder).getBillQuery((BillSearchCriteria) any(), (List<Object>) any());
    }

    /**
     * Method under test: {@link BillRepository#saveBill(BillRequest)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testSaveBill() throws DataAccessException {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.IndexOutOfBoundsException: Index 0 out of bounds for length 0
        //       at jdk.internal.util.Preconditions.outOfBounds(Preconditions.java:64)
        //       at jdk.internal.util.Preconditions.outOfBoundsCheckIndex(Preconditions.java:70)
        //       at jdk.internal.util.Preconditions.checkIndex(Preconditions.java:248)
        //       at java.util.Objects.checkIndex(Objects.java:372)
        //       at java.util.ArrayList.get(ArrayList.java:459)
        //       at org.egov.demand.repository.BillRepository.saveBillDetails(BillRepository.java:117)
        //       at org.egov.demand.repository.BillRepository.saveBill(BillRepository.java:109)
        //   In order to prevent saveBill(BillRequest)
        //   from throwing IndexOutOfBoundsException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   saveBill(BillRequest).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});
        this.billRepository.saveBill(new BillRequest());
    }

    /**
     * Method under test: {@link BillRepository#saveBill(BillRequest)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testSaveBill2() throws DataAccessException {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.BillRepository.saveBill(BillRepository.java:71)
        //   In order to prevent saveBill(BillRequest)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   saveBill(BillRequest).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});
        this.billRepository.saveBill(null);
    }

    /**
     * Method under test: {@link BillRepository#saveBill(BillRequest)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testSaveBill3() throws DataAccessException {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.IndexOutOfBoundsException: Index 0 out of bounds for length 0
        //       at jdk.internal.util.Preconditions.outOfBounds(Preconditions.java:64)
        //       at jdk.internal.util.Preconditions.outOfBoundsCheckIndex(Preconditions.java:70)
        //       at jdk.internal.util.Preconditions.checkIndex(Preconditions.java:248)
        //       at java.util.Objects.checkIndex(Objects.java:372)
        //       at java.util.ArrayList.get(ArrayList.java:459)
        //       at org.egov.demand.repository.BillRepository.saveBillDetails(BillRepository.java:117)
        //       at org.egov.demand.repository.BillRepository.saveBill(BillRepository.java:109)
        //   In order to prevent saveBill(BillRequest)
        //   from throwing IndexOutOfBoundsException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   saveBill(BillRequest).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(new ArrayList<>());
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        this.billRepository.saveBill(billRequest);
    }

    /**
     * Method under test: {@link BillRepository#saveBill(BillRequest)}
     */
    @Test
    void testSaveBill4() throws DataAccessException {
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(new Bill());
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(billList);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        this.billRepository.saveBill(billRequest);
        verify(this.jdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
        verify(billRequest, atLeast(1)).getBills();
        verify(billRequest).getRequestInfo();
    }

    /**
     * Method under test: {@link BillRepository#saveBill(BillRequest)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testSaveBill5() throws DataAccessException {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.BillRepository.saveBillDetails(BillRepository.java:117)
        //       at org.egov.demand.repository.BillRepository.saveBill(BillRepository.java:109)
        //   In order to prevent saveBill(BillRequest)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   saveBill(BillRequest).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(null);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(billList);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        this.billRepository.saveBill(billRequest);
    }

    /**
     * Method under test: {@link BillRepository#saveBill(BillRequest)}
     */
    @Test
    void testSaveBill6() throws DataAccessException {
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});

        Bill bill = new Bill();
        bill.addBillDetailsItem(new BillDetail());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(billList);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        this.billRepository.saveBill(billRequest);
        verify(this.jdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
        verify(billRequest, atLeast(1)).getBills();
        verify(billRequest).getRequestInfo();
    }

    /**
     * Method under test: {@link BillRepository#saveBill(BillRequest)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testSaveBill7() throws DataAccessException {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.BillRepository.saveBillDetails(BillRepository.java:120)
        //       at org.egov.demand.repository.BillRepository.saveBill(BillRepository.java:109)
        //   In order to prevent saveBill(BillRequest)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   saveBill(BillRequest).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(new Bill());
        billList.add(null);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(billList);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        this.billRepository.saveBill(billRequest);
    }

    /**
     * Method under test: {@link BillRepository#saveBill(BillRequest)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testSaveBill8() throws DataAccessException {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.BillRepository.saveBillDetails(BillRepository.java:124)
        //       at org.egov.demand.repository.BillRepository.saveBill(BillRepository.java:109)
        //   In order to prevent saveBill(BillRequest)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   saveBill(BillRequest).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});

        Bill bill = new Bill();
        bill.addBillDetailsItem(null);

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(billList);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        this.billRepository.saveBill(billRequest);
    }

    /**
     * Method under test: {@link BillRepository#saveBillDetails(BillRequest)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testSaveBillDetails() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.IndexOutOfBoundsException: Index 0 out of bounds for length 0
        //       at jdk.internal.util.Preconditions.outOfBounds(Preconditions.java:64)
        //       at jdk.internal.util.Preconditions.outOfBoundsCheckIndex(Preconditions.java:70)
        //       at jdk.internal.util.Preconditions.checkIndex(Preconditions.java:248)
        //       at java.util.Objects.checkIndex(Objects.java:372)
        //       at java.util.ArrayList.get(ArrayList.java:459)
        //       at org.egov.demand.repository.BillRepository.saveBillDetails(BillRepository.java:117)
        //   In order to prevent saveBillDetails(BillRequest)
        //   from throwing IndexOutOfBoundsException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   saveBillDetails(BillRequest).
        //   See https://diff.blue/R013 to resolve this issue.

        this.billRepository.saveBillDetails(new BillRequest());
    }

    /**
     * Method under test: {@link BillRepository#saveBillDetails(BillRequest)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testSaveBillDetails2() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.BillRepository.saveBillDetails(BillRepository.java:114)
        //   In order to prevent saveBillDetails(BillRequest)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   saveBillDetails(BillRequest).
        //   See https://diff.blue/R013 to resolve this issue.

        this.billRepository.saveBillDetails(null);
    }

    /**
     * Method under test: {@link BillRepository#saveBillDetails(BillRequest)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testSaveBillDetails3() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.IndexOutOfBoundsException: Index 0 out of bounds for length 0
        //       at jdk.internal.util.Preconditions.outOfBounds(Preconditions.java:64)
        //       at jdk.internal.util.Preconditions.outOfBoundsCheckIndex(Preconditions.java:70)
        //       at jdk.internal.util.Preconditions.checkIndex(Preconditions.java:248)
        //       at java.util.Objects.checkIndex(Objects.java:372)
        //       at java.util.ArrayList.get(ArrayList.java:459)
        //       at org.egov.demand.repository.BillRepository.saveBillDetails(BillRepository.java:117)
        //   In order to prevent saveBillDetails(BillRequest)
        //   from throwing IndexOutOfBoundsException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   saveBillDetails(BillRequest).
        //   See https://diff.blue/R013 to resolve this issue.

        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(new ArrayList<>());
        this.billRepository.saveBillDetails(billRequest);
    }

    /**
     * Method under test: {@link BillRepository#saveBillDetails(BillRequest)}
     */
    @Test
    void testSaveBillDetails4() throws DataAccessException {
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(new Bill());
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(billList);
        this.billRepository.saveBillDetails(billRequest);
        verify(this.jdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
        verify(billRequest).getBills();
    }

    /**
     * Method under test: {@link BillRepository#saveBillDetails(BillRequest)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testSaveBillDetails5() throws DataAccessException {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.BillRepository.saveBillDetails(BillRepository.java:117)
        //   In order to prevent saveBillDetails(BillRequest)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   saveBillDetails(BillRequest).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(null);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(billList);
        this.billRepository.saveBillDetails(billRequest);
    }

    /**
     * Method under test: {@link BillRepository#saveBillDetails(BillRequest)}
     */
    @Test
    void testSaveBillDetails6() throws DataAccessException {
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});

        Bill bill = new Bill();
        bill.addBillDetailsItem(new BillDetail());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(billList);
        this.billRepository.saveBillDetails(billRequest);
        verify(this.jdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
        verify(billRequest).getBills();
    }

    /**
     * Method under test: {@link BillRepository#saveBillDetails(BillRequest)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testSaveBillDetails7() throws DataAccessException {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.BillRepository.saveBillDetails(BillRepository.java:120)
        //   In order to prevent saveBillDetails(BillRequest)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   saveBillDetails(BillRequest).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(new Bill());
        billList.add(null);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(billList);
        this.billRepository.saveBillDetails(billRequest);
    }

    /**
     * Method under test: {@link BillRepository#saveBillDetails(BillRequest)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testSaveBillDetails8() throws DataAccessException {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.BillRepository.saveBillDetails(BillRepository.java:124)
        //   In order to prevent saveBillDetails(BillRequest)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   saveBillDetails(BillRequest).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});

        Bill bill = new Bill();
        bill.addBillDetailsItem(null);

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(billList);
        this.billRepository.saveBillDetails(billRequest);
    }

    /**
     * Method under test: {@link BillRepository#saveBillAccountDetail(java.util.List, AuditDetails)}
     */
    @Test
    void testSaveBillAccountDetail() throws DataAccessException {
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});
        ArrayList<BillAccountDetail> billAccountDetails = new ArrayList<>();
        this.billRepository.saveBillAccountDetail(billAccountDetails, new AuditDetails());
        verify(this.jdbcTemplate).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
    }

    /**
     * Method under test: {@link BillRepository#apportion(BillRequest)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testApportion() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.IndexOutOfBoundsException: Index 0 out of bounds for length 0
        //       at jdk.internal.util.Preconditions.outOfBounds(Preconditions.java:64)
        //       at jdk.internal.util.Preconditions.outOfBoundsCheckIndex(Preconditions.java:70)
        //       at jdk.internal.util.Preconditions.checkIndex(Preconditions.java:248)
        //       at java.util.Objects.checkIndex(Objects.java:372)
        //       at java.util.ArrayList.get(ArrayList.java:459)
        //       at org.egov.demand.repository.BillRepository.apportion(BillRepository.java:219)
        //   In order to prevent apportion(BillRequest)
        //   from throwing IndexOutOfBoundsException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   apportion(BillRequest).
        //   See https://diff.blue/R013 to resolve this issue.

        this.billRepository.apportion(new BillRequest());
    }

    /**
     * Method under test: {@link BillRepository#apportion(BillRequest)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testApportion2() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.BillRepository.apportion(BillRepository.java:211)
        //   In order to prevent apportion(BillRequest)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   apportion(BillRequest).
        //   See https://diff.blue/R013 to resolve this issue.

        this.billRepository.apportion(null);
    }

    /**
     * Method under test: {@link BillRepository#apportion(BillRequest)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testApportion3() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.IndexOutOfBoundsException: Index 0 out of bounds for length 0
        //       at jdk.internal.util.Preconditions.outOfBounds(Preconditions.java:64)
        //       at jdk.internal.util.Preconditions.outOfBoundsCheckIndex(Preconditions.java:70)
        //       at jdk.internal.util.Preconditions.checkIndex(Preconditions.java:248)
        //       at java.util.Objects.checkIndex(Objects.java:372)
        //       at java.util.ArrayList.get(ArrayList.java:459)
        //       at org.egov.demand.repository.BillRepository.apportion(BillRepository.java:219)
        //   In order to prevent apportion(BillRequest)
        //   from throwing IndexOutOfBoundsException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   apportion(BillRequest).
        //   See https://diff.blue/R013 to resolve this issue.

        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(new ArrayList<>());
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        this.billRepository.apportion(billRequest);
    }

    /**
     * Method under test: {@link BillRepository#apportion(BillRequest)}
     */
    @Test
    void testApportion4() {
        when(this.businessServiceDetailRepository.getBussinessServiceDetail((RequestInfo) any(),
                (org.egov.demand.web.contract.BusinessServiceDetailCriteria) any())).thenReturn(new ArrayList<>());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(new Bill());
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(billList);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        List<Bill> actualApportionResult = this.billRepository.apportion(billRequest);
        assertSame(billList, actualApportionResult);
        assertEquals(1, actualApportionResult.size());
        verify(this.businessServiceDetailRepository).getBussinessServiceDetail((RequestInfo) any(),
                (org.egov.demand.web.contract.BusinessServiceDetailCriteria) any());
        verify(billRequest).getBills();
        verify(billRequest).getRequestInfo();
    }

    /**
     * Method under test: {@link BillRepository#apportion(BillRequest)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testApportion5() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at java.util.stream.ReferencePipeline$2$1.accept(ReferencePipeline.java:176)
        //       at java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1655)
        //       at java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:484)
        //       at java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:474)
        //       at java.util.stream.ReduceOps$ReduceOp.evaluateSequential(ReduceOps.java:913)
        //       at java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
        //       at java.util.stream.ReferencePipeline.collect(ReferencePipeline.java:578)
        //       at org.egov.demand.repository.BillRepository.apportion(BillRepository.java:224)
        //   In order to prevent apportion(BillRequest)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   apportion(BillRequest).
        //   See https://diff.blue/R013 to resolve this issue.

        ArrayList<BusinessServiceDetail> businessServiceDetailList = new ArrayList<>();
        businessServiceDetailList.add(new BusinessServiceDetail());
        when(this.businessServiceDetailRepository.getBussinessServiceDetail((RequestInfo) any(),
                (org.egov.demand.web.contract.BusinessServiceDetailCriteria) any())).thenReturn(businessServiceDetailList);

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(new Bill());
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(billList);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        this.billRepository.apportion(billRequest);
    }

    /**
     * Method under test: {@link BillRepository#apportion(BillRequest)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testApportion6() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.BillRepository.apportion(BillRepository.java:219)
        //   In order to prevent apportion(BillRequest)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   apportion(BillRequest).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.businessServiceDetailRepository.getBussinessServiceDetail((RequestInfo) any(),
                (org.egov.demand.web.contract.BusinessServiceDetailCriteria) any())).thenReturn(new ArrayList<>());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(null);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(billList);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        this.billRepository.apportion(billRequest);
    }

    /**
     * Method under test: {@link BillRepository#apportion(BillRequest)}
     */
    @Test
    void testApportion7() {
        when(this.businessServiceDetailRepository.getBussinessServiceDetail((RequestInfo) any(),
                (org.egov.demand.web.contract.BusinessServiceDetailCriteria) any())).thenReturn(new ArrayList<>());

        Bill bill = new Bill();
        bill.addBillDetailsItem(new BillDetail());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(billList);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        List<Bill> actualApportionResult = this.billRepository.apportion(billRequest);
        assertSame(billList, actualApportionResult);
        assertEquals(1, actualApportionResult.size());
        verify(this.businessServiceDetailRepository).getBussinessServiceDetail((RequestInfo) any(),
                (org.egov.demand.web.contract.BusinessServiceDetailCriteria) any());
        verify(billRequest).getBills();
        verify(billRequest).getRequestInfo();
    }

    /**
     * Method under test: {@link BillRepository#apportion(BillRequest)}
     */
    @Test
    void testApportion8() throws RestClientException {
        when(this.restTemplate.postForObject((String) any(), (Object) any(), (Class<Object>) any(), (Object[]) any()))
                .thenReturn(new BillResponse());

        ArrayList<BusinessServiceDetail> businessServiceDetailList = new ArrayList<>();
        ArrayList<String> collectionModesNotAllowed = new ArrayList<>();
        businessServiceDetailList.add(new BusinessServiceDetail("42", "42", "Business Service", "Code",
                collectionModesNotAllowed, true, true, true, 2L, true, "https://example.org/example", new AuditDetail()));
        when(this.businessServiceDetailRepository.getBussinessServiceDetail((RequestInfo) any(),
                (org.egov.demand.web.contract.BusinessServiceDetailCriteria) any())).thenReturn(businessServiceDetailList);

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(new Bill());
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(billList);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        List<Bill> actualApportionResult = this.billRepository.apportion(billRequest);
        assertSame(billList, actualApportionResult);
        assertEquals(1, actualApportionResult.size());
        verify(this.restTemplate).postForObject((String) any(), (Object) any(), (Class<Object>) any(), (Object[]) any());
        verify(this.businessServiceDetailRepository).getBussinessServiceDetail((RequestInfo) any(),
                (org.egov.demand.web.contract.BusinessServiceDetailCriteria) any());
        verify(billRequest).getBills();
        verify(billRequest).getRequestInfo();
    }

    /**
     * Method under test: {@link BillRepository#apportion(BillRequest)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testApportion9() throws RestClientException {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.BillRepository.apportion(BillRepository.java:241)
        //   In order to prevent apportion(BillRequest)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   apportion(BillRequest).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.restTemplate.postForObject((String) any(), (Object) any(), (Class<Object>) any(), (Object[]) any()))
                .thenReturn(null);

        ArrayList<BusinessServiceDetail> businessServiceDetailList = new ArrayList<>();
        ArrayList<String> collectionModesNotAllowed = new ArrayList<>();
        businessServiceDetailList.add(new BusinessServiceDetail("42", "42", "Business Service", "Code",
                collectionModesNotAllowed, true, true, true, 2L, true, "https://example.org/example", new AuditDetail()));
        when(this.businessServiceDetailRepository.getBussinessServiceDetail((RequestInfo) any(),
                (org.egov.demand.web.contract.BusinessServiceDetailCriteria) any())).thenReturn(businessServiceDetailList);

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(new Bill());
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(billList);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        this.billRepository.apportion(billRequest);
    }

    /**
     * Method under test: {@link BillRepository#apportion(BillRequest)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testApportion10() throws RestClientException {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.BillRepository.apportion(BillRepository.java:235)
        //   In order to prevent apportion(BillRequest)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   apportion(BillRequest).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.restTemplate.postForObject((String) any(), (Object) any(), (Class<Object>) any(), (Object[]) any()))
                .thenReturn("Post For Object");

        ArrayList<BusinessServiceDetail> businessServiceDetailList = new ArrayList<>();
        ArrayList<String> collectionModesNotAllowed = new ArrayList<>();
        businessServiceDetailList.add(new BusinessServiceDetail("42", "42", "Business Service", "Code",
                collectionModesNotAllowed, true, true, true, 2L, true, "https://example.org/example", new AuditDetail()));
        when(this.businessServiceDetailRepository.getBussinessServiceDetail((RequestInfo) any(),
                (org.egov.demand.web.contract.BusinessServiceDetailCriteria) any())).thenReturn(businessServiceDetailList);

        ArrayList<BillDetail> billDetailList = new ArrayList<>();
        billDetailList.add(new BillDetail());
        Bill bill = mock(Bill.class);
        when(bill.getTenantId()).thenReturn("42");
        when(bill.getBillDetails()).thenReturn(billDetailList);
        doNothing().when(bill).setBillDetails((List<BillDetail>) any());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(billList);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        this.billRepository.apportion(billRequest);
    }
}

