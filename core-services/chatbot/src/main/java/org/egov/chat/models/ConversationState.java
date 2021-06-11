package org.egov.chat.models;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;

@Setter
@Getter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class ConversationState {

    private String conversationId;

    private String activeNodeId;

    private String userId;

    private boolean active;

    private JsonNode questionDetails;

    private String locale;

    private Long lastModifiedTime;
}
