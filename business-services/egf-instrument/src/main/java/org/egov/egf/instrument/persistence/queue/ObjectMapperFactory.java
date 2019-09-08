package org.egov.egf.instrument.persistence.queue;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ObjectMapperFactory {

    private ObjectMapper objectMapper;

    public ObjectMapperFactory(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public ObjectMapper create() {
        objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        return objectMapper;
    }
}
