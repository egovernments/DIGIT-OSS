package org.egov.pt.service;

import java.util.Map;

import lombok.extern.slf4j.Slf4j;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.web.models.Calculation;
import org.egov.pt.web.models.CalculationCriteria;
import org.egov.pt.web.models.CalculationReq;
import org.egov.pt.web.models.PropertyRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Slf4j
@Service
public class CalculationService {

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

   @Value("${egov.calculation.host}")
   private String calculationHost;

    @Value("${egov.calculation.context.path}")
    private String calculationContextPath;

    @Value("${egov.calculation.endpoint}")
   private String calculationEndpoint;


     public void calculateTax(PropertyRequest request){
         StringBuilder uri = new StringBuilder();
         uri.append(calculationHost).append(calculationContextPath).append(calculationEndpoint);

         CalculationReq calculationReq = createCalculationReq(request);

         Map<String,Calculation> responseMap = ((Map<String, Calculation>)serviceRequestRepository.fetchResult(uri, calculationReq));

         log.debug("responsemap-> "+responseMap);
         request.getProperties().forEach(property -> {
             property.getPropertyDetails().forEach(propertyDetail -> {
                 if(responseMap.get(propertyDetail.getAssessmentNumber())==null)
                     throw new CustomException("CALCULATION_ERROR","The calculation object is coming null from calculation service");
                 else
                 propertyDetail.setCalculation(mapper.convertValue(responseMap.get(propertyDetail.getAssessmentNumber()), Calculation.class));
             });
         });

     }


     private CalculationReq createCalculationReq(PropertyRequest request){
         CalculationReq calculationReq = new CalculationReq();
         calculationReq.setRequestInfo(request.getRequestInfo());

         request.getProperties().forEach(property -> {
             CalculationCriteria calculationCriteria = new CalculationCriteria();
             calculationCriteria.setProperty(property);
             calculationCriteria.setTenantId(property.getTenantId());

             calculationReq.addCalulationCriteriaItem(calculationCriteria);
         });
       return calculationReq;
     }





}
