package org.egov.chat.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.egov.chat.models.EgovChat;
import org.egov.chat.service.InitiateConversation;
import org.egov.chat.service.InputSegregator;
import org.egov.chat.service.ResetCheck;
import org.egov.chat.util.CommonAPIErrorMessage;
import org.egov.chat.util.KafkaTopicCreater;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Controller;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Controller
public class ChatController {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private KafkaTopicCreater kafkaTopicCreater;
    @Autowired
    private CommonAPIErrorMessage commonAPIErrorMessage;

    @Autowired
    private ResetCheck resetCheck;
    @Autowired
    private InitiateConversation initiateConversation;
    @Autowired
    private InputSegregator inputSegregator;

    @Autowired
    private GraphStreamGenerator graphStreamGenerator;

    @PostConstruct
    public void init() throws IOException {
        graphStreamGenerator.generateGraphStreams();
    }

    @KafkaListener(groupId = "input-segregator", topics = "input-messages")
    public void segregateInput(ConsumerRecord<String, JsonNode> consumerRecord) {
        EgovChat chatNode = objectMapper.convertValue(consumerRecord.value(), EgovChat.class);
        try {
            chatNode.setResetConversation(resetCheck.isResetKeyword(chatNode));
            chatNode = initiateConversation.createOrContinueConversation(chatNode);
            inputSegregator.segregateAnswer(consumerRecord.key(), chatNode);
        } catch (Exception e) {
            commonAPIErrorMessage.resetFlowDuetoError(chatNode);
        }
    }

}
