package org.egov.collection.repository;

import org.egov.collection.model.AuditDetails;
import org.egov.collection.repository.rowmapper.RemittanceResultSetExtractor;
import org.egov.collection.web.contract.Remittance;
import org.egov.collection.web.contract.RemittanceSearchRequest;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ContextConfiguration(classes = {RemittanceRepository.class})
@ExtendWith(SpringExtension.class)
class RemittanceRepositoryTest {
    @MockBean
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    private RemittanceRepository remittanceRepository;

    @MockBean
    private RemittanceResultSetExtractor remittanceResultSetExtractor;

    @Test
    void testSaveRemittance() {
        assertThrows(CustomException.class, () -> this.remittanceRepository.saveRemittance(new Remittance()));
        assertThrows(CustomException.class, () -> this.remittanceRepository.saveRemittance(null));
    }

    @Test
    void testSaveRemittance2() {
        Remittance remittance = new Remittance();
        remittance.setAuditDetails(new AuditDetails());
        assertThrows(CustomException.class, () -> this.remittanceRepository.saveRemittance(remittance));
    }

    @Test
    void testSaveRemittance3() {
        Remittance remittance = mock(Remittance.class);
        when(remittance.getReferenceDate()).thenReturn(1L);
        when(remittance.getBankaccount()).thenReturn("3");
        when(remittance.getFunction()).thenReturn("Function");
        when(remittance.getFund()).thenReturn("Fund");
        when(remittance.getId()).thenReturn("42");
        when(remittance.getReasonForDelay()).thenReturn("Just cause");
        when(remittance.getReferenceNumber()).thenReturn("42");
        when(remittance.getRemarks()).thenReturn("Remarks");
        when(remittance.getStatus()).thenReturn("Status");
        when(remittance.getTenantId()).thenReturn("42");
        when(remittance.getVoucherHeader()).thenReturn("Voucher Header");
        when(remittance.getAuditDetails()).thenReturn(new AuditDetails());
        assertThrows(CustomException.class, () -> this.remittanceRepository.saveRemittance(remittance));
        verify(remittance).getReferenceDate();
        verify(remittance).getBankaccount();
        verify(remittance).getFunction();
        verify(remittance).getFund();
        verify(remittance).getId();
        verify(remittance).getReasonForDelay();
        verify(remittance).getReferenceNumber();
        verify(remittance).getRemarks();
        verify(remittance).getStatus();
        verify(remittance).getTenantId();
        verify(remittance).getVoucherHeader();
        verify(remittance).getAuditDetails();
    }

    @Test
    void testFetchRemittances() throws DataAccessException {
        ArrayList<Object> objectList = new ArrayList<>();
        when(this.namedParameterJdbcTemplate.query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn(objectList);

        RemittanceSearchRequest remittanceSearchRequest = new RemittanceSearchRequest();
        remittanceSearchRequest.setBankaccount("3");
        remittanceSearchRequest.setFromDate(1L);
        remittanceSearchRequest.setFunction("Function");
        remittanceSearchRequest.setFund("Fund");
        remittanceSearchRequest.setIds(new ArrayList<>());
        remittanceSearchRequest.setLimit(1);
        remittanceSearchRequest.setOffset(2);
        remittanceSearchRequest.setPageSize(3);
        remittanceSearchRequest.setReasonForDelay("Just cause");
        remittanceSearchRequest.setReferenceNumbers(new ArrayList<>());
        remittanceSearchRequest.setRemarks("Remarks");
        remittanceSearchRequest.setSortBy("Sort By");
        remittanceSearchRequest.setSortOrder("asc");
        remittanceSearchRequest.setStatus("Status");
        remittanceSearchRequest.setTenantId("42");
        remittanceSearchRequest.setToDate(1L);
        remittanceSearchRequest.setVoucherHeader("Voucher Header");
        List<Remittance> actualFetchRemittancesResult = this.remittanceRepository.fetchRemittances(remittanceSearchRequest);
        assertSame(objectList, actualFetchRemittancesResult);
        assertTrue(actualFetchRemittancesResult.isEmpty());
        verify(this.namedParameterJdbcTemplate).query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any());
        assertEquals(86400001L, remittanceSearchRequest.getToDate().longValue());
    }

    @Test
    void testConstructor() {

        RemittanceRepository actualRemittanceRepository = new RemittanceRepository();
        actualRemittanceRepository.updateRemittance(new Remittance());
    }
}

