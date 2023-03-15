package org.egov.chat.models.egovchatserdes;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Serializer;
import org.egov.chat.models.EgovChat;

import java.util.Map;

public class EgovChatSerializer implements Serializer<EgovChat> {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void configure(Map<String, ?> map, boolean b) {

    }

    @Override
    public byte[] serialize(String s, EgovChat egovChat) {
        if (egovChat == null)
            return null;

        try {
            return objectMapper.writeValueAsBytes(egovChat);
        } catch (Exception e) {
            throw new SerializationException("Error serializing JSON message", e);
        }
    }

    @Override
    public void close() {

    }
}
