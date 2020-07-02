package com.ingestpipeline.consumer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ingestpipeline.producer.IngestProducer;
import com.ingestpipeline.service.IESService;
import com.ingestpipeline.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.net.URLEncoder;

@Component
public class UpdateConsumer {


    public static final Logger LOGGER = LoggerFactory.getLogger(UpdateConsumer.class);
    private static final String ERROR_INTENT = "DataErrorBypass";
    @Autowired
    private IngestProducer ingestProducer;
    @Autowired
    private ObjectMapper mapper;
    @Autowired
    private IESService elasticService;

    @Value("${kafka.topics.bypass.update.post}")
    String updatedPostTopic;

    @Value("${es.bypass.push.direct}")
    private Boolean esPushDirect;

    @KafkaListener(topics = "${kafka.topics.bypass.update.data}" , containerFactory = Constants.BeanContainerFactory.INCOMING_KAFKA_LISTENER)
    public void processMessage(Map data,
                               @Header(KafkaHeaders.RECEIVED_TOPIC) final String topic) {
        LOGGER.info("##KafkaMessageAlert## : key:" + topic + ":" + "value:" + data.size());
        try {

            String index =  data.get("_index").toString();
            String type =  data.get("_type").toString();
            JsonNode sourceNode = mapper.convertValue(data.get("_source"), JsonNode.class);
            String _id = data.get("_id").toString();
            String id = URLEncoder.encode(data.get("_id").toString());

            if(esPushDirect){
                ResponseEntity<Object> response  = elasticService.post(index, type, id, "", sourceNode.toString());
                LOGGER.info("index :: {}, Response :: {} " ,index , response.getStatusCode());
            } else {
                ingestProducer.pushToPipeline(sourceNode, updatedPostTopic, _id);
            }

        } catch (final Exception e) {
            StringBuilder str = new StringBuilder("Exception occurred while processing Message on Topic : ");
        	str.append(topic).append("Exception: ");
        	LOGGER.error(str.toString(), e);
            if(!esPushDirect)
                ingestProducer.pushToPipeline(data, ERROR_INTENT, null);
        }
    }


}
