package org.egov.chat.repository;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.egov.chat.models.ConversationState;
import org.egov.chat.repository.querybuilder.ConversationStateQueryBuilder;
import org.egov.chat.repository.rowmapper.ConversationStateResultSetExtractor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ConversationStateRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    @Autowired
    private ConversationStateResultSetExtractor conversationStateResultSetExtractor;

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private KafkaTemplate<String, JsonNode> kafkaTemplatePersister;

    private String insertConversationStateTopic = "chatbot-conversation-state-insert";
    private String updateConversationStateTopic = "chatbot-conversation-state-update";
    private String deactivateConversationStateTopic = "chatbot-conversation-state-deactivate";


    private static final String insertNewConversationQuery = "INSERT INTO eg_chat_conversation_state " +
            "(conversation_id, user_id, active, locale) VALUES (?, ?, ?, ?)";

    private static final String updateActiveStateForConversationQuery = "UPDATE eg_chat_conversation_state SET " +
            "active=FALSE WHERE conversation_id=?";

    private static final String selectConversationStateForIdQuery = "SELECT * FROM eg_chat_conversation_state WHERE " +
            "conversation_id=?";

    private static final String selectActiveConversationStateForUserIdQuery = "SELECT * FROM eg_chat_conversation_state WHERE " +
            "user_id=? AND active=TRUE";

    private static final String selectCountConversationStateForUserIdQuery = "SELECT count(*) FROM eg_chat_conversation_state WHERE " +
            "user_id=?";

    public int insertNewConversation(ConversationState conversationState) {
//        JsonNode jsonNode = objectMapper.convertValue(conversationState, JsonNode.class);
//        kafkaTemplatePersister.send(insertConversationStateTopic, jsonNode);

        return jdbcTemplate.update(insertNewConversationQuery,
                conversationState.getConversationId(),
                conversationState.getUserId(),
                conversationState.isActive(),
                conversationState.getLocale());
    }

    public int updateConversationStateForId(ConversationState conversationState) {
//        JsonNode jsonNode = objectMapper.convertValue(conversationState, JsonNode.class);
//        kafkaTemplatePersister.send(updateConversationStateTopic, jsonNode);
        return namedParameterJdbcTemplate.update(ConversationStateQueryBuilder.UPDATE_CONVERSATION_STATE_QUERY,
                ConversationStateQueryBuilder.getParametersForConversationStateUpdate(conversationState));
    }

    public int markConversationInactive(String conversationId) {
//        ObjectNode objectNode = objectMapper.createObjectNode();
//        objectNode.put("conversationId", conversationId);
//        kafkaTemplatePersister.send(deactivateConversationStateTopic, objectNode);
        return jdbcTemplate.update(updateActiveStateForConversationQuery, conversationId);
    }

    public ConversationState getActiveConversationStateForUserId(String userId) {
        try {
            return jdbcTemplate.query(selectActiveConversationStateForUserIdQuery, new Object[]{userId},
                    conversationStateResultSetExtractor);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public int getConversationStateCountForUserId(String userId) {
        return (jdbcTemplate.queryForObject(selectCountConversationStateForUserIdQuery, new Object[]{userId},
                Integer.class));
    }

    public ConversationState getConversationStateForId(String conversationId) {
        return jdbcTemplate.query(selectConversationStateForIdQuery, new Object[]{conversationId},
                conversationStateResultSetExtractor);
    }


}
