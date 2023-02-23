package digit.service;

import digit.config.Configuration;
import digit.kafka.Producer;
import digit.repository.ServiceRequestRepository;
import digit.validators.ServiceDefinitionRequestValidator;
import digit.validators.ServiceRequestValidator;
import digit.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestValidator serviceRequestValidator;

    @Autowired
    private ServiceRequestEnrichmentService enrichmentService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private Producer producer;

    @Autowired
    private Configuration config;

    public digit.web.models.Service createService(ServiceRequest serviceRequest) {

        digit.web.models.Service service = serviceRequest.getService();

        // Validate incoming service definition request
        serviceRequestValidator.validateServiceRequest(serviceRequest);

        // Enrich incoming service definition request
        enrichmentService.enrichServiceRequest(serviceRequest);

        // Producer statement to emit service definition to kafka for persisting
        producer.push(config.getServiceCreateTopic(), serviceRequest);

        return service;
    }

    public List<digit.web.models.Service> searchService(ServiceSearchRequest serviceSearchRequest){

        List<digit.web.models.Service> listOfServices = serviceRequestRepository.getService(serviceSearchRequest);

        if(CollectionUtils.isEmpty(listOfServices))
            return new ArrayList<>();

        return listOfServices;
    }

    public digit.web.models.Service updateService(ServiceRequest serviceRequest) {

        // TO DO

        return serviceRequest.getService();
    }

}
