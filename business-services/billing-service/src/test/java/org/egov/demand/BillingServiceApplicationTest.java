package org.egov.demand;

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
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;

class BillingServiceApplicationTest {

    @Test
    void testGetObjectMapper() {
        ObjectMapper actualObjectMapper = (new BillingServiceApplication()).getObjectMapper();
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
        assertEquals(237020288, deserializationConfig.getDeserializationFeatures());
        assertTrue(deserializationConfig.getAttributes() instanceof ContextAttributes.Impl);
        assertSame(polymorphicTypeValidator, deserializationConfig.getPolymorphicTypeValidator());
    }


    @Test
    void testJacksonConverter() {
        MappingJackson2HttpMessageConverter actualJacksonConverterResult = (new BillingServiceApplication())
                .jacksonConverter();
        assertEquals(2, actualJacksonConverterResult.getSupportedMediaTypes().size());
        ObjectMapper objectMapper = actualJacksonConverterResult.getObjectMapper();
        assertTrue(objectMapper
                .getPolymorphicTypeValidator() instanceof LaissezFaireSubTypeValidator);
        VisibilityChecker<?> visibilityChecker = objectMapper.getVisibilityChecker();
        assertTrue(visibilityChecker instanceof VisibilityChecker.Std);
        assertNull(objectMapper.getPropertyNamingStrategy());
        assertTrue(objectMapper
                .getDeserializationContext() instanceof com.fasterxml.jackson.databind.deser.DefaultDeserializationContext.Impl);
        assertSame(objectMapper.getFactory(), objectMapper.getJsonFactory());
        assertTrue(objectMapper.getSerializerFactory() instanceof com.fasterxml.jackson.databind.ser.BeanSerializerFactory);
        assertTrue(objectMapper
                .getSerializerProvider() instanceof com.fasterxml.jackson.databind.ser.DefaultSerializerProvider.Impl);
        assertTrue(objectMapper
                .getSerializerProviderInstance() instanceof com.fasterxml.jackson.databind.ser.DefaultSerializerProvider.Impl);
        assertTrue(
                objectMapper.getSubtypeResolver() instanceof com.fasterxml.jackson.databind.jsontype.impl.StdSubtypeResolver);
        DeserializationConfig deserializationConfig = objectMapper.getDeserializationConfig();
        assertSame(visibilityChecker, deserializationConfig.getDefaultVisibilityChecker());
        assertNull(deserializationConfig.getFullRootName());
        assertSame(objectMapper.getDateFormat(), deserializationConfig.getDateFormat());
        assertNull(deserializationConfig.getActiveView());
        assertTrue(deserializationConfig
                .getClassIntrospector() instanceof com.fasterxml.jackson.databind.introspect.BasicClassIntrospector);
        assertTrue(deserializationConfig
                .getAnnotationIntrospector() instanceof com.fasterxml.jackson.databind.introspect.JacksonAnnotationIntrospector);
        assertTrue(deserializationConfig.getAttributes() instanceof ContextAttributes.Impl);
        assertNull(deserializationConfig.getDefaultMergeable());
        assertEquals(237020288, deserializationConfig.getDeserializationFeatures());
    }
}

