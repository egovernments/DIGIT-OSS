package org.egov.chat.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.chat.config.graph.TopicNameGetter;
import org.egov.chat.models.EgovChat;
import org.egov.chat.util.CommonAPIErrorMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class InputSegregator {

    private String rootQuestionTopic = "root-question";

    @Autowired
    private TopicNameGetter topicNameGetter;
    @Autowired
    private KafkaTemplate<String, EgovChat> kafkaTemplate;
    @Autowired
    private CommonAPIErrorMessage commonAPIErrorMessage;
    @Autowired
    private WelcomeMessageHandler welcomeMessageHandler;

    public void segregateAnswer(String consumerRecordKey, EgovChat chatNode) {
        try {
            String activeNodeId = chatNode.getConversationState().getActiveNodeId();
            log.debug("Active Node Id : " + activeNodeId);
            if (activeNodeId == null) {
                chatNode = welcomeMessageHandler.welcomeUser(consumerRecordKey, chatNode);
                if (chatNode == null)
                    return;
            }
            String topic = getOutputTopicName(activeNodeId);
            kafkaTemplate.send(topic, consumerRecordKey, chatNode);
        } catch (Exception e) {
            log.error("error in input segregator", e);
            if (chatNode != null)
                commonAPIErrorMessage.resetFlowDuetoError(chatNode);
        }
    }

    private String getOutputTopicName(String activeNodeId) {
        String topic;
        if (activeNodeId == null)
            topic = rootQuestionTopic;
        else
            topic = topicNameGetter.getAnswerInputTopicNameForNode(activeNodeId);
        return topic;
    }

}
