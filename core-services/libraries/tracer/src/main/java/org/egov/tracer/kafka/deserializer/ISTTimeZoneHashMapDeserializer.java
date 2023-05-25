package org.egov.tracer.kafka.deserializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.TimeZone;

public class ISTTimeZoneHashMapDeserializer extends JsonDeserializer<HashMap> {

    private static final String IST = "Asia/Kolkata";

    public ISTTimeZoneHashMapDeserializer() {
        super(HashMap.class, getObjectMapper());
    }

    private static ObjectMapper getObjectMapper() {
        final ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setTimeZone(TimeZone.getTimeZone(IST));
        return objectMapper;
    }
}

