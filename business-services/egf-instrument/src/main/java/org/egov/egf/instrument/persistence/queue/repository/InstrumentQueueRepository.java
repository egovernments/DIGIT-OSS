package org.egov.egf.instrument.persistence.queue.repository;

import java.util.HashMap;

import org.egov.egf.instrument.persistence.queue.FinancialInstrumentProducer;
import org.egov.egf.instrument.web.requests.InstrumentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class InstrumentQueueRepository {

    private FinancialInstrumentProducer financialInstrumentProducer;

    private String validatedTopic;

    private String instrumentValidatedKey;

    private String completedTopic;

    private String instrumentCompletedKey;

    @Autowired
    public InstrumentQueueRepository(FinancialInstrumentProducer financialInstrumentProducer,
            @Value("${kafka.topics.egf.instrument.validated.topic}") String validatedTopic,
            @Value("${kafka.topics.egf.instrument.instrument.validated.key}") String instrumentValidatedKey,
            @Value("${kafka.topics.egf.instrument.completed.topic}") String completedTopic,
            @Value("${kafka.topics.egf.instrument.instrument.completed.key}") String instrumentCompletedKey) {

        this.financialInstrumentProducer = financialInstrumentProducer;
        this.validatedTopic = validatedTopic;
        this.instrumentValidatedKey = instrumentValidatedKey;
        this.completedTopic = completedTopic;
        this.instrumentCompletedKey = instrumentCompletedKey;
    }

    public void addToQue(InstrumentRequest request) {
        HashMap<String, Object> topicMap = new HashMap<String, Object>();

        switch (request.getRequestInfo().getAction().toLowerCase()) {

        case "create":
            topicMap.put("instrument_create", request);
            System.out.println("push create topic" + request);
            break;
        case "update":
            topicMap.put("instrument_update", request);
            break;
        case "delete":
            topicMap.put("instrument_delete", request);
            break;

        }
        financialInstrumentProducer.sendMessage(validatedTopic, instrumentValidatedKey, topicMap);
    }

    public void addToSearchQue(InstrumentRequest request) {

        HashMap<String, Object> topicMap = new HashMap<String, Object>();

        if (!request.getInstruments().isEmpty()) {

            topicMap.put("instrument_persisted", request);

            System.out.println("push search topic" + request);

        }

        financialInstrumentProducer.sendMessage(completedTopic, instrumentCompletedKey, topicMap);

    }
}
