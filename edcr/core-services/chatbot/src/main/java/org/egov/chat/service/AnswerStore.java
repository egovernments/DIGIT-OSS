package org.egov.chat.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.egov.chat.models.EgovChat;
import org.egov.chat.repository.MessageRepository;
import org.egov.chat.service.validation.TypeValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AnswerStore {

    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private TypeValidator typeValidator;

    public void saveAnswer(JsonNode config, EgovChat chatNode) {

        String nodeId = config.get("name").asText();
        String conversationId = chatNode.getConversationState().getConversationId();
        if (!typeValidator.isValid(config, chatNode))
            chatNode.getMessage().setValid(false);

        if (chatNode.getMessage().getMessageContent() == null)
            chatNode.getMessage().setMessageContent(chatNode.getMessage().getRawInput());

        chatNode.getMessage().setConversationId(conversationId);
        chatNode.getMessage().setMessageId(UUID.randomUUID().toString());
        chatNode.getMessage().setNodeId(nodeId);

        messageRepository.insertMessage(chatNode.getMessage());

    }

}
