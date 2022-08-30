package org.egov;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.DeserializationConfig;
import com.fasterxml.jackson.databind.MappingJsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.cfg.ContextAttributes;
import com.fasterxml.jackson.databind.introspect.VisibilityChecker;
import com.fasterxml.jackson.databind.jsontype.PolymorphicTypeValidator;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.util.StdDateFormat;
import org.junit.jupiter.api.Test;

class UrlSorteningApplicationTest {

    @Test
    void testGetObjectMapper() {
        ObjectMapper actualObjectMapper = (new UrlSorteningApplication()).getObjectMapper();
        PolymorphicTypeValidator polymorphicTypeValidator = actualObjectMapper.getPolymorphicTypeValidator();
        assertTrue(polymorphicTypeValidator instanceof LaissezFaireSubTypeValidator);
        VisibilityChecker<?> visibilityChecker = actualObjectMapper.getVisibilityChecker();
        assertTrue(visibilityChecker instanceof VisibilityChecker.Std);
        assertNull(actualObjectMapper.getPropertyNamingStrategy());
        assertTrue(actualObjectMapper
                .getDeserializationContext() instanceof com.fasterxml.jackson.databind.deser.DefaultDeserializationContext.Impl);
        assertSame(actualObjectMapper.getFactory(), actualObjectMapper.getJsonFactory());
        assertTrue(
                actualObjectMapper.getSerializerFactory() instanceof com.fasterxml.jackson.databind.ser.BeanSerializerFactory);
        assertTrue(actualObjectMapper
                .getSerializerProvider() instanceof com.fasterxml.jackson.databind.ser.DefaultSerializerProvider.Impl);
        assertTrue(actualObjectMapper
                .getSerializerProviderInstance() instanceof com.fasterxml.jackson.databind.ser.DefaultSerializerProvider.Impl);
        assertTrue(actualObjectMapper
                .getSubtypeResolver() instanceof com.fasterxml.jackson.databind.jsontype.impl.StdSubtypeResolver);
        DeserializationConfig deserializationConfig = actualObjectMapper.getDeserializationConfig();
        assertTrue(deserializationConfig
                .getAnnotationIntrospector() instanceof com.fasterxml.jackson.databind.introspect.JacksonAnnotationIntrospector);
        assertNull(deserializationConfig.getActiveView());
        assertNull(deserializationConfig.getHandlerInstantiator());
        assertSame(visibilityChecker, deserializationConfig.getDefaultVisibilityChecker());
        assertTrue(deserializationConfig
                .getClassIntrospector() instanceof com.fasterxml.jackson.databind.introspect.BasicClassIntrospector);
        assertSame(actualObjectMapper.getDateFormat(), deserializationConfig.getDateFormat());
        assertNull(deserializationConfig.getFullRootName());
        JsonNodeFactory expectedNodeFactory = actualObjectMapper.getNodeFactory();
        assertSame(expectedNodeFactory, deserializationConfig.getNodeFactory());
        assertNull(deserializationConfig.getDefaultMergeable());
        assertEquals(237020304, deserializationConfig.getDeserializationFeatures());
        assertTrue(deserializationConfig.getAttributes() instanceof ContextAttributes.Impl);
        assertSame(polymorphicTypeValidator, deserializationConfig.getPolymorphicTypeValidator());
    }
}

