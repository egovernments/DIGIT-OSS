package org.egov.url.shortening.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class IDConvertorTest {


    @Test
    void testCreateUniqueID() {
        assertEquals("b9", IDConvertor.createUniqueID(123L));
        assertEquals("b", IDConvertor.createUniqueID(1L));
    }
    @Test
    void testGetDictionaryKeyFromUniqueID() {
        assertEquals(20102L, IDConvertor.getDictionaryKeyFromUniqueID("foo").longValue());
    }
}

