package org.egov.chat.pre.controller;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.chat.pre.service.MessageWebhook;
import org.egov.chat.pre.service.PreChatbotStream;
import org.egov.chat.util.KafkaTopicCreater;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
public class PreChatController {

    @Autowired
    private MessageWebhook messageWebhook;
    @Autowired
    private PreChatbotStream preChatbotStream;
    @Autowired
    private KafkaTopicCreater kafkaTopicCreater;

    @PostConstruct
    public void initPreChatbotStreams() {
        kafkaTopicCreater.createTopic("transformed-input-messages");
        kafkaTopicCreater.createTopic("chatbot-error-messages");
        kafkaTopicCreater.createTopic("input-messages");

        preChatbotStream.startPreChatbotStream("transformed-input-messages", "input-messages");
    }

    @RequestMapping(value = "/messages", method = RequestMethod.POST)
    public ResponseEntity<Object> receiveMessage(
            @RequestParam Map<String, String> params) throws Exception {
        return new ResponseEntity<>(messageWebhook.receiveMessage(params), HttpStatus.OK);
    }

    @RequestMapping(value = "/messages", method = RequestMethod.GET)
    public ResponseEntity<Object> getMessage(@RequestParam Map<String, String> queryParams) throws Exception {
        return new ResponseEntity<>(messageWebhook.receiveMessage(queryParams), HttpStatus.OK );
    }

}
