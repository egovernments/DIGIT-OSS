package org.egov.chat.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.chat.models.ConversationState;
import org.egov.chat.models.EgovChat;
import org.egov.chat.models.Response;
import org.egov.chat.repository.ConversationStateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class CommonAPIErrorMessage {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private ConversationStateRepository conversationStateRepository;
    @Autowired
    private KafkaTemplate<String, EgovChat> kafkaTemplate;
    @Autowired
    private LocalizationService localizationService;
    private String commonApiErrorMessage = "chatbot.message.common.api.errormessage";
    private String localizedTopic = "send-message-localized";

    private Response getErrorMessageResponse() {
        String localizedErrorMessage = localizationService.getMessageForCode(commonApiErrorMessage);
        Response response = Response.builder().type("text").timestamp(System.currentTimeMillis()).nodeId("Error").text(localizedErrorMessage).build();
        return response;
    }

    private void resetConversation(EgovChat chatNode) {
        String conversationId = chatNode.getConversationState().getConversationId();
        ConversationState nextConversationState = chatNode.getConversationState().toBuilder().build();
        nextConversationState.setLastModifiedTime(System.currentTimeMillis());
        nextConversationState.setActiveNodeId("Error");
        nextConversationState.setQuestionDetails(null);
        chatNode.setNextConversationState(nextConversationState);
        conversationStateRepository.updateConversationStateForId(chatNode.getNextConversationState());
        conversationStateRepository.markConversationInactive(conversationId);
    }

    public void resetFlowDuetoError(EgovChat chatNode) {
        try {
            if (chatNode.getConversationState() != null)
                resetConversation(chatNode);
            chatNode.setResponse(getErrorMessageResponse());
            kafkaTemplate.send(localizedTopic, chatNode);
        } catch (Exception ex) {
            log.error("error occurred while sending user error response", ex);
        }
    }
}
