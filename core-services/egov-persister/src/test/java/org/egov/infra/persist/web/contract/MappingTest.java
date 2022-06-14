package org.egov.infra.persist.web.contract;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;

import org.junit.jupiter.api.Test;

class MappingTest {

    @Test
    void testConstructor() {
        Mapping actualMapping = new Mapping();
        actualMapping.setDescription("The characteristics of someone or something");
        actualMapping.setFromTopic("jane.doe@example.org");
        actualMapping.setIsBatch(true);
        actualMapping.setIsTransaction(true);
        actualMapping.setName("Name");
        ArrayList<QueryMap> queryMapList = new ArrayList<>();
        actualMapping.setQueryMaps(queryMapList);
        actualMapping.setVersion("1.0.2");
        assertEquals("The characteristics of someone or something", actualMapping.getDescription());
        assertEquals("jane.doe@example.org", actualMapping.getFromTopic());
        assertTrue(actualMapping.getIsBatch());
        assertTrue(actualMapping.getIsTransaction());
        assertEquals("Name", actualMapping.getName());
        assertSame(queryMapList, actualMapping.getQueryMaps());
        assertEquals("1.0.2", actualMapping.getVersion());
    }


    @Test
    void testConstructor2() {
        Mapping actualMapping = new Mapping();
        actualMapping.setDescription("The characteristics of someone or something");
        actualMapping.setFromTopic("jane.doe@example.org");
        actualMapping.setIsBatch(true);
        actualMapping.setIsTransaction(true);
        actualMapping.setName("Name");
        ArrayList<QueryMap> queryMapList = new ArrayList<>();
        actualMapping.setQueryMaps(queryMapList);
        actualMapping.setVersion("1.0.2");
        assertEquals("The characteristics of someone or something", actualMapping.getDescription());
        assertEquals("jane.doe@example.org", actualMapping.getFromTopic());
        assertTrue(actualMapping.getIsBatch());
        assertTrue(actualMapping.getIsTransaction());
        assertEquals("Name", actualMapping.getName());
        assertSame(queryMapList, actualMapping.getQueryMaps());
        assertEquals("1.0.2", actualMapping.getVersion());
    }
}

