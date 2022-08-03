package org.egov.auditservice.repository.rowmapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.MissingNode;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Disabled;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.postgresql.geometric.PGbox;
import org.postgresql.util.PGInterval;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {AuditRowMapper.class})
@ExtendWith(SpringExtension.class)
class AuditRowMapperTest {
    @Autowired
    private AuditRowMapper auditRowMapper;

    @MockBean
    private ObjectMapper objectMapper;

    @Test
    void testExtractData() throws JsonProcessingException, IllegalArgumentException, SQLException, DataAccessException {
        when(objectMapper.readTree((String) any())).thenReturn(MissingNode.getInstance());
        when(objectMapper.convertValue((Object) any(), (TypeReference<Object>) any())).thenReturn("Convert Value");

        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.getObject((String) any())).thenReturn(new PGInterval());
        when(resultSet.getString((String) any())).thenReturn("String");
        when(resultSet.getLong((String) any())).thenReturn(1L);


    }


    @Test
    void testExtractData2()
            throws JsonProcessingException, IllegalArgumentException, SQLException, DataAccessException {
        when(objectMapper.readTree((String) any())).thenReturn(MissingNode.getInstance());
        when(objectMapper.convertValue((Object) any(), (TypeReference<Object>) any())).thenReturn("Convert Value");

        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.getObject((String) any())).thenReturn(null);
        when(resultSet.getString((String) any())).thenReturn("String");
        when(resultSet.getLong((String) any())).thenReturn(1L);

    }

}

