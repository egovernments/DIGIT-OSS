package org.egov.infra.persist.web.contract;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;

import java.util.ArrayList;

import org.junit.jupiter.api.Test;

class QueryMapTest {

    @Test
    void testConstructor() {
        QueryMap actualQueryMap = new QueryMap();
        actualQueryMap.setBasePath("Base Path");
        ArrayList<JsonMap> jsonMapList = new ArrayList<>();
        actualQueryMap.setJsonMaps(jsonMapList);
        actualQueryMap.setQuery("Query");
        assertEquals("Base Path", actualQueryMap.getBasePath());
        assertSame(jsonMapList, actualQueryMap.getJsonMaps());
        assertEquals("Query", actualQueryMap.getQuery());
    }
}

