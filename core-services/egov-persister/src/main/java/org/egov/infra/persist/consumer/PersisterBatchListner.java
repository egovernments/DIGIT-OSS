package org.egov.infra.persist.consumer;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.egov.infra.persist.service.PersistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.listener.BatchMessageListener;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class PersisterBatchListner implements BatchMessageListener<String, Object> {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PersistService persistService;

    @Override
    public void onMessage(List<ConsumerRecord<String, Object>> dataList) {

        Map<String,List<String>> topicTorcvDataList = new HashMap<>();

            dataList.forEach(data -> {
                try {
                    if(!topicTorcvDataList.containsKey(data.topic())){
                        List<String> rcvDataList= new LinkedList<>();
                        rcvDataList.add(objectMapper.writeValueAsString(data.value()));
                        topicTorcvDataList.put(data.topic(),rcvDataList);
                    }
                    else {
                        topicTorcvDataList.get(data.topic()).add(objectMapper.writeValueAsString(data.value()));
                    }
                }
                catch (JsonProcessingException e) {
                    log.error("Failed to serialize incoming message", e);
                }
            });

        for(Map.Entry<String,List<String>> entry : topicTorcvDataList.entrySet()){
            persistService.persist(entry.getKey(),entry.getValue());
        }

    }



}
