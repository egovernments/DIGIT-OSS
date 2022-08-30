package org.egov.collection.repository.rowmapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {CollectionConfigRowMapper.class})
@ExtendWith(SpringExtension.class)
class CollectionConfigRowMapperTest {
    @Autowired
    private CollectionConfigRowMapper collectionConfigRowMapper;

    @Test
    void testExtractData() throws SQLException, DataAccessException {
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.getString((String) any())).thenReturn("String");
        when(resultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);
        Map<String, List<String>> actualExtractDataResult = this.collectionConfigRowMapper.extractData(resultSet);
        assertEquals(1, actualExtractDataResult.size());
        List<String> getResult = actualExtractDataResult.get("String");
        assertEquals(2, getResult.size());
        assertEquals("String", getResult.get(0));
        assertEquals("String", getResult.get(1));
        verify(resultSet, atLeast(1)).next();
        verify(resultSet, atLeast(1)).getString((String) any());
    }

    @Test
    void testExtractData2() throws SQLException, DataAccessException {
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.getString((String) any())).thenThrow(new SQLException());
        when(resultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);
        assertThrows(SQLException.class, () -> this.collectionConfigRowMapper.extractData(resultSet));
        verify(resultSet).next();
        verify(resultSet).getString((String) any());
    }
}

