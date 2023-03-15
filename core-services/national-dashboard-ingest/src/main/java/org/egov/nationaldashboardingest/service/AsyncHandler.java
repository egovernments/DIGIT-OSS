package org.egov.nationaldashboardingest.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.egov.nationaldashboardingest.producer.Producer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AsyncHandler {

    @Autowired
    private Producer producer;

    @Async
    public void pushDataToKafkaConnector(Map<String, List<JsonNode>> indexNameVsDocumentsToBeIndexed) {
        indexNameVsDocumentsToBeIndexed.keySet().forEach(indexName -> {
            for(JsonNode record : indexNameVsDocumentsToBeIndexed.get(indexName)) {
                producer.push(indexName, record);
            }
        });
    }

}
