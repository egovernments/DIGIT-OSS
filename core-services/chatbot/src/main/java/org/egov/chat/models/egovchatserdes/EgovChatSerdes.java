package org.egov.chat.models.egovchatserdes;

import org.apache.kafka.common.serialization.Deserializer;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.common.serialization.Serializer;
import org.egov.chat.models.EgovChat;

public class EgovChatSerdes {

    public static Serde<EgovChat> getSerde() {
        Serializer<EgovChat> serializer = new EgovChatSerializer();
        Deserializer<EgovChat> deserializer = new EgovChatDesearilizer();
        return Serdes.serdeFrom(serializer, deserializer);
    }

}
