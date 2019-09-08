package org.egov.boundary.consumer;

import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;

@SuppressWarnings("rawtypes")
public class HashMapDeserializer extends JsonDeserializer<HashMap> {

    public HashMapDeserializer() {
        super(HashMap.class);
    }

}
