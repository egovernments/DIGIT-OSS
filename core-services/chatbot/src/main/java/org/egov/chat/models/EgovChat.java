package org.egov.chat.models;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;

@Setter
@Getter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class EgovChat {

    private String tenantId;

    private Long timestamp;

    private User user;

    private ConversationState conversationState;

    private ConversationState nextConversationState;

    private Message message;

    private Response response;

    private JsonNode extraInfo;

    private boolean askForNextBatch;

    private boolean addErrorMessage;

    private boolean resetConversation;
}
