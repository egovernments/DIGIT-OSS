package org.egov.echallan.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.echallan.config.ChallanConfiguration;
import org.egov.echallan.model.Challan;
import org.egov.echallan.model.ChallanRequest;
import org.egov.echallan.repository.ServiceRequestRepository;
import org.egov.echallan.web.models.calculation.Calculation;
import org.egov.echallan.web.models.calculation.CalculationReq;
import org.egov.echallan.web.models.calculation.CalculationRes;
import org.egov.echallan.web.models.calculation.CalulationCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;


@Service
public class CalculationService {


    private ServiceRequestRepository serviceRequestRepository;

    private ObjectMapper mapper;

    private ChallanConfiguration config;
    
    @Autowired
    public CalculationService(ServiceRequestRepository serviceRequestRepository, ObjectMapper mapper,ChallanConfiguration config) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.mapper = mapper;
        this.config = config;
    }

    public Challan addCalculation(ChallanRequest request){
        RequestInfo requestInfo = request.getRequestInfo();
        Challan challan = request.getChallan();

        if(challan==null)
            throw new CustomException("INVALID REQUEST","The request for calculation cannot be empty or null");

        CalculationRes response = getCalculation(requestInfo,challan);
        List<Calculation> calculations = response.getCalculations();
        Map<String,Calculation> applicationNumberToCalculation = new HashMap<>();
        calculations.forEach(calculation -> {
            applicationNumberToCalculation.put(calculation.getChallan().getChallanNo(),calculation);
            calculation.setChallan(null);
        });

            challan.setCalculation(applicationNumberToCalculation.get(challan.getChallanNo()));

        return challan;
    }

    private CalculationRes getCalculation(RequestInfo requestInfo,Challan challan){
    	
    	StringBuilder uri = new StringBuilder();
        uri.append(config.getCalculatorHost());
        uri.append(config.getCalculateEndpoint());
        List<CalulationCriteria> criterias = new LinkedList<>();

         criterias.add(new CalulationCriteria(challan,challan.getChallanNo(),challan.getTenantId()));

        CalculationReq request = CalculationReq.builder().calulationCriteria(criterias)
                .requestInfo(requestInfo)
                .build();

        Object result = serviceRequestRepository.fetchResult(uri,request);
        CalculationRes response = null;
        try{
            response = mapper.convertValue(result,CalculationRes.class);
        }
        catch (IllegalArgumentException e){
            throw new CustomException("PARSING ERROR","Failed to parse response of calculate");
        } 
        return response;
    }

}
