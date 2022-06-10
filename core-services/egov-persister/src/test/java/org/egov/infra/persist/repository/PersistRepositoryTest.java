package org.egov.infra.persist.repository;

import ch.qos.logback.core.util.COWArrayList;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.infra.persist.web.contract.JsonMap;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ContextConfiguration(classes = {PersistRepository.class})
@ExtendWith(SpringExtension.class)
class PersistRepositoryTest {
    @MockBean
    private JdbcTemplate jdbcTemplate;

    @MockBean
    private ObjectMapper objectMapper;

    @Autowired
    private PersistRepository persistRepository;

    @Test
    void testPersist() {

        this.persistRepository.persist("Query", new ArrayList<>());
    }


    @Test
    void testPersist2() throws DataAccessException {
        when(this.jdbcTemplate.batchUpdate((String) any(), (java.util.List<Object[]>) any()))
                .thenReturn(new int[]{1, 1, 1, 1});

        ArrayList<Object[]> objectArrayList = new ArrayList<>();
        objectArrayList.add(new Object[]{"42"});
        this.persistRepository.persist("Query", objectArrayList);
        verify(this.jdbcTemplate).batchUpdate((String) any(), (java.util.List<Object[]>) any());
    }

    @Test
    void testPersist3() {
        PersistRepository persistRepository = new PersistRepository();
        persistRepository.persist("Query", new ArrayList<>(), "Json Obj", "*");
    }

    @Test
    void testPersist4() {

        PersistRepository persistRepository = new PersistRepository();
        ArrayList<JsonMap> jsonMaps = new ArrayList<>();
        COWArrayList<Object> objectList = (COWArrayList<Object>) mock(COWArrayList.class);
        when(objectList.get(anyInt())).thenReturn(null);
        when(objectList.size()).thenReturn(3);
        persistRepository.persist("Query", jsonMaps, objectList, "*");
        verify(objectList, atLeast(1)).size();
        verify(objectList, atLeast(1)).get(anyInt());
    }

    @Test
    void testGetRows() {
        assertTrue(this.persistRepository.getRows(new ArrayList<>(), "Json Obj", "*").isEmpty());
    }

    @Test
    void testGetRows2() {
        assertTrue(this.persistRepository.getRows(new ArrayList<>(), "Json Obj", "*.").isEmpty());
    }

    @Test
    void testGetRows3() {
        assertTrue(this.persistRepository.getRows(new ArrayList<>(), "Json Obj", ".*").isEmpty());
    }

}

