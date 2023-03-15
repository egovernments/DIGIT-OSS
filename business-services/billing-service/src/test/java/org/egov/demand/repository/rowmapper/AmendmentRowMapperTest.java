package org.egov.demand.repository.rowmapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.node.MissingNode;

import java.math.BigDecimal;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.egov.demand.util.Util;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.postgresql.util.PGInterval;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {AmendmentRowMapper.class})
@ExtendWith(SpringExtension.class)
class AmendmentRowMapperTest {
    @Autowired
    private AmendmentRowMapper amendmentRowMapper;

    @MockBean
    private Util util;

    @Test
    void testExtractData() throws SQLException, DataAccessException {
        when(this.util.getJsonValue((org.postgresql.util.PGobject) any())).thenReturn(MissingNode.getInstance());
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.wasNull()).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.getObject((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.getString((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.getBigDecimal((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.getLong((String) any())).thenThrow(new EmptyResultDataAccessException(3));
        when(resultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);
        assertThrows(EmptyResultDataAccessException.class, () -> this.amendmentRowMapper.extractData(resultSet));
        verify(resultSet).next();
        verify(resultSet).getString((String) any());
    }
@Test
    void testExtractData2() throws SQLException, DataAccessException {
        when(this.util.getJsonValue((org.postgresql.util.PGobject) any())).thenReturn(MissingNode.getInstance());
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.wasNull()).thenReturn(true);
        when(resultSet.getObject((String) any())).thenReturn(new PGInterval());
        when(resultSet.getString((String) any())).thenReturn("String");
        when(resultSet.getBigDecimal((String) any())).thenReturn(BigDecimal.valueOf(42L));
        when(resultSet.getLong((String) any())).thenReturn(1L);
        when(resultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);
        assertEquals(1, this.amendmentRowMapper.extractData(resultSet).size());
        verify(this.util).getJsonValue((org.postgresql.util.PGobject) any());
        verify(resultSet, atLeast(1)).next();
        verify(resultSet, atLeast(1)).wasNull();
        verify(resultSet).getObject((String) any());
        verify(resultSet, atLeast(1)).getString((String) any());
        verify(resultSet).getBigDecimal((String) any());
        verify(resultSet, atLeast(1)).getLong((String) any());
    }
}

