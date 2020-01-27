package org.egov.pt.service;

import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Assessment;
import org.egov.pt.models.Property;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class CalculationService {

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private PropertyConfiguration config;

    @Autowired
    private TranslationService translationService;


     public void calculateTax(AssessmentRequest assessmentRequest, Property property){
         StringBuilder uri = new StringBuilder();
         uri.append(config.getCalculationHost()).append(config.getCalculationContextPath())
                 .append(config.getCalculationEndpoint());

         Map<String, Object> oldPropertyObject = translationService.translate(assessmentRequest, property);

         // For Debugging should be removed latter
         try{
            log.info("Calculation Request: "+mapper.writeValueAsString(oldPropertyObject));
         }
         catch (Exception e){
             e.printStackTrace();
         }

         Object response = serviceRequestRepository.fetchResult(uri, oldPropertyObject);

         log.debug("response-> "+response);
         if(response == null)
             throw new CustomException("CALCULATION_ERROR","The calculation object is coming null from calculation service");



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
