package org.egov.demand.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import org.egov.demand.model.AuditDetails;
import org.egov.demand.model.BillAccountDetailV2;
import org.egov.demand.model.BillDetailV2;

import org.egov.demand.model.BillSearchCriteria;
import org.egov.demand.model.BillV2;
import org.egov.demand.model.UpdateBillCriteria;
import org.egov.demand.repository.querybuilder.BillQueryBuilder;
import org.egov.demand.repository.rowmapper.BillRowMapperV2;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.BillRequestV2;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {BillRepositoryV2.class})
@ExtendWith(SpringExtension.class)
class BillRepositoryV2Test {
    @MockBean
    private BillQueryBuilder billQueryBuilder;

    @Autowired
    private BillRepositoryV2 billRepositoryV2;

    @MockBean
    private BillRowMapperV2 billRowMapperV2;

    @MockBean
    private JdbcTemplate jdbcTemplate;

    @MockBean
    private Util util;

    /**
     * Method under test: {@link BillRepositoryV2#findBill(BillSearchCriteria)}
     */
    @Test
    void testFindBill() throws DataAccessException {
        ArrayList<Object> objectList = new ArrayList<>();
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn(objectList);
        when(this.billQueryBuilder.getBillQuery((BillSearchCriteria) any(), (List<Object>) any())).thenReturn("Bill Query");
        List<BillV2> actualFindBillResult = this.billRepositoryV2.findBill(new BillSearchCriteria());
        assertSame(objectList, actualFindBillResult);
        assertTrue(actualFindBillResult.isEmpty());
        verify(this.jdbcTemplate).query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any());
        verify(this.billQueryBuilder).getBillQuery((BillSearchCriteria) any(), (List<Object>) any());
    }

    /**
     * Method under test: {@link BillRepositoryV2#saveBill(BillRequestV2)}
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
        //       at org.egov.demand.repository.BillRepositoryV2.saveBillDetails(BillRepositoryV2.java:99)
        //       at org.egov.demand.repository.BillRepositoryV2.saveBill(BillRepositoryV2.java:91)
        //   In order to prevent saveBill(BillRequestV2)
        //   from throwing IndexOutOfBoundsException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   saveBill(BillRequestV2).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});
        this.billRepositoryV2.saveBill(new BillRequestV2());
    }

    /**
     * Method under test: {@link BillRepositoryV2#saveBill(BillRequestV2)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testSaveBill2() throws DataAccessException {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.BillRepositoryV2.saveBill(BillRepositoryV2.java:60)
        //   In order to prevent saveBill(BillRequestV2)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   saveBill(BillRequestV2).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});
        this.billRepositoryV2.saveBill(null);
    }

    /**
     * Method under test: {@link BillRepositoryV2#saveBillDetails(BillRequestV2)}
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
        //       at org.egov.demand.repository.BillRepositoryV2.saveBillDetails(BillRepositoryV2.java:99)
        //   In order to prevent saveBillDetails(BillRequestV2)
        //   from throwing IndexOutOfBoundsException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   saveBillDetails(BillRequestV2).
        //   See https://diff.blue/R013 to resolve this issue.

        this.billRepositoryV2.saveBillDetails(new BillRequestV2());
    }

    /**
     * Method under test: {@link BillRepositoryV2#saveBillDetails(BillRequestV2)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testSaveBillDetails2() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.BillRepositoryV2.saveBillDetails(BillRepositoryV2.java:96)
        //   In order to prevent saveBillDetails(BillRequestV2)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   saveBillDetails(BillRequestV2).
        //   See https://diff.blue/R013 to resolve this issue.

        this.billRepositoryV2.saveBillDetails(null);
    }

    /**
     * Method under test: {@link BillRepositoryV2#saveBillDetails(BillRequestV2)}
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
        //       at org.egov.demand.repository.BillRepositoryV2.saveBillDetails(BillRepositoryV2.java:99)
        //   In order to prevent saveBillDetails(BillRequestV2)
        //   from throwing IndexOutOfBoundsException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   saveBillDetails(BillRequestV2).
        //   See https://diff.blue/R013 to resolve this issue.

        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getBills()).thenReturn(new ArrayList<>());
        this.billRepositoryV2.saveBillDetails(billRequestV2);
    }

    /**
     * Method under test: {@link BillRepositoryV2#saveBillDetails(BillRequestV2)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testSaveBillDetails4() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at java.util.ArrayList.addAll(ArrayList.java:702)
        //       at org.egov.demand.repository.BillRepositoryV2.saveBillDetails(BillRepositoryV2.java:106)
        //   In order to prevent saveBillDetails(BillRequestV2)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   saveBillDetails(BillRequestV2).
        //   See https://diff.blue/R013 to resolve this issue.

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(new BillV2());
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getBills()).thenReturn(billV2List);
        this.billRepositoryV2.saveBillDetails(billRequestV2);
    }

    /**
     * Method under test: {@link BillRepositoryV2#saveBillDetails(BillRequestV2)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testSaveBillDetails5() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at java.util.ArrayList.addAll(ArrayList.java:702)
        //       at org.egov.demand.repository.BillRepositoryV2.saveBillDetails(BillRepositoryV2.java:111)
        //   In order to prevent saveBillDetails(BillRequestV2)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   saveBillDetails(BillRequestV2).
        //   See https://diff.blue/R013 to resolve this issue.

        BillV2 billV2 = new BillV2();
        billV2.addBillDetailsItem(new BillDetailV2());

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(billV2);
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getBills()).thenReturn(billV2List);
        this.billRepositoryV2.saveBillDetails(billRequestV2);
    }

    /**
     * Method under test: {@link BillRepositoryV2#saveBillDetails(BillRequestV2)}
     */
    @Test
    void testSaveBillDetails6() throws DataAccessException {
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});

        BillV2 billV2 = new BillV2();
        billV2.setBillDetails(new ArrayList<>());

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(billV2);
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getBills()).thenReturn(billV2List);
        this.billRepositoryV2.saveBillDetails(billRequestV2);
        verify(this.jdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
        verify(billRequestV2).getBills();
    }

    /**
     * Method under test: {@link BillRepositoryV2#saveBillAccountDetail(java.util.List, AuditDetails)}
     */
    @Test
    void testSaveBillAccountDetail() throws DataAccessException {
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});
        ArrayList<BillAccountDetailV2> billAccountDetails = new ArrayList<>();
        this.billRepositoryV2.saveBillAccountDetail(billAccountDetails, new AuditDetails());
        verify(this.jdbcTemplate).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
    }

    /**
     * Method under test: {@link BillRepositoryV2#updateBillStatus(UpdateBillCriteria)}
     */
    @Test
    void testUpdateBillStatus() {
        assertEquals(0, this.billRepositoryV2.updateBillStatus(new UpdateBillCriteria()).intValue());
    }

    /**
     * Method under test: {@link BillRepositoryV2#updateBillStatus(UpdateBillCriteria)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateBillStatus2() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.BillRepositoryV2.updateBillStatus(BillRepositoryV2.java:196)
        //   In order to prevent updateBillStatus(UpdateBillCriteria)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateBillStatus(UpdateBillCriteria).
        //   See https://diff.blue/R013 to resolve this issue.

        this.billRepositoryV2.updateBillStatus(null);
    }

    /**
     * Method under test: {@link BillRepositoryV2#updateBillStatus(UpdateBillCriteria)}
     */
    @Test
    void testUpdateBillStatus3() {
        UpdateBillCriteria updateBillCriteria = mock(UpdateBillCriteria.class);
        when(updateBillCriteria.getConsumerCodes()).thenReturn(new HashSet<>());
        assertEquals(0, this.billRepositoryV2.updateBillStatus(updateBillCriteria).intValue());
        verify(updateBillCriteria).getConsumerCodes();
    }

    /**
     * Method under test: {@link BillRepositoryV2#updateBillStatus(UpdateBillCriteria)}
     */
    @Test
    void testUpdateBillStatus4() throws DataAccessException {
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn(new ArrayList<>());
        when(this.billQueryBuilder.getBillQuery((org.egov.demand.model.BillSearchCriteria) any(),
                (java.util.List<Object>) any())).thenReturn("Bill Query");

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");
        UpdateBillCriteria updateBillCriteria = mock(UpdateBillCriteria.class);
        when(updateBillCriteria.getBusinessService()).thenReturn("Business Service");
        when(updateBillCriteria.getTenantId()).thenReturn("42");
        when(updateBillCriteria.getConsumerCodes()).thenReturn(stringSet);
        assertEquals(0, this.billRepositoryV2.updateBillStatus(updateBillCriteria).intValue());
        verify(this.jdbcTemplate).query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any());
        verify(this.billQueryBuilder).getBillQuery((org.egov.demand.model.BillSearchCriteria) any(),
                (java.util.List<Object>) any());
        verify(updateBillCriteria).getBusinessService();
        verify(updateBillCriteria).getTenantId();
        verify(updateBillCriteria).getConsumerCodes();
    }
}

