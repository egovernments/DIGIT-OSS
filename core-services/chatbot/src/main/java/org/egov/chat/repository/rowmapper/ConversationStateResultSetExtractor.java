package org.egov.chat.repository.rowmapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.chat.models.ConversationState;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Objects;

@Service
public class ConversationStateResultSetExtractor implements ResultSetExtractor<ConversationState> {

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public ConversationState extractData(ResultSet resultSet) throws SQLException, DataAccessException {
        if (resultSet.next())
            return ConversationState.builder()
                    .conversationId(resultSet.getString("conversation_id"))
                    .userId(resultSet.getString("user_id"))
                    .activeNodeId(resultSet.getString("active_node_id"))
                    .questionDetails(getJsonValue((PGobject) resultSet.getObject("question_details")))
                    .active(resultSet.getBoolean("active"))
                    .locale(resultSet.getString("locale"))
                    .lastModifiedTime(resultSet.getLong("last_modified_time"))
                    .build();
        return null;
    }

    private JsonNode getJsonValue(PGobject pGobject) {
        try {
            if (Objects.isNull(pGobject) || Objects.isNull(pGobject.getValue()))
                return null;
            else
                return objectMapper.readTree(pGobject.getValue());
        } catch (IOException e) {
            throw new CustomException("SERVER_ERROR", "Exception occurred while parsing the draft json : " + e
                    .getMessage());
        }
    }

}
