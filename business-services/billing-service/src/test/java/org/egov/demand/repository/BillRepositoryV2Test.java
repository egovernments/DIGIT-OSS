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

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.*;

import org.egov.demand.repository.querybuilder.BillQueryBuilder;
import org.egov.demand.repository.rowmapper.BillRowMapperV2;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.BillRequest;
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



    @Test
    void testSaveBillDetailsbillv2() throws DataAccessException {
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


    @Test
    void testSaveBillAccountDetail() throws DataAccessException {
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});
        ArrayList<BillAccountDetailV2> billAccountDetails = new ArrayList<>();
        this.billRepositoryV2.saveBillAccountDetail(billAccountDetails, new AuditDetails());
        verify(this.jdbcTemplate).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
    }


    @Test
    void testUpdateBillStatus() {
        assertEquals(0, this.billRepositoryV2.updateBillStatus(new UpdateBillCriteria()).intValue());
    }



    @Test
    void testUpdateBillStatusgetcodes() {
        UpdateBillCriteria updateBillCriteria = mock(UpdateBillCriteria.class);
        when(updateBillCriteria.getConsumerCodes()).thenReturn(new HashSet<>());
        assertEquals(0, this.billRepositoryV2.updateBillStatus(updateBillCriteria).intValue());
        verify(updateBillCriteria).getConsumerCodes();
    }

    @Test
    void testUpdateBillStatusTenantId() throws DataAccessException {
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn(new ArrayList<>());
        when(this.billQueryBuilder.getBillQuery((BillSearchCriteria) any(),
                (List<Object>) any())).thenReturn("Bill Query");

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");
        UpdateBillCriteria updateBillCriteria = mock(UpdateBillCriteria.class);
        when(updateBillCriteria.getBusinessService()).thenReturn("Business Service");
        when(updateBillCriteria.getTenantId()).thenReturn("42");
        when(updateBillCriteria.getConsumerCodes()).thenReturn(stringSet);
        assertEquals(0, this.billRepositoryV2.updateBillStatus(updateBillCriteria).intValue());
        verify(this.jdbcTemplate).query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any());
        verify(this.billQueryBuilder).getBillQuery((BillSearchCriteria) any(),
                (List<Object>) any());
        verify(updateBillCriteria).getBusinessService();
        verify(updateBillCriteria).getTenantId();
        verify(updateBillCriteria).getConsumerCodes();
    }
}

