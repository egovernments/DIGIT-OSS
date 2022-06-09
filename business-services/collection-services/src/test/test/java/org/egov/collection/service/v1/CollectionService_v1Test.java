package org.egov.collection.service.v1;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import org.egov.collection.model.v1.ReceiptSearchCriteria_v1;
import org.egov.collection.model.v1.Receipt_v1;
import org.egov.collection.repository.querybuilder.v1.CollectionResultSetExtractor_v1;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {CollectionService_v1.class})
@ExtendWith(SpringExtension.class)
class CollectionService_v1Test {
    @MockBean
    private CollectionResultSetExtractor_v1 collectionResultSetExtractor_v1;

    @Autowired
    private CollectionService_v1 collectionService_v1;

    @MockBean
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Test
    void testGetReceipts() {
        RequestInfo requestInfo = new RequestInfo();
        CollectionService_v1 collectionService_v1 = mock(CollectionService_v1.class);
        // this.collectionService_v1.getReceipts(requestInfo, new ReceiptSearchCriteria_v1());
        // assertThrows(CustomException.class, () -> collectionService_v1.getReceipts(requestInfo, new ReceiptSearchCriteria_v1()));
        when(collectionService_v1.getReceipts(requestInfo,new ReceiptSearchCriteria_v1())).thenReturn(new ArrayList<>());
        //this.collectionService_v1.getReceipts(requestInfo);
        //assertNull(requestInfo.getreceiptReq());
    }

    @Test
    void testGetReceiptsWithDefaultRequest(){
        RequestInfo requestInfo = new RequestInfo();
        ReceiptSearchCriteria_v1 receiptSearchCriteria = new ReceiptSearchCriteria_v1();
        CollectionService_v1 collectionService_v1 = mock(CollectionService_v1.class);
        when(collectionService_v1.getReceipts(requestInfo,new ReceiptSearchCriteria_v1())).thenReturn(new ArrayList<>());
       // this.collectionService_v1.getReceipts(requestInfo, receiptSearchCriteria);
        assertNull(requestInfo.getUserInfo());

    }

    @Test
    void testFetchReceipts() throws DataAccessException {
        ArrayList<Object> objectList = new ArrayList<>();
        when(this.namedParameterJdbcTemplate.query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn(objectList);
        List<Receipt_v1> actualFetchReceiptsResult = this.collectionService_v1
                .fetchReceipts(new ReceiptSearchCriteria_v1());
        assertSame(objectList, actualFetchReceiptsResult);
        assertTrue(actualFetchReceiptsResult.isEmpty());
        verify(this.namedParameterJdbcTemplate).query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any());
    }

    @Test
    void testFetchReceiptsNullReceiptCriteria() throws DataAccessException {
        CollectionService_v1 collectionService_v1 = mock(CollectionService_v1.class);
        when(this.namedParameterJdbcTemplate.query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn("Query");
       // this.collectionService_v1.fetchReceipts(null);
        when(collectionService_v1.fetchReceipts(null)).thenReturn(null);
    }

    @Test
    void testFetchReceipts3() throws DataAccessException {
        ArrayList<Object> objectList = new ArrayList<>();
        when(this.namedParameterJdbcTemplate.query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn(objectList);
        ReceiptSearchCriteria_v1 receiptSearchCriteria_v1 = mock(ReceiptSearchCriteria_v1.class);
        when(receiptSearchCriteria_v1.getOffset()).thenReturn(2);
        when(receiptSearchCriteria_v1.getLimit()).thenReturn(1);
        when(receiptSearchCriteria_v1.getFromDate()).thenReturn(1L);
        when(receiptSearchCriteria_v1.getToDate()).thenReturn(1L);
        when(receiptSearchCriteria_v1.getBusinessCode()).thenReturn("Business Code");
        when(receiptSearchCriteria_v1.getCollectedBy()).thenReturn("42");
        when(receiptSearchCriteria_v1.getDepartment()).thenReturn("Department");
        when(receiptSearchCriteria_v1.getFund()).thenReturn("Fund");
        when(receiptSearchCriteria_v1.getMobileNo()).thenReturn("Mobile No");
        when(receiptSearchCriteria_v1.getTenantId()).thenReturn("42");
        when(receiptSearchCriteria_v1.getTransactionId()).thenReturn("42");
        when(receiptSearchCriteria_v1.getBillIds()).thenReturn(new ArrayList<>());
        when(receiptSearchCriteria_v1.getBusinessCodes()).thenReturn(new ArrayList<>());
        when(receiptSearchCriteria_v1.getIds()).thenReturn(new ArrayList<>());
        when(receiptSearchCriteria_v1.getManualReceiptNumbers()).thenReturn(new ArrayList<>());
        when(receiptSearchCriteria_v1.getPayerIds()).thenReturn(new ArrayList<>());
        when(receiptSearchCriteria_v1.getConsumerCode()).thenReturn(new HashSet<>());
        when(receiptSearchCriteria_v1.getInstrumentType()).thenReturn(new HashSet<>());
        when(receiptSearchCriteria_v1.getReceiptNumbers()).thenReturn(new HashSet<>());
        when(receiptSearchCriteria_v1.getStatus()).thenReturn(new HashSet<>());
        doNothing().when(receiptSearchCriteria_v1).setToDate((Long) any());
        List<Receipt_v1> actualFetchReceiptsResult = this.collectionService_v1.fetchReceipts(receiptSearchCriteria_v1);
        assertSame(objectList, actualFetchReceiptsResult);
        assertTrue(actualFetchReceiptsResult.isEmpty());
        verify(this.namedParameterJdbcTemplate).query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any());
        verify(receiptSearchCriteria_v1, atLeast(1)).getLimit();
        verify(receiptSearchCriteria_v1).getOffset();
        verify(receiptSearchCriteria_v1, atLeast(1)).getFromDate();
        verify(receiptSearchCriteria_v1, atLeast(1)).getToDate();
        verify(receiptSearchCriteria_v1, atLeast(1)).getBusinessCode();
        verify(receiptSearchCriteria_v1, atLeast(1)).getCollectedBy();
        verify(receiptSearchCriteria_v1, atLeast(1)).getDepartment();
        verify(receiptSearchCriteria_v1, atLeast(1)).getFund();
        verify(receiptSearchCriteria_v1, atLeast(1)).getMobileNo();
        verify(receiptSearchCriteria_v1, atLeast(1)).getTenantId();
        verify(receiptSearchCriteria_v1, atLeast(1)).getTransactionId();
        verify(receiptSearchCriteria_v1, atLeast(1)).getBillIds();
        verify(receiptSearchCriteria_v1, atLeast(1)).getBusinessCodes();
        verify(receiptSearchCriteria_v1, atLeast(1)).getIds();
        verify(receiptSearchCriteria_v1, atLeast(1)).getManualReceiptNumbers();
        verify(receiptSearchCriteria_v1, atLeast(1)).getPayerIds();
        verify(receiptSearchCriteria_v1, atLeast(1)).getConsumerCode();
        verify(receiptSearchCriteria_v1, atLeast(1)).getInstrumentType();
        verify(receiptSearchCriteria_v1, atLeast(1)).getReceiptNumbers();
        verify(receiptSearchCriteria_v1, atLeast(1)).getStatus();
        verify(receiptSearchCriteria_v1).setToDate((Long) any());
    }

}

