package org.egov.auditservice.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;

class AuditServiceConfigurationTest {


    ////@Test
    void testInitialize() {
        AuditServiceConfiguration auditServiceConfiguration = new AuditServiceConfiguration(1, 1, 3, "UTC");
        auditServiceConfiguration.initialize();
        assertEquals(1, auditServiceConfiguration.getDefaultLimit().intValue());
        assertEquals("UTC", auditServiceConfiguration.getTimeZone());
        assertEquals(3, auditServiceConfiguration.getMaxSearchLimit().intValue());
        assertEquals(1, auditServiceConfiguration.getDefaultOffset().intValue());
    }


    ////@Test
    void testJacksonConverter() {
        AuditServiceConfiguration auditServiceConfiguration = new AuditServiceConfiguration();
        ObjectMapper objectMapper = new ObjectMapper();
        MappingJackson2HttpMessageConverter actualJacksonConverterResult = auditServiceConfiguration
                .jacksonConverter(objectMapper);
        assertEquals(2, actualJacksonConverterResult.getSupportedMediaTypes().size());
        assertSame(objectMapper, actualJacksonConverterResult.getObjectMapper());
    }

}

