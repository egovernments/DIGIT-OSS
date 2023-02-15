package org.egov.collection.repository.querybuilder.v1;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.postgresql.util.PGInterval;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ContextConfiguration(classes = {CollectionResultSetExtractor_v1.class})
@ExtendWith(SpringExtension.class)
class CollectionResultSetExtractor_v1Test {
    @Autowired
    private CollectionResultSetExtractor_v1 collectionResultSetExtractor_v1;

    @MockBean
    private ObjectMapper objectMapper;

    @Test
    void testExtractData2() throws SQLException, DataAccessException {
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.getObject((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.getString((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.getBigDecimal((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.getLong((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);
        assertThrows(EmptyResultDataAccessException.class,
                () -> this.collectionResultSetExtractor_v1.extractData(resultSet));
        verify(resultSet).next();
        verify(resultSet).getString((String) any());
    }

    @Test
    void testExtractData3() throws SQLException, DataAccessException {
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.getObject((String) any())).thenReturn("Object");
        when(resultSet.getString((String) any())).thenReturn("String");
        when(resultSet.getBigDecimal((String) any())).thenReturn(BigDecimal.valueOf(42L));
        when(resultSet.getLong((String) any())).thenReturn(1L);
        when(resultSet.next()).thenReturn(false).thenReturn(true).thenReturn(false);
        assertTrue(this.collectionResultSetExtractor_v1.extractData(resultSet).isEmpty());
        verify(resultSet).next();
    }

    @Test
    void testExtractData9() throws JsonProcessingException, SQLException, DataAccessException {
        when(this.objectMapper.readTree((String) any())).thenThrow(new CustomException("rh_id", "An error occurred"));
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.getObject((String) any())).thenReturn(new PGInterval());
        when(resultSet.getString((String) any())).thenReturn(null);
        when(resultSet.getBigDecimal((String) any())).thenReturn(BigDecimal.valueOf(42L));
        when(resultSet.getLong((String) any())).thenReturn(1L);
        when(resultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);
        assertThrows(CustomException.class, () -> this.collectionResultSetExtractor_v1.extractData(resultSet));
        verify(this.objectMapper).readTree((String) any());
        verify(resultSet).next();
        verify(resultSet).getObject((String) any());
        verify(resultSet, atLeast(1)).getString((String) any());
        verify(resultSet, atLeast(1)).getBigDecimal((String) any());
        verify(resultSet, atLeast(1)).getLong((String) any());
    }
}

