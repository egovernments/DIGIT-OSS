package org.egov.swcalculation.repository;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.swcalculation.config.SWCalculationConfiguration;
import org.egov.swcalculation.web.models.Demand;
import org.egov.swcalculation.web.models.DemandRequest;
import org.egov.swcalculation.web.models.DemandResponse;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.ObjectMapper;

@Repository
public class DemandRepository {

	   @Autowired
	    private ServiceRequestRepository serviceRequestRepository;
	
	    @Autowired
	    private SWCalculationConfiguration config;
	
	    @Autowired
	    private ObjectMapper mapper;
	
	
	    /**
	     * Creates demand
	     * @param requestInfo The RequestInfo of the calculation Request
	     * @param demands The demands to be created
	     * @return The list of demand created
	     */
	    public List<Demand> saveDemand(RequestInfo requestInfo, List<Demand> demands){
	        StringBuilder url = new StringBuilder(config.getBillingServiceHost());
	        url.append(config.getDemandCreateEndPoint());
	        DemandRequest request = new DemandRequest(requestInfo,demands);
	        Object result = serviceRequestRepository.fetchResult(url,request);
	        DemandResponse response;
	        try{
	            response = mapper.convertValue(result,DemandResponse.class);
	        }
	        catch(IllegalArgumentException e){
	            throw new CustomException("PARSING_ERROR","Failed to parse response of create demand");
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
	        StringBuilder url = new StringBuilder(config.getBillingServiceHost());
	        url.append(config.getDemandUpdateEndPoint());
	        DemandRequest request = new DemandRequest(requestInfo,demands);
	        Object result = serviceRequestRepository.fetchResult(url,request);
	        DemandResponse response;
	        try{
	            response = mapper.convertValue(result,DemandResponse.class);
	        }
	        catch(IllegalArgumentException e){
	            throw new CustomException("PARSING_ERROR","Failed to parse response of update demand");
	        }
	        return response.getDemands();

	    }
	
	

}
