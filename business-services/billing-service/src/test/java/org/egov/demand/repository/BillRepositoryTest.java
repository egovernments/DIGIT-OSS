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


    @Test
    void testSaveBill() throws DataAccessException {
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

    @Test
    void testSaveBillSuccess() throws DataAccessException {
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






    @Test
    void testSaveBillDetails() throws DataAccessException {
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




    @Test
    void testSaveBillDetailswithbilllist() throws DataAccessException {
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




    @Test
    void testSaveBillAccountDetail() throws DataAccessException {
        when(this.jdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any())).thenReturn(new int[]{1, 1, 1, 1});
        ArrayList<BillAccountDetail> billAccountDetails = new ArrayList<>();
        this.billRepository.saveBillAccountDetail(billAccountDetails, new AuditDetails());
        verify(this.jdbcTemplate).batchUpdate((String) any(),
                (org.springframework.jdbc.core.BatchPreparedStatementSetter) any());
    }




    @Test
    void testApportiongetbill() {
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


    @Test
    void testApportionRequest() {
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


    @Test
    void testApportionwithBusinessDetails() throws RestClientException {
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


}

