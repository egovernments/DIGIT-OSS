package org.egov.pt.service;

import java.util.Map;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Property;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.egov.pt.web.contracts.PropertyRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CalculationService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private PropertyConfiguration config;

    @Autowired
    private TranslationService translationService;


     public void calculateTax(AssessmentRequest assessmentRequest, Property property){
    	 
         StringBuilder uri = new StringBuilder(config.getCalculationHost())
			        		 .append(config.getCalculationContextPath())
			                 .append(config.getCalculationEndpoint());

         Map<String, Object> oldPropertyObject = translationService.translate(assessmentRequest, property);
         Object response = serviceRequestRepository.fetchResult(uri, oldPropertyObject);
         if(response == null)
             throw new CustomException("CALCULATION_ERROR","The calculation object is coming null from calculation service");
     }

     

     /**
      * Calculates the mutation fee
      * @param requestInfo RequestInfo of the request
      * @param property Property getting mutated
      */
     public void calculateMutationFee(RequestInfo requestInfo, Property property){

         PropertyRequest propertyRequest = PropertyRequest.builder()
         		.requestInfo(requestInfo)
         		.property(property)
         		.build();

 		StringBuilder url = new StringBuilder(config.getCalculationHost())
 				.append(config.getCalculationContextPath())
 				.append(config.getMutationCalculationEndpoint());

 		serviceRequestRepository.fetchResult(url, propertyRequest);
 	}

//     private CalculationReq createCalculationReq(PropertyRequest request){
//         CalculationReq calculationReq = new CalculationReq();
//         calculationReq.setRequestInfo(request.getRequestInfo());
//
//         request.getProperties().forEach(property -> {
//             CalculationCriteria calculationCriteria = new CalculationCriteria();
//             calculationCriteria.setProperty(property);
//             calculationCriteria.setTenantId(property.getTenantId());
//
//             calculationReq.addCalulationCriteriaItem(calculationCriteria);
//         });
//       return calculationReq;
//     }





}
