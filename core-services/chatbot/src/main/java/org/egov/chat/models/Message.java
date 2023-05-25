package org.egov.chat.models;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    private String messageId;

    private String conversationId;

    private String nodeId;

    private String rawInput;

    private String messageContent;

    private String contentType;

    private boolean valid;
}
