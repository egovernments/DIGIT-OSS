package org.egov.echallan.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

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
	
    @Autowired
    private ChallanConfiguration config;

    private CommonUtils utils;
    
    @Autowired
    public ChallanService(EnrichmentService enrichmentService, UserService userService,ChallanRepository repository,CalculationService calculationService,
    		ChallanValidator validator, CommonUtils utils) {
        this.enrichmentService = enrichmentService;
        this.userService = userService;
        this.repository = repository;
        this.calculationService = calculationService;
        this.validator = validator;
        this.utils = utils;
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
	 
	 public List<Challan> searchChallans(ChallanRequest request){
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

		public List<Challan> plainSearch(SearchCriteria criteria, RequestInfo requestInfo) {
			List<Challan> challanList = getchallanPlainSearch(criteria, requestInfo);
			return challanList;
		}

		private List<Challan> getchallanPlainSearch(SearchCriteria criteria, RequestInfo requestInfo) {
			if (criteria.getLimit() != null && criteria.getLimit() > config.getMaxSearchLimit())
				criteria.setLimit(config.getMaxSearchLimit());
			
			List<String> ids = null;

			if (criteria.getIds() != null && !criteria.getIds().isEmpty())
				ids = criteria.getIds();
			else
				ids = repository.fetchChallanIds(criteria);

			if (ids.isEmpty())
				return Collections.emptyList();
			SearchCriteria challanCriteria = SearchCriteria.builder().ids(ids).build();

			List<Challan> listFSM = repository.getChallanPlainSearch(challanCriteria);
			return listFSM;
		}

}
