package org.egov.echallan.service;

import java.util.*;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.echallan.config.ChallanConfiguration;
import org.egov.echallan.model.Challan;
import org.egov.echallan.model.ChallanRequest;
import org.egov.echallan.model.SearchCriteria;
import org.egov.echallan.repository.ChallanRepository;
import org.egov.echallan.util.CommonUtils;
import org.egov.echallan.util.ResponseInfoFactory;
import org.egov.echallan.validator.ChallanValidator;
import org.egov.echallan.web.models.user.UserDetailResponse;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;


@Service
public class ChallanService {

    @Autowired
    private EnrichmentService enrichmentService;

	@Autowired
	private ResponseInfoFactory responseInfoFactory;

    private UserService userService;
    
    private ChallanRepository repository;
    
    private CalculationService calculationService;
    
    private ChallanValidator validator;

    private CommonUtils utils;
    
    private ChallanConfiguration config;
    
    @Autowired
    public ChallanService(EnrichmentService enrichmentService, UserService userService,ChallanRepository repository,CalculationService calculationService,
    		ChallanValidator validator, CommonUtils utils, ChallanConfiguration config) {
        this.enrichmentService = enrichmentService;
        this.userService = userService;
        this.repository = repository;
        this.calculationService = calculationService;
        this.validator = validator;
        this.utils = utils;
        this.config = config;
    }
    
    
	/**
	 * Enriches the Request and pushes to the Queue
	 *
	 * @param request ChallanRequest containing list of challans to be created
	 * @return Challan successfully created
	 */
	public Challan create(ChallanRequest request) {
		Object mdmsData = utils.mDMSCall(request);
		validator.validateFields(request, mdmsData);
		enrichmentService.enrichCreateRequest(request);
		userService.createUser(request);
		calculationService.addCalculation(request);
		repository.save(request);
		return request.getChallan();
	}
	
	
	 public List<Challan> search(SearchCriteria criteria, RequestInfo requestInfo){
	        List<Challan> challans;
	        //enrichmentService.enrichSearchCriteriaWithAccountId(requestInfo,criteria);
	         if(criteria.getMobileNumber()!=null){
	        	 challans = getChallansFromMobileNumber(criteria,requestInfo);
	         }
	         else {
	        	 challans = getChallansWithOwnerInfo(criteria,requestInfo);
	         }
	       return challans;
	    }
	 public List<Challan> getChallansFromMobileNumber(SearchCriteria criteria, RequestInfo requestInfo){
		 List<Challan> challans = new LinkedList<>();
	        UserDetailResponse userDetailResponse = userService.getUser(criteria,requestInfo);
	        if(CollectionUtils.isEmpty(userDetailResponse.getUser())){
	            return Collections.emptyList();
	        }
	        enrichmentService.enrichSearchCriteriaWithOwnerids(criteria,userDetailResponse);
	        challans = repository.getChallans(criteria);

	        if(CollectionUtils.isEmpty(challans)){
	            return Collections.emptyList();
	        }

	        criteria=enrichmentService.getChallanCriteriaFromIds(challans);
	        challans = getChallansWithOwnerInfo(criteria,requestInfo);
	        return challans;
	    }
	 
	 public List<Challan> getChallansWithOwnerInfo(SearchCriteria criteria,RequestInfo requestInfo){
	        List<Challan> challans = repository.getChallans(criteria);
	        if(challans.isEmpty())
	            return Collections.emptyList();
	        challans = enrichmentService.enrichChallanSearch(challans,criteria,requestInfo);
	        return challans;
	    }

	/**
	 * gets the total count for a search request
	 *
	 * @param criteria The challan search criteria
	 * @param requestInfo requestInfo
	 */
	public int countForSearch(SearchCriteria criteria, RequestInfo requestInfo){
		int count=0;

		if(criteria.getMobileNumber()!=null){
			count = getCountOfChallansFromMobileNumber(criteria,requestInfo);
		}
		else {
			count = getCountOfChallansWithOwnerInfo(criteria,requestInfo);
		}
		return count;
	}

	public int getCountOfChallansFromMobileNumber(SearchCriteria criteria, RequestInfo requestInfo){
		UserDetailResponse userDetailResponse = userService.getUser(criteria,requestInfo);
		if(CollectionUtils.isEmpty(userDetailResponse.getUser())){
			return 0;
		}
		enrichmentService.enrichSearchCriteriaWithOwnerids(criteria,userDetailResponse);

		int count = repository.getChallanSearchCount(criteria);
		return count;
	}

	public int getCountOfChallansWithOwnerInfo(SearchCriteria criteria,RequestInfo requestInfo){
		int count = repository.getChallanSearchCount(criteria);
		return count;
	}
	 public List<Challan> searchChallans(ChallanRequest request){
		 	validator.validateSearchRequest(request.getChallan().getTenantId());
	        SearchCriteria criteria = new SearchCriteria();
	        List<String> ids = new LinkedList<>();
	        ids.add(request.getChallan().getId());

	        criteria.setTenantId(request.getChallan().getTenantId());
	        criteria.setIds(ids);
	        criteria.setBusinessService(request.getChallan().getBusinessService());

	        List<Challan> challans = repository.getChallans(criteria);

	        if(challans.isEmpty())
	            return Collections.emptyList();
	        challans = enrichmentService.enrichChallanSearch(challans,criteria,request.getRequestInfo());
	        return challans;
	    }
	 
	 public Challan update(ChallanRequest request) {
		 Object mdmsData = utils.mDMSCall(request);
		 validator.validateFields(request, mdmsData);
		 List<Challan> searchResult = searchChallans(request);
		 validator.validateUpdateRequest(request,searchResult);
		 enrichmentService.enrichUpdateRequest(request);
		 calculationService.addCalculation(request);
		 repository.update(request);
		 return request.getChallan();
		}

	 public Map<String,Object>  getChallanCountResponse(RequestInfo requestInfo, String tenantId){
		 validator.validateChallanCountRequest(tenantId);

		 Map<String,Object> response = new HashMap<>();
		 Map<String,String> results = new HashMap<>();
		 ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);

		 response.put("ResponseInfo",responseInfo);
		 results	= repository.fetchChallanCount(tenantId);

		 if(CollectionUtils.isEmpty(results) || results.get("totalChallan").equalsIgnoreCase("0"))
			 throw new CustomException("NO_RECORDS","No records found for the tenantId: "+tenantId);

		 response.put("ChallanCount",results);
		 return  response;
	 }


	public Map<String, Integer> getDynamicData(String tenantId) {
		Map<String,Integer> dynamicData = repository.fetchDynamicData(tenantId);
		
		return dynamicData;
	}
	
	public int getChallanValidity() {
		return Integer.valueOf(config.getChallanValidity());
	}

	
}