package org.egov.tracer.kafka.serializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.TimeZone;

public class ISTTimeZoneJsonSerializer extends JsonSerializer<HashMap> {

    private static final String IST = "Asia/Kolkata";

    public ISTTimeZoneJsonSerializer() {
        super(getObjectMapper());
    }

    private static ObjectMapper getObjectMapper() {
        final ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setTimeZone(TimeZone.getTimeZone(IST));
        return objectMapper;
    }
}
