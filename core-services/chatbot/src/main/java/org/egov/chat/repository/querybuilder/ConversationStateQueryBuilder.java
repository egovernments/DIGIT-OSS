package org.egov.chat.repository.querybuilder;

import com.fasterxml.jackson.databind.JsonNode;
import org.egov.chat.models.ConversationState;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;

import java.sql.SQLException;
import java.util.Objects;

public class ConversationStateQueryBuilder {

    public static final String UPDATE_CONVERSATION_STATE_QUERY = "UPDATE eg_chat_conversation_state SET " +
            "active_node_id = :active_node_id , question_details = :question_details , " +
            "last_modified_time = :last_modified_time " +
            "WHERE conversation_id = :conversation_id";

    public static MapSqlParameterSource getParametersForConversationStateUpdate(ConversationState conversationState) {
        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("conversation_id", conversationState.getConversationId());
        sqlParameterSource.addValue("active_node_id", conversationState.getActiveNodeId());
        sqlParameterSource.addValue("question_details", getJsonb(conversationState.getQuestionDetails()));
        sqlParameterSource.addValue("last_modified_time", conversationState.getLastModifiedTime());

        return sqlParameterSource;
    }

    private static PGobject getJsonb(JsonNode node) {
        if (Objects.isNull(node))
            return null;

        PGobject pgObject = new PGobject();
        pgObject.setType("jsonb");
        try {
            pgObject.setValue(node.toString());
            return pgObject;
        } catch (SQLException e) {
            throw new CustomException("UNABLE_TO_CREATE_RECEIPT", "Invalid JSONB value provided");
        }

    }

}
