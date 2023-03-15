package org.egov.pt.consumer;


import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.producer.Producer;
import org.egov.pt.service.CalculationService;
import org.egov.pt.service.PropertyService;
import org.egov.pt.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Slf4j
@Service
public class DemandBasedConsumer {

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private Producer producer;

    @Autowired
    private PropertyConfiguration config;
    
    @Autowired
    private CalculationService calcService;


    /**
     * Listens on the bulk update topic and pushes failed batches on dead letter topic
     *
     * @param records The input bulk update requests
     */
    @KafkaListener(topics = {"${persister.demand.based.topic}"}, containerFactory = "kafkaListenerContainerFactoryBatch")
    public void listen(final List<Message<?>> records) {

        List<DemandBasedAssessment> demandBasedAssessments = new ArrayList<>();
        RequestInfo requestInfo =
                mapper.convertValue(records.get(0).getPayload(), DemandBasedAssessmentRequest.class).getRequestInfo();

        for(Message record : records) {
            DemandBasedAssessmentRequest demandBasedAssessmentRequest = null;
            try {
                demandBasedAssessmentRequest = mapper.convertValue(record.getPayload(), DemandBasedAssessmentRequest.class);
                demandBasedAssessments.add(demandBasedAssessmentRequest.getDemandBasedAssessment());
            } catch (final Exception e) {
                log.error("Error while listening to value: " + record);
            }
        }
        log.info("Number of batch records: " + demandBasedAssessments.size());


        Map<String, List<DemandBasedAssessment>> tenantIdToDemandBasedAssessmentMap = groupByTenantId(demandBasedAssessments);

        for (Map.Entry<String, List<DemandBasedAssessment>> entry : tenantIdToDemandBasedAssessmentMap.entrySet()) {
            createAssessment(requestInfo, entry.getValue(), config.getDeadLetterTopicBatch());
        }
    }

    /**
     * Listens on the dead letter topic of the bulk request and processes
     * every record individually and pushes failed records on error topic
     *
     * @param records Single update request
     */
    @KafkaListener(topics = {"${persister.demand.based.dead.letter.topic.batch}"}, containerFactory = "kafkaListenerContainerFactory")
    public void listenDeadLetterTopic(final List<Message<?>> records) {



        List<DemandBasedAssessment> demandBasedAssessments = new ArrayList<>();
        RequestInfo requestInfo =
                mapper.convertValue(records.get(0).getPayload(), DemandBasedAssessmentRequest.class).getRequestInfo();

        for(Message record : records) {
            DemandBasedAssessmentRequest demandBasedAssessmentRequest = null;
            try {
                demandBasedAssessmentRequest = mapper.convertValue(record.getPayload(), DemandBasedAssessmentRequest.class);
                demandBasedAssessments.add(demandBasedAssessmentRequest.getDemandBasedAssessment());
            } catch (final Exception e) {
                log.error("Error while listening to value: " + record);
            }
        }

        Map<String, List<DemandBasedAssessment>> tenantIdToDemandBasedAssessmentMap = groupByTenantId(demandBasedAssessments);

        for (Map.Entry<String, List<DemandBasedAssessment>> entry : tenantIdToDemandBasedAssessmentMap.entrySet()) {
            createAssessment(requestInfo, entry.getValue(), config.getDeadLetterTopicSingle());
        }
    }


    /**
     * Searches the property, sets the financialYear and calls update on it
     *
     * @param requestInfo            The RequestInfo object of the request
     * @param demandBasedAssessments The list of DemandBasedAssessment objects containing the assessmentNumber
     *                               to be updated
     * @param errorTopic             The topic on whcih failed request are pushed
     */
    private void createAssessment(RequestInfo requestInfo, List<DemandBasedAssessment> demandBasedAssessments, String errorTopic) {
    	
        try {
        	List<String> consumercodes = new ArrayList<>();
            String financialYear = demandBasedAssessments.get(0).getFinancialYear();
            PropertyCriteria criteria = getSearchCriteria(demandBasedAssessments);
            List<Property> properties = propertyService.getPropertiesWithOwnerInfo(criteria, requestInfo);
            setFields(properties, financialYear);
            List<Property> updatedProps = propertyService.updateProperty(new PropertyRequest(requestInfo, properties));
            if(errorTopic.equalsIgnoreCase(config.getDeadLetterTopicBatch()))
                log.info("Batch Processed Successfully: {}",demandBasedAssessments);
            
            // Generating bills for the demands created
			for (Property property : updatedProps)
				consumercodes.add(property.getPropertyId());
			calcService.getBills(consumercodes, demandBasedAssessments.get(0).getTenantId(), requestInfo);

        } catch (Exception e) {
            DemandBasedAssessmentRequest request = DemandBasedAssessmentRequest.builder()
                    .requestInfo(requestInfo).build();

            for (DemandBasedAssessment demandBasedAssessment : demandBasedAssessments) {
                request.setDemandBasedAssessment(demandBasedAssessment);
                log.error("UPDATE ERROR: ", e);
                log.info("error topic: {}", errorTopic);
                producer.push(errorTopic, request);
            }
        }

    }


	/**
     * Creates property search criteria based on DemandBasedAssessment
     *
     * @param demandBasedAssessments The list of demandBasedAssessment
     * @return PropertySearchCriteria
     */
    private PropertyCriteria getSearchCriteria(List<DemandBasedAssessment> demandBasedAssessments) {

        Set<String> assessmentNumbers = demandBasedAssessments.stream()
                .map(DemandBasedAssessment::getAssessmentNumber).collect(Collectors.toSet());

        PropertyCriteria criteria = new PropertyCriteria();
        criteria.setTenantId(demandBasedAssessments.get(0).getTenantId());
        criteria.setPropertyDetailids(assessmentNumbers);

        return criteria;
    }


    /**
     * Sets financialYear and source
     *
     * @param properties
     * @param financialYear
     */
    private void setFields(List<Property> properties, String financialYear) {
        properties.forEach(property -> {
            property.getPropertyDetails().get(0).setFinancialYear(financialYear);
            property.getPropertyDetails().get(0).setSource(PropertyDetail.SourceEnum.SYSTEM);
            property.getPropertyDetails().get(0).setAdhocExemption(null);
            property.getPropertyDetails().get(0).setAdhocPenalty(null);
        });
    }


    /**
     * Creates a map of tenantId to DemandBasedAssessment
     *
     * @param request The update request
     * @return Map of tenantId to DemandBasedAssessment
     */
    private Map<String, List<DemandBasedAssessment>> groupByTenantId(List<DemandBasedAssessment> request) {
        Map<String, List<DemandBasedAssessment>> tenantIdToDemandBasedAssessmentMap = new HashMap<>();

        request.forEach(demandBasedAssessment -> {
            if (tenantIdToDemandBasedAssessmentMap.containsKey(demandBasedAssessment.getTenantId()))
                tenantIdToDemandBasedAssessmentMap.get(demandBasedAssessment.getTenantId()).add(demandBasedAssessment);
            else {
                LinkedList<DemandBasedAssessment> demandBasedAssessments = new LinkedList<>();
                demandBasedAssessments.add(demandBasedAssessment);
                tenantIdToDemandBasedAssessmentMap.put(demandBasedAssessment.getTenantId(), demandBasedAssessments);
            }
        });

        return tenantIdToDemandBasedAssessmentMap;
    }


}
