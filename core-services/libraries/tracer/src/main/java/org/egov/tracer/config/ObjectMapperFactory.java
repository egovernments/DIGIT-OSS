package org.egov.tracer.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.env.Environment;

import java.util.TimeZone;

import static org.egov.tracer.constants.TracerConstants.TIME_ZONE_PROPERTY;

public class ObjectMapperFactory {

    private TracerProperties tracerProperties;

    private ObjectMapper objectMapper;

    public ObjectMapperFactory(TracerProperties tracerProperties, Environment environment) {
        this.tracerProperties = tracerProperties;
        this.objectMapper = new ObjectMapper();
        objectMapper.setTimeZone(TimeZone.getTimeZone(environment.getProperty(TIME_ZONE_PROPERTY, "UTC")));
    }

    public ObjectMapper getObjectMapper() {
        return objectMapper;
    }
}
