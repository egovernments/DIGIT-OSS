package org.egov.collection.repository.rowmapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.junit.jupiter.api.Disabled;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {BillRowMapper.class})
@ExtendWith(SpringExtension.class)
class BillRowMapperTest {
    @Autowired
    private BillRowMapper billRowMapper;

    @MockBean
    private ObjectMapper objectMapper;

    @Test
    void testExtractData() throws SQLException {
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.getBoolean((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.getObject((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.getString((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.getBigDecimal((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.getLong((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);
        assertThrows(EmptyResultDataAccessException.class, () -> this.billRowMapper.extractData(resultSet));
        verify(resultSet).next();
        verify(resultSet).getString((String) any());
    }

    @Test
    void testExtractData2() throws SQLException {
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.getInt((String) any())).thenReturn(1);
        when(resultSet.getBoolean((String) any())).thenReturn(true);
        when(resultSet.getObject((String) any())).thenReturn(null);
        when(resultSet.getString((String) any())).thenReturn("String");
        when(resultSet.getBigDecimal((String) any())).thenReturn(BigDecimal.valueOf(42L));
        when(resultSet.getLong((String) any())).thenReturn(1L);
        when(resultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);
        assertEquals(1, this.billRowMapper.extractData(resultSet).size());
        verify(resultSet, atLeast(1)).getBoolean((String) any());
        verify(resultSet, atLeast(1)).next();
        verify(resultSet, atLeast(1)).getInt((String) any());
        verify(resultSet, atLeast(1)).getObject((String) any());
        verify(resultSet, atLeast(1)).getString((String) any());
        verify(resultSet, atLeast(1)).getBigDecimal((String) any());
        verify(resultSet, atLeast(1)).getLong((String) any());
    }

}

