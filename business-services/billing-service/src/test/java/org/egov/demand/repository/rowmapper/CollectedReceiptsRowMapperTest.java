package org.egov.demand.repository.rowmapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.egov.demand.model.AuditDetail;
import org.egov.demand.model.CollectedReceipt;
import org.junit.jupiter.api.Test;

class CollectedReceiptsRowMapperTest {

    @Test
    void testMapRow() throws SQLException {
        CollectedReceiptsRowMapper collectedReceiptsRowMapper = new CollectedReceiptsRowMapper();
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.getDouble((String) any())).thenReturn(10.0d);
        when(resultSet.getString((String) any())).thenReturn("String");
        when(resultSet.getLong((String) any())).thenReturn(1L);
        CollectedReceipt actualMapRowResult = collectedReceiptsRowMapper.mapRow(resultSet, 10);
        assertEquals("String", actualMapRowResult.getTenantId());
        assertEquals("String", actualMapRowResult.getBusinessService());
        assertEquals(10.0d, actualMapRowResult.getReceiptAmount().doubleValue());
        assertEquals(1L, actualMapRowResult.getReceiptDate().longValue());
        assertEquals("String", actualMapRowResult.getConsumerCode());
        assertNull(actualMapRowResult.getStatus());
        assertEquals("String", actualMapRowResult.getReceiptNumber());
        AuditDetail auditDetail = actualMapRowResult.getAuditDetail();
        assertEquals("String", auditDetail.getLastModifiedBy());
        assertEquals(1L, auditDetail.getLastModifiedTime().longValue());
        assertEquals("String", auditDetail.getCreatedBy());
        assertEquals(1L, auditDetail.getCreatedTime().longValue());
        verify(resultSet).getDouble((String) any());
        verify(resultSet, atLeast(1)).getString((String) any());
        verify(resultSet, atLeast(1)).getLong((String) any());
    }


    @Test
    void testMapRow2() throws SQLException {
        CollectedReceiptsRowMapper collectedReceiptsRowMapper = new CollectedReceiptsRowMapper();
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.getDouble((String) any())).thenThrow(new SQLException());
        when(resultSet.getString((String) any())).thenThrow(new SQLException());
        when(resultSet.getLong((String) any())).thenThrow(new SQLException());
        assertThrows(SQLException.class, () -> collectedReceiptsRowMapper.mapRow(resultSet, 10));
        verify(resultSet).getString((String) any());
    }
}

