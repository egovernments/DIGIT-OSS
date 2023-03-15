package org.egov.collection.repository.rowmapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.MissingNode;

import java.math.BigDecimal;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.junit.jupiter.api.Disabled;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.postgresql.geometric.PGbox;
import org.postgresql.util.PGInterval;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {PaymentRowMapper.class})
@ExtendWith(SpringExtension.class)
class PaymentRowMapperTest {
    @MockBean
    private ObjectMapper objectMapper;

    @Autowired
    private PaymentRowMapper paymentRowMapper;

    @Test
    void testExtractData() throws SQLException, DataAccessException {
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.wasNull()).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.getObject((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.getString((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.getBigDecimal((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.getLong((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);
        assertThrows(EmptyResultDataAccessException.class, () -> this.paymentRowMapper.extractData(resultSet));
        verify(resultSet).next();
        verify(resultSet).getString((String) any());
    }

    @Test
    void testExtractData2() throws JsonProcessingException, SQLException, DataAccessException {
        when(this.objectMapper.readTree((String) any())).thenReturn(MissingNode.getInstance());
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.wasNull()).thenReturn(true);
        when(resultSet.getObject((String) any())).thenReturn(new PGInterval());
        when(resultSet.getString((String) any())).thenReturn("String");
        when(resultSet.getBigDecimal((String) any())).thenReturn(BigDecimal.valueOf(42L));
        when(resultSet.getLong((String) any())).thenReturn(1L);
        when(resultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);
        assertEquals(1, this.paymentRowMapper.extractData(resultSet).size());
        verify(this.objectMapper, atLeast(1)).readTree((String) any());
        verify(resultSet, atLeast(1)).next();
        verify(resultSet, atLeast(1)).wasNull();
        verify(resultSet, atLeast(1)).getObject((String) any());
        verify(resultSet, atLeast(1)).getString((String) any());
        verify(resultSet, atLeast(1)).getBigDecimal((String) any());
        verify(resultSet, atLeast(1)).getLong((String) any());
    }

    @Test
    void testExtractData3() throws JsonProcessingException, SQLException, DataAccessException {
        when(this.objectMapper.readTree((String) any())).thenReturn(MissingNode.getInstance());
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.wasNull()).thenReturn(false);
        when(resultSet.getObject((String) any())).thenReturn(new PGInterval());
        when(resultSet.getString((String) any())).thenReturn("String");
        when(resultSet.getBigDecimal((String) any())).thenReturn(BigDecimal.valueOf(42L));
        when(resultSet.getLong((String) any())).thenReturn(1L);
        when(resultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);
        assertEquals(1, this.paymentRowMapper.extractData(resultSet).size());
        verify(this.objectMapper, atLeast(1)).readTree((String) any());
        verify(resultSet, atLeast(1)).next();
        verify(resultSet, atLeast(1)).wasNull();
        verify(resultSet, atLeast(1)).getObject((String) any());
        verify(resultSet, atLeast(1)).getString((String) any());
        verify(resultSet, atLeast(1)).getBigDecimal((String) any());
        verify(resultSet, atLeast(1)).getLong((String) any());
    }

    @Test
    void testExtractData4() throws JsonProcessingException, SQLException, DataAccessException {
        when(this.objectMapper.readTree((String) any())).thenReturn(MissingNode.getInstance());
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.wasNull()).thenReturn(true);
        when(resultSet.getObject((String) any())).thenReturn(null);
        when(resultSet.getString((String) any())).thenReturn("String");
        when(resultSet.getBigDecimal((String) any())).thenReturn(BigDecimal.valueOf(42L));
        when(resultSet.getLong((String) any())).thenReturn(1L);
        when(resultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);
        assertEquals(1, this.paymentRowMapper.extractData(resultSet).size());
        verify(resultSet, atLeast(1)).next();
        verify(resultSet, atLeast(1)).wasNull();
        verify(resultSet, atLeast(1)).getObject((String) any());
        verify(resultSet, atLeast(1)).getString((String) any());
        verify(resultSet, atLeast(1)).getBigDecimal((String) any());
        verify(resultSet, atLeast(1)).getLong((String) any());
    }

    @Test
    void testExtractData5() throws JsonProcessingException, SQLException, DataAccessException {
        when(this.objectMapper.readTree((String) any())).thenReturn(MissingNode.getInstance());
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.wasNull()).thenReturn(true);
        when(resultSet.getObject((String) any())).thenReturn(new PGobject());
        when(resultSet.getString((String) any())).thenReturn("String");
        when(resultSet.getBigDecimal((String) any())).thenReturn(BigDecimal.valueOf(42L));
        when(resultSet.getLong((String) any())).thenReturn(1L);
        when(resultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);
        assertEquals(1, this.paymentRowMapper.extractData(resultSet).size());
        verify(resultSet, atLeast(1)).next();
        verify(resultSet, atLeast(1)).wasNull();
        verify(resultSet, atLeast(1)).getObject((String) any());
        verify(resultSet, atLeast(1)).getString((String) any());
        verify(resultSet, atLeast(1)).getBigDecimal((String) any());
        verify(resultSet, atLeast(1)).getLong((String) any());
    }

}

