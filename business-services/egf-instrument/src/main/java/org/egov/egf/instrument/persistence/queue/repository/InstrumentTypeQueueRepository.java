package org.egov.egf.instrument.persistence.queue.repository;

import java.util.HashMap;

import org.egov.egf.instrument.persistence.queue.FinancialInstrumentProducer;
import org.egov.egf.instrument.web.requests.InstrumentTypeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class InstrumentTypeQueueRepository {

    private FinancialInstrumentProducer financialInstrumentProducer;

    private String validatedTopic;

    private String instrumentTypeValidatedKey;

    private String completedTopic;

    private String instrumentTypeCompletedKey;

    @Autowired
    public InstrumentTypeQueueRepository(FinancialInstrumentProducer financialInstrumentProducer,
            @Value("${kafka.topics.egf.instrument.validated.topic}") String validatedTopic,
            @Value("${kafka.topics.egf.instrument.instrument.type.validated.key}") String instrumentTypeValidatedKey,
            @Value("${kafka.topics.egf.instrument.completed.topic}") String completedTopic,
            @Value("${kafka.topics.egf.instrument.instrument.type.completed.key}") String instrumentTypeCompletedKey) {

        this.financialInstrumentProducer = financialInstrumentProducer;
        this.validatedTopic = validatedTopic;
        this.instrumentTypeValidatedKey = instrumentTypeValidatedKey;
        this.completedTopic = completedTopic;
        this.instrumentTypeCompletedKey = instrumentTypeCompletedKey;
    }

    public void addToQue(InstrumentTypeRequest request) {
        HashMap<String, Object> topicMap = new HashMap<String, Object>();

        switch (request.getRequestInfo().getAction().toLowerCase()) {

        case "create":
            topicMap.put("instrumenttype_create", request);
            System.out.println("push create topic" + request);
            break;
        case "update":
            topicMap.put("instrumenttype_update", request);
            break;
        case "delete":
            topicMap.put("instrumenttype_delete", request);
            break;

        }
        financialInstrumentProducer.sendMessage(validatedTopic, instrumentTypeValidatedKey, topicMap);
    }

    public void addToSearchQue(InstrumentTypeRequest request) {

        HashMap<String, Object> topicMap = new HashMap<String, Object>();

        if (!request.getInstrumentTypes().isEmpty()) {

            topicMap.put("instrumenttype_persisted", request);

            System.out.println("push search topic" + request);

        }

        financialInstrumentProducer.sendMessage(completedTopic, instrumentTypeCompletedKey, topicMap);

    }
}
