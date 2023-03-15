package org.egov.pt.service;

import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.web.models.*;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Slf4j
@Service
public class CalculationService {

    private ObjectMapper mapper;

    private ServiceRequestRepository serviceRequestRepository;

    private PropertyConfiguration config;


    @Autowired
    public CalculationService(ObjectMapper mapper, ServiceRequestRepository serviceRequestRepository, PropertyConfiguration config) {
        this.mapper = mapper;
        this.serviceRequestRepository = serviceRequestRepository;
        this.config = config;
    }

    public void calculateTax(PropertyRequest request){
         StringBuilder uri = new StringBuilder();
         uri.append(config.getCalculationHost()).append(config.getCalculationContextPath()).append(config.getCalculationEndpoint());

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



    public Object getBills(List<String> consumercodes, String tenantId, RequestInfo requestInfo) {

        StringBuilder uri = new StringBuilder();
        uri.append(config.getBillingHost()).append(config.getBillingContext()).append(config.getFetchBillEndPoint())
                .append("?tenantId=").append(tenantId).append("&consumerCodes=")
                .append(consumercodes.toString().replace("[", "").replace("]", ""));
        return serviceRequestRepository.fetchResult(uri, RequestInfoWrapper.builder().requestInfo(requestInfo).build());
    }





}
