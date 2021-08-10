package org.egov.fsm.calculator.repository;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.calculator.config.CalculatorConfig;
import org.egov.fsm.calculator.utils.CalculatorConstants;
import org.egov.fsm.calculator.web.models.demand.Demand;
import org.egov.fsm.calculator.web.models.demand.DemandRequest;
import org.egov.fsm.calculator.web.models.demand.DemandResponse;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.ObjectMapper;

@Repository
public class DemandRepository {


    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private CalculatorConfig config;

    @Autowired
    private ObjectMapper mapper;


    /**
     * Creates demand
     * @param requestInfo The RequestInfo of the calculation Request
     * @param demands The demands to be created
     * @return The list of demand created
     */
    public List<Demand> saveDemand(RequestInfo requestInfo, List<Demand> demands){
        StringBuilder url = new StringBuilder(config.getBillingHost());
        url.append(config.getDemandCreateEndpoint());
        DemandRequest request = new DemandRequest(requestInfo,demands);
        Object result = serviceRequestRepository.fetchResult(url,request);
        DemandResponse response = null;
        try{
            response = mapper.convertValue(result,DemandResponse.class);
        }
        catch(IllegalArgumentException e){
            throw new CustomException(CalculatorConstants.PARSING_ERROR,"Failed to parse response of create demand");
        }
        return response.getDemands();
    }


    /**
     * Updates the demand
     * @param requestInfo The RequestInfo of the calculation Request
     * @param demands The demands to be updated
     * @return The list of demand updated
     */
    public List<Demand> updateDemand(RequestInfo requestInfo, List<Demand> demands){
        StringBuilder url = new StringBuilder(config.getBillingHost());
        url.append(config.getDemandUpdateEndpoint());
        DemandRequest request = new DemandRequest(requestInfo,demands);
        Object result = serviceRequestRepository.fetchResult(url,request);
        DemandResponse response = null;
        try{
            response = mapper.convertValue(result,DemandResponse.class);
        }
        catch(IllegalArgumentException e){
            throw new CustomException(CalculatorConstants.PARSING_ERROR,"Failed to parse response of update demand");
        }
        return response.getDemands();

    }


}
