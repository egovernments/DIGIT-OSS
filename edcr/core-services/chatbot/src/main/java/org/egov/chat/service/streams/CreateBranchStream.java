package org.egov.chat.service.streams;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Predicate;
import org.apache.kafka.streams.kstream.Produced;
import org.egov.chat.config.KafkaStreamsConfig;
import org.egov.chat.config.graph.TopicNameGetter;
import org.egov.chat.models.EgovChat;
import org.egov.chat.models.egovchatserdes.EgovChatSerdes;
import org.egov.chat.service.AnswerExtractor;
import org.egov.chat.service.AnswerStore;
import org.egov.chat.service.validation.Validator;
import org.egov.chat.util.CommonAPIErrorMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

@Component
@Slf4j
public class CreateBranchStream extends CreateStream {

    @Autowired
    private KafkaStreamsConfig kafkaStreamsConfig;

    @Autowired
    private Validator validator;
    @Autowired
    private AnswerExtractor answerExtractor;
    @Autowired
    private AnswerStore answerStore;
    @Autowired
    private TopicNameGetter topicNameGetter;
    @Autowired
    private CommonAPIErrorMessage commonAPIErrorMessage;

    public void createEvaluateAnswerStreamForConfig(JsonNode config, String answerInputTopic, String questionTopic) {

        String streamName = config.get("name").asText() + "-answer";

        List<String> branchNames = getBranchNames(config);
        List<Predicate<String, EgovChat>> predicates = makePredicatesForBranches(branchNames, config);
        predicates.add(0, (s, chatNode) -> !validator.isValid(config, chatNode));                  //First check invalid

        Properties streamConfiguration = kafkaStreamsConfig.getDefaultStreamConfiguration();
        streamConfiguration.put(StreamsConfig.APPLICATION_ID_CONFIG, streamName);

        StreamsBuilder builder = new StreamsBuilder();
        KStream<String, EgovChat> answerKStream = builder.stream(answerInputTopic, Consumed.with(Serdes.String(),
                EgovChatSerdes.getSerde()));
        KStream<String, EgovChat>[] kStreamBranches = answerKStream.branch(predicates.toArray(new Predicate[predicates.size()]));

        kStreamBranches[0].mapValues(chatNode -> {
            chatNode.setAddErrorMessage(true);
            answerStore.saveAnswer(config, chatNode);
            return chatNode;
        }).to(questionTopic, Produced.with(Serdes.String(), EgovChatSerdes.getSerde()));

		for (int i = 1; i < kStreamBranches.length; i++) {
			String targetNode = config.get(branchNames.get(i - 1)).asText();
			String targetTopicName = topicNameGetter.getQuestionTopicNameForNode(targetNode);
			kStreamBranches[i].flatMapValues(chatNode -> {
				try {
					chatNode = answerExtractor.extractAnswer(config, chatNode);
					answerStore.saveAnswer(config, chatNode);
					return Collections.singletonList(chatNode);
				} catch (Exception e) {
					log.error("error in branch stream", e);
					commonAPIErrorMessage.resetFlowDuetoError(chatNode);
					return Collections.emptyList();
				}
			}).to(targetTopicName, Produced.with(Serdes.String(), EgovChatSerdes.getSerde()));

			log.info("Branch Stream started : " + streamName + ", from : " + answerInputTopic + ", to : "
					+ targetTopicName);
		}

        kafkaStreamsConfig.startStream(builder, streamConfiguration);
    }

    private List<String> getBranchNames(JsonNode config) {
        List<String> branchNames = new ArrayList<>();
        ArrayNode arrayNode = (ArrayNode) config.get("values");
        for (JsonNode jsonNode : arrayNode) {
            branchNames.add(jsonNode.asText());
        }
        return branchNames;
    }

    private List<Predicate<String, EgovChat>> makePredicatesForBranches(List<String> branchNames, JsonNode config) {
        List<Predicate<String, EgovChat>> predicates = new ArrayList<>();
        for (String branchName : branchNames) {
            Predicate<String, EgovChat> predicate = (s, chatNode) -> {
                try {
                    chatNode = answerExtractor.extractAnswer(config, chatNode);
                    String answer = chatNode.getMessage().getMessageContent();
                    if (answer.equalsIgnoreCase(branchName)) {
                        return true;
                    }
                } catch (Exception ex) {
                    log.error("error in createbranch stream", ex);
                }
                return false;
            };
            predicates.add(predicate);
        }
        return predicates;
    }
}
