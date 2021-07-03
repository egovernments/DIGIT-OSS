package org.egov.pt.calculator.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.pt.calculator.service.DemandService;
import org.egov.pt.calculator.util.CalculatorUtils;
import org.egov.pt.calculator.util.Configurations;
import org.egov.pt.calculator.web.models.CalculationReq;
import org.egov.pt.calculator.web.models.property.Property;
import org.egov.pt.calculator.web.models.property.PropertyRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;


//@Service
@Slf4j
public class CalculationReqConsumer {

    @Autowired
    private DemandService demandService;

    @Autowired
    private CalculatorUtils utils;

    @Autowired
    private Configurations config;

    @Autowired
    private ObjectMapper mapper;

    @KafkaListener(topics = {"${kafka.save.property.topic}","${kafka.update.property.topic}"})
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        try {
            PropertyRequest propertyRequest = mapper.convertValue(record, PropertyRequest.class);
            List<Property> propertiesForDemandGen = new LinkedList<>();
            List<Property> propertiesNotForDemandGen = new LinkedList<>();

            propertyRequest.getProperties().forEach(property -> {
                if(!config.getSourcesToBeIgnored().contains(property.getPropertyDetails().get(0).getSource()))
                    propertiesForDemandGen.add(property);
                else propertiesNotForDemandGen.add(property);
            });

            if(!CollectionUtils.isEmpty(propertiesForDemandGen))
            {
                CalculationReq calculationReq = utils.createCalculationReq(propertyRequest);
                demandService.generateDemands(calculationReq);
            }
        } catch (final Exception e) {
            log.error("Error while listening to value: " + record + " on topic: " + topic + ": " + e);
        }
    }

}