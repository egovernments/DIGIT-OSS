package digit.service;

import digit.config.Configuration;
import digit.kafka.Producer;
import digit.repository.ServiceDefinitionRequestRepository;
import digit.validators.ServiceDefinitionRequestValidator;
import digit.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

@Service
public class ServiceDefinitionRequestService {

    @Autowired
    private ServiceDefinitionRequestValidator serviceDefinitionRequestValidator;

    @Autowired
    private ServiceRequestEnrichmentService enrichmentService;

    @Autowired
    private ServiceDefinitionRequestRepository serviceDefinitionRequestRepository;

    @Autowired
    private Producer producer;

    @Autowired
    private Configuration config;

    public ServiceDefinition createServiceDefinition(ServiceDefinitionRequest serviceDefinitionRequest) {

        ServiceDefinition serviceDefinition = serviceDefinitionRequest.getServiceDefinition();

        // Validate incoming service definition request
        serviceDefinitionRequestValidator.validateServiceDefinitionRequest(serviceDefinitionRequest);

        // Enrich incoming service definition request
        enrichmentService.enrichServiceDefinitionRequest(serviceDefinitionRequest);

        // Producer statement to emit service definition to kafka for persisting
        producer.push(config.getServiceDefinitionCreateTopic(), serviceDefinitionRequest);

        // Restore attribute values to the type in which it was sent in service definition request
        enrichmentService.setAttributeDefinitionValuesBackToNativeState(serviceDefinition);

        return serviceDefinition;
    }

    public List<ServiceDefinition> searchServiceDefinition(ServiceDefinitionSearchRequest serviceDefinitionSearchRequest){

        List<ServiceDefinition> listOfServiceDefinitions = serviceDefinitionRequestRepository.getServiceDefinitions(serviceDefinitionSearchRequest);

        if(CollectionUtils.isEmpty(listOfServiceDefinitions))
            return new ArrayList<>();

        listOfServiceDefinitions.forEach(serviceDefinition -> {
            // Restore attribute values to native state
            enrichmentService.setAttributeDefinitionValuesBackToNativeState(serviceDefinition);
        });

        return listOfServiceDefinitions;
    }

    public ServiceDefinition updateServiceDefinition(ServiceDefinitionRequest serviceDefinitionRequest) {

        // TO DO

        return serviceDefinitionRequest.getServiceDefinition();
    }

}

