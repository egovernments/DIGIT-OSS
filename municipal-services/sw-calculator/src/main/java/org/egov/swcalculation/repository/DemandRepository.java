package org.egov.swcalculation.repository;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.swcalculation.config.SWCalculationConfiguration;
import org.egov.swcalculation.producer.SWCalculationProducer;
import org.egov.swcalculation.web.models.Demand;
import org.egov.swcalculation.web.models.DemandNotificationObj;
import org.egov.swcalculation.web.models.DemandRequest;
import org.egov.swcalculation.web.models.DemandResponse;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.util.CollectionUtils;

@Repository
public class DemandRepository {

	   @Autowired
	    private ServiceRequestRepository serviceRequestRepository;
	
	    @Autowired
	    private SWCalculationConfiguration config;
	
	    @Autowired
	    private ObjectMapper mapper;

		@Autowired
		private SWCalculationProducer swCalculationProducer;


	/**
	     * Creates demand
	     * @param requestInfo The RequestInfo of the calculation Request
	     * @param demands The demands to be created
	     * @return The list of demand created
	     */
	    public List<Demand> saveDemand(RequestInfo requestInfo, List<Demand> demands, DemandNotificationObj notificationObj){
	        StringBuilder url = new StringBuilder(config.getBillingServiceHost());
	        url.append(config.getDemandCreateEndPoint());
	        DemandRequest request = new DemandRequest(requestInfo,demands);
	        try{
				Object result = serviceRequestRepository.fetchResult(url, request);
				List<Demand>  demandList =  mapper.convertValue(result,DemandResponse.class).getDemands();
				if(!CollectionUtils.isEmpty(demandList)) {
					notificationObj.setSuccess(true);
					swCalculationProducer.push(config.getOnDemandSuccess(), notificationObj);
				}
				return demandList;
	        }
	        catch(IllegalArgumentException e){
				notificationObj.setSuccess(false);
				swCalculationProducer.push(config.getOnDemandFailed(), notificationObj);
				throw new CustomException("EG_SW_PARSING_ERROR","Failed to parse response of create demand");
	        }
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
	            throw new CustomException("EG_SW_PARSING_ERROR","Failed to parse response of update demand");
	        }
	        return response.getDemands();

	    }
	
	

}
