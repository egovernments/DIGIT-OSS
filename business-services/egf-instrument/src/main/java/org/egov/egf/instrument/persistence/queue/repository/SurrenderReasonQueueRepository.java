package org.egov.egf.instrument.persistence.queue.repository;

import java.util.HashMap;

import org.egov.egf.instrument.persistence.queue.FinancialInstrumentProducer;
import org.egov.egf.instrument.web.requests.SurrenderReasonRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SurrenderReasonQueueRepository {

    private FinancialInstrumentProducer financialInstrumentProducer;

    private String validatedTopic;

    private String surrenderReasonValidatedKey;

    private String completedTopic;

    private String surrenderReasonCompletedKey;

    @Autowired
    public SurrenderReasonQueueRepository(FinancialInstrumentProducer financialInstrumentProducer,
            @Value("${kafka.topics.egf.instrument.validated.topic}") String validatedTopic,
            @Value("${kafka.topics.egf.instrument.surrender.reason.validated.key}") String surrenderReasonValidatedKey,
            @Value("${kafka.topics.egf.instrument.completed.topic}") String completedTopic,
            @Value("${kafka.topics.egf.instrument.surrender.reason.completed.key}") String surrenderReasonCompletedKey) {

        this.financialInstrumentProducer = financialInstrumentProducer;
        this.validatedTopic = validatedTopic;
        this.surrenderReasonValidatedKey = surrenderReasonValidatedKey;
        this.completedTopic = completedTopic;
        this.surrenderReasonCompletedKey = surrenderReasonCompletedKey;
    }

    public void addToQue(SurrenderReasonRequest request) {
        HashMap<String, Object> topicMap = new HashMap<String, Object>();

        switch (request.getRequestInfo().getAction().toLowerCase()) {

        case "create":
            topicMap.put("surrenderreason_create", request);
            System.out.println("push create topic" + request);
            break;
        case "update":
            topicMap.put("surrenderreason_update", request);
            break;
        case "delete":
            topicMap.put("surrenderreason_delete", request);
            break;

        }
        financialInstrumentProducer.sendMessage(validatedTopic, surrenderReasonValidatedKey, topicMap);
    }

    public void addToSearchQue(SurrenderReasonRequest request) {

        HashMap<String, Object> topicMap = new HashMap<String, Object>();

        if (!request.getSurrenderReasons().isEmpty()) {

            topicMap.put("surrenderreason_persisted", request);

            System.out.println("push search topic" + request);

        }

        financialInstrumentProducer.sendMessage(completedTopic, surrenderReasonCompletedKey, topicMap);

    }
}
