package org.egov.egf.instrument.persistence.queue.repository;

import java.util.HashMap;

import org.egov.egf.instrument.persistence.queue.FinancialInstrumentProducer;
import org.egov.egf.instrument.web.requests.InstrumentAccountCodeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class InstrumentAccountCodeQueueRepository {

    private FinancialInstrumentProducer financialInstrumentProducer;

    private String validatedTopic;

    private String instrumentAccountCodeValidatedKey;

    private String completedTopic;

    private String instrumentAccountCodeCompletedKey;

    @Autowired
    public InstrumentAccountCodeQueueRepository(FinancialInstrumentProducer financialInstrumentProducer,
            @Value("${kafka.topics.egf.instrument.validated.topic}") String validatedTopic,
            @Value("${kafka.topics.egf.instrument.instrument.accountcode.validated.key}") String instrumentAccountCodeValidatedKey,
            @Value("${kafka.topics.egf.instrument.completed.topic}") String completedTopic,
            @Value("${kafka.topics.egf.instrument.instrument.accountcode.completed.key}") String instrumentAccountCodeCompletedKey) {

        this.financialInstrumentProducer = financialInstrumentProducer;
        this.validatedTopic = validatedTopic;
        this.instrumentAccountCodeValidatedKey = instrumentAccountCodeValidatedKey;
        this.completedTopic = completedTopic;
        this.instrumentAccountCodeCompletedKey = instrumentAccountCodeCompletedKey;
    }

    public void addToQue(InstrumentAccountCodeRequest request) {
        HashMap<String, Object> topicMap = new HashMap<String, Object>();

        switch (request.getRequestInfo().getAction().toLowerCase()) {

        case "create":
            topicMap.put("instrumentaccountcode_create", request);
            System.out.println("push create topic" + request);
            break;
        case "update":
            topicMap.put("instrumentaccountcode_update", request);
            break;
        case "delete":
            topicMap.put("instrumentaccountcode_delete", request);
            break;

        }
        financialInstrumentProducer.sendMessage(validatedTopic, instrumentAccountCodeValidatedKey, topicMap);
    }

    public void addToSearchQue(InstrumentAccountCodeRequest request) {

        HashMap<String, Object> topicMap = new HashMap<String, Object>();

        if (!request.getInstrumentAccountCodes().isEmpty()) {

            topicMap.put("instrumentaccountcode_persisted", request);

            System.out.println("push search topic" + request);

        }

        financialInstrumentProducer.sendMessage(completedTopic, instrumentAccountCodeCompletedKey, topicMap);

    }
}
