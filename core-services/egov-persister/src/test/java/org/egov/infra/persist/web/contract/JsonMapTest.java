package org.egov.infra.persist.web.contract;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class JsonMapTest {

    @Test
    void testConstructor() {
        JsonMap actualJsonMap = new JsonMap();
        actualJsonMap.setDbType(TypeEnum.ARRAY);
        actualJsonMap.setFormat("Format");
        actualJsonMap.setJsonPath("Json Path");
        actualJsonMap.setParentPath("Parent Path");
        actualJsonMap.setType(TypeEnum.ARRAY);
        assertEquals(TypeEnum.ARRAY, actualJsonMap.getDbType());
        assertEquals("Format", actualJsonMap.getFormat());
        assertEquals("Json Path", actualJsonMap.getJsonPath());
        assertEquals("Parent Path", actualJsonMap.getParentPath());
        assertEquals(TypeEnum.ARRAY, actualJsonMap.getType());
    }
}

