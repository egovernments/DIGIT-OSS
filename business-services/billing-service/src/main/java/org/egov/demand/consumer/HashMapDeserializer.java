package org.egov.demand.consumer;

import java.util.HashMap;

import org.springframework.kafka.support.serializer.JsonDeserializer;

@SuppressWarnings("rawtypes")
public class HashMapDeserializer extends JsonDeserializer<HashMap> {

    public HashMapDeserializer() {
        super(HashMap.class);
    }

}