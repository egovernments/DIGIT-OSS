package org.egov.chat.models.egovchatserdes;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Deserializer;
import org.egov.chat.models.EgovChat;

import java.util.Map;

public class EgovChatDesearilizer implements Deserializer<EgovChat> {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void configure(Map<String, ?> map, boolean b) {

    }

    @Override
    public EgovChat deserialize(String s, byte[] bytes) {
        if (bytes == null)
            return null;
        EgovChat egovChat;

        try {
            egovChat = objectMapper.readValue(bytes, EgovChat.class);
        } catch (Exception e) {
            throw new SerializationException(e);
        }

        return egovChat;
    }

    @Override
    public void close() {

    }
}
