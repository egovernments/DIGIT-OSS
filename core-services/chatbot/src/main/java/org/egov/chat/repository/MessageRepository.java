package org.egov.chat.repository;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.chat.models.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MessageRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private KafkaTemplate<String, JsonNode> kafkaTemplatePersister;

    private String messageInsertTopic = "chatbot-message-insert";

    private static final String insertMessageQuery = "INSERT INTO eg_chat_message (message_id, conversation_id, " +
            "node_id, raw_input, message_content, content_type, is_valid) VALUES (?, ?, ?, ?, ?, ?, ?)";

    private static final String selectValidMessagesOfConversationQuery = "SELECT * FROM eg_chat_message WHERE " +
            "conversation_id=? AND is_valid=true";

    public int insertMessage(Message message) {
//        JsonNode jsonNode = objectMapper.convertValue(message, JsonNode.class);
//        kafkaTemplatePersister.send(messageInsertTopic, jsonNode);

        return jdbcTemplate.update(insertMessageQuery,
                message.getMessageId(),
                message.getConversationId(),
                message.getNodeId(),
                message.getRawInput(),
                message.getMessageContent(),
                message.getContentType(),
                message.isValid());
    }

    public List<Message> getValidMessagesOfConversation(String conversationId) {
        return jdbcTemplate.query(selectValidMessagesOfConversationQuery, new Object[]{conversationId},
                new BeanPropertyRowMapper<>(Message.class));
    }
}
