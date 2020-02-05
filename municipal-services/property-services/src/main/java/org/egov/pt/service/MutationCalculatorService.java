package org.egov.pt.service;


import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Property;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.web.contracts.PropertyRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MutationCalculatorService {




    private ServiceRequestRepository serviceRequestRepository;

    private PropertyConfiguration config;


    @Autowired
    public MutationCalculatorService(ServiceRequestRepository serviceRequestRepository, PropertyConfiguration config) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.config = config;
    }



    /**
     * Calculates the mutation fee
     * @param requestInfo RequestInfo of the request
     * @param property Property getting mutated
     */
    public void calculateMutationFee(RequestInfo requestInfo, Property property){


        PropertyRequest propertyRequest = PropertyRequest.builder().property(property).requestInfo(requestInfo).build();

        StringBuilder url = getMutationCalculorURL();

        serviceRequestRepository.fetchResult(url, propertyRequest);

    }


    /**
     * Returns the mutation calculation endpoint
     * @return
     */
    private StringBuilder getMutationCalculorURL(){

        StringBuilder url = new StringBuilder(config.getCalculationHost());
        url.append(config.getCalculationContextPath());
        url.append(config.getMutationCalculationEndpoint());

        return url;
    }



}
