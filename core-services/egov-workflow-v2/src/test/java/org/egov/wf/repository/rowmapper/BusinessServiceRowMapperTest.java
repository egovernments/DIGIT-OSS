package org.egov.wf.repository.rowmapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.junit.jupiter.api.Disabled;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {BusinessServiceRowMapper.class})
@ExtendWith(SpringExtension.class)
class BusinessServiceRowMapperTest {
    @Autowired
    private BusinessServiceRowMapper businessServiceRowMapper;


    @Test
    void testExtractData() throws SQLException, DataAccessException {
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.getBoolean((String) any())).thenReturn(true);
        when(resultSet.wasNull()).thenReturn(true);
        when(resultSet.getString((String) any())).thenReturn("String");
        when(resultSet.getLong((String) any())).thenReturn(1L);
        when(resultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);
        assertEquals(1, this.businessServiceRowMapper.extractData(resultSet).size());
        verify(resultSet, atLeast(1)).getBoolean((String) any());
        verify(resultSet, atLeast(1)).next();
        verify(resultSet, atLeast(1)).wasNull();
        verify(resultSet, atLeast(1)).getString((String) any());
        verify(resultSet, atLeast(1)).getLong((String) any());
    }


    @Test
    void testExtractData2() throws SQLException, DataAccessException {
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.getBoolean((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.wasNull()).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.getString((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.getLong((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);
        assertThrows(EmptyResultDataAccessException.class, () -> this.businessServiceRowMapper.extractData(resultSet));
        verify(resultSet).next();
        verify(resultSet).getString((String) any());
    }


    @Test
    void testExtractData3() throws SQLException, DataAccessException {
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.getBoolean((String) any())).thenReturn(true);
        when(resultSet.wasNull()).thenReturn(false);
        when(resultSet.getString((String) any())).thenReturn("String");
        when(resultSet.getLong((String) any())).thenReturn(1L);
        when(resultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);
        assertEquals(1, this.businessServiceRowMapper.extractData(resultSet).size());
        verify(resultSet, atLeast(1)).getBoolean((String) any());
        verify(resultSet, atLeast(1)).next();
        verify(resultSet, atLeast(1)).wasNull();
        verify(resultSet, atLeast(1)).getString((String) any());
        verify(resultSet, atLeast(1)).getLong((String) any());
    }



}

