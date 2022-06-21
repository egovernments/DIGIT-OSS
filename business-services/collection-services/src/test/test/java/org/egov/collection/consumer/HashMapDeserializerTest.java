package org.egov.collection.consumer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.kafka.support.converter.DefaultJackson2JavaTypeMapper;
import org.springframework.kafka.support.converter.Jackson2JavaTypeMapper;

class HashMapDeserializerTest {
    /**
     * Method under test: default or parameterless constructor of {@link HashMapDeserializer}
     */
    @Test
    void testConstructor() {
        Jackson2JavaTypeMapper typeMapper = (new HashMapDeserializer()).getTypeMapper();
        assertTrue(typeMapper instanceof DefaultJackson2JavaTypeMapper);
        assertEquals("__TypeId__", ((DefaultJackson2JavaTypeMapper) typeMapper).getClassIdFieldName());
        assertEquals(Jackson2JavaTypeMapper.TypePrecedence.TYPE_ID, typeMapper.getTypePrecedence());
        assertEquals("__KeyTypeId__", ((DefaultJackson2JavaTypeMapper) typeMapper).getKeyClassIdFieldName());
        assertTrue(((DefaultJackson2JavaTypeMapper) typeMapper).getIdClassMapping().isEmpty());
        assertEquals("__ContentTypeId__", ((DefaultJackson2JavaTypeMapper) typeMapper).getContentClassIdFieldName());
    }
}

