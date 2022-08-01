package org.egov.infra.persist.web.contract;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

class TypeEnumTest {

    @Test
    void testFromValue() {
        assertNull(TypeEnum.fromValue("Text"));
        assertEquals(TypeEnum.ARRAY, TypeEnum.fromValue("ARRAY"));
        assertEquals(TypeEnum.STRING, TypeEnum.fromValue("STRING"));
        assertEquals(TypeEnum.INT, TypeEnum.fromValue("INT"));
        assertEquals(TypeEnum.DOUBLE, TypeEnum.fromValue("DOUBLE"));
        assertEquals(TypeEnum.FLOAT, TypeEnum.fromValue("FLOAT"));
        assertEquals(TypeEnum.DATE, TypeEnum.fromValue("DATE"));
        assertEquals(TypeEnum.LONG, TypeEnum.fromValue("LONG"));
        assertEquals(TypeEnum.BIGDECIMAL, TypeEnum.fromValue("BIGDECIMAL"));
        assertEquals(TypeEnum.BOOLEAN, TypeEnum.fromValue("BOOLEAN"));
        assertEquals(TypeEnum.CURRENTDATE, TypeEnum.fromValue("CURRENTDATE"));
        assertEquals(TypeEnum.JSON, TypeEnum.fromValue("JSON"));
        assertEquals(TypeEnum.JSONB, TypeEnum.fromValue("JSONB"));
    }


    @Test
    void testValueOf() {

        TypeEnum.valueOf("ARRAY");
    }
}

