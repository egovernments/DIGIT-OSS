package org.egov.tl.service;

import java.util.*;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.repository.TLRepository;
import org.egov.tl.service.notification.EditNotificationService;
import org.egov.tl.util.TLConstants;
import org.egov.tl.util.TradeUtil;
import org.egov.tl.validator.TLValidator;
import org.egov.tl.web.models.*;
import org.egov.tl.web.models.user.UserDetailResponse;
import org.egov.tl.web.models.workflow.BusinessService;
import org.egov.tl.workflow.ActionValidator;
import org.egov.tl.workflow.TLWorkflowService;
import org.egov.tl.workflow.WorkflowIntegrator;
import org.egov.tl.workflow.WorkflowService;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import static org.egov.tl.util.TLConstants.*;
import static org.egov.tracer.http.HttpUtils.isInterServiceCall;

import lombok.extern.slf4j.Slf4j;
import org.springframework.util.CollectionUtils;

import com.jayway.jsonpath.JsonPath;

@Service
@Slf4j
public class TradeLicenseService {
	
	private WorkflowIntegrator wfIntegrator;

    private EnrichmentService enrichmentService;

    private UserService userService;

    private TLRepository repository;

    private ActionValidator actionValidator;

    private TLValidator tlValidator;

    private TLWorkflowService TLWorkflowService;

    private CalculationService calculationService;

    private TradeUtil util;

    private DiffService diffService;

    private TLConfiguration config;

    private WorkflowService workflowService;

    private EditNotificationService  editNotificationService;

    private TradeUtil tradeUtil;

    private TLBatchService tlBatchService;

    @Value("${workflow.bpa.businessServiceCode.fallback_enabled}")
    private Boolean pickWFServiceNameFromTradeTypeOnly;

    @Autowired
    public TradeLicenseService(WorkflowIntegrator wfIntegrator, EnrichmentService enrichmentService,
                               UserService userService, TLRepository repository, ActionValidator actionValidator,
                               TLValidator tlValidator, TLWorkflowService TLWorkflowService,
                               CalculationService calculationService, TradeUtil util, DiffService diffService,
                               TLConfiguration config, EditNotificationService editNotificationService, WorkflowService workflowService,
                               TradeUtil tradeUtil, TLBatchService tlBatchService) {
        this.wfIntegrator = wfIntegrator;
        this.enrichmentService = enrichmentService;
        this.userService = userService;
        this.repository = repository;
        this.actionValidator = actionValidator;
        this.tlValidator = tlValidator;
        this.TLWorkflowService = TLWorkflowService;
        this.calculationService = calculationService;
        this.util = util;
        this.diffService = diffService;
        this.config = config;
        this.editNotificationService = editNotificationService;
        this.workflowService = workflowService;
        this.tradeUtil = tradeUtil;
        this.tlBatchService = tlBatchService;
    }





    /**
     * creates the tradeLicense for the given request
     * @param tradeLicenseRequest The TradeLicense Create Request
     * @return The list of created traddeLicense
     */
    public List<TradeLicense> create(TradeLicenseRequest tradeLicenseRequest,String businessServicefromPath){
       if(businessServicefromPath==null)
            businessServicefromPath = businessService_TL;
       tlValidator.validateBusinessService(tradeLicenseRequest,businessServicefromPath);
       Object mdmsData = util.mDMSCall(tradeLicenseRequest.getRequestInfo(), tradeLicenseRequest.getLicenses().get(0).getTenantId());
       Object billingSlabs = util.getBillingSlabs(tradeLicenseRequest.getRequestInfo(), tradeLicenseRequest.getLicenses().get(0).getTenantId());
       actionValidator.validateCreateRequest(tradeLicenseRequest);
        switch(businessServicefromPath)
        {
            case businessService_BPA:
                validateMobileNumberUniqueness(tradeLicenseRequest);
                break;
        }
       enrichmentService.enrichTLCreateRequest(tradeLicenseRequest, mdmsData);
       tlValidator.validateCreate(tradeLicenseRequest, mdmsData, billingSlabs);
       userService.createUser(tradeLicenseRequest, false);
       calculationService.addCalculation(tradeLicenseRequest);

        /*
         * call workflow service if it's enable else uses internal workflow process
         */
       switch(businessServicefromPath)
       {
           case businessService_TL:
               if (config.getIsExternalWorkFlowEnabled())
                   wfIntegrator.callWorkFlow(tradeLicenseRequest);
               break;
       }
        repository.save(tradeLicenseRequest);
       

        return tradeLicenseRequest.getLicenses();
	}

    public void validateMobileNumberUniqueness(TradeLicenseRequest request) {
        for (TradeLicense license : request.getLicenses()) {
            for (TradeUnit tradeUnit : license.getTradeLicenseDetail().getTradeUnits()) {
                String tradetypeOfNewLicense = tradeUnit.getTradeType().split("\\.")[0];
                List<String> mobileNumbers = license.getTradeLicenseDetail().getOwners().stream().map(OwnerInfo::getMobileNumber).collect(Collectors.toList());
                for (String mobno : mobileNumbers) {
                    TradeLicenseSearchCriteria tradeLicenseSearchCriteria = TradeLicenseSearchCriteria.builder().tenantId(license.getTenantId()).businessService(license.getBusinessService()).mobileNumber(mobno).build();
                    List<TradeLicense> licensesFromSearch = getLicensesFromMobileNumber(tradeLicenseSearchCriteria, request.getRequestInfo());
                    List<String> tradeTypeResultforSameMobNo = new ArrayList<>();
                    for (TradeLicense result : licensesFromSearch) {
                        if (!StringUtils.equals(result.getApplicationNumber(), license.getApplicationNumber()) && !StringUtils.equals(result.getStatus(),STATUS_REJECTED)) {
                            tradeTypeResultforSameMobNo.add(result.getTradeLicenseDetail().getTradeUnits().get(0).getTradeType().split("\\.")[0]);
                        }
                    }
                    if (tradeTypeResultforSameMobNo.contains(tradetypeOfNewLicense)) {
                        throw new CustomException("DUPLICATE_TRADETYPEONMOBNO", " Same mobile number can not be used for more than one applications on same license type: "+tradetypeOfNewLicense);
                    }
                }
            }
        }
    }
    /**
     *  Searches the tradeLicense for the given criteria if search is on owner paramter then first user service
     *  is called followed by query to db
     * @param criteria The object containing the paramters on which to search
     * @param requestInfo The search request's requestInfo
     * @return List of tradeLicense for the given criteria
     */
    public List<TradeLicense> search(TradeLicenseSearchCriteria criteria, RequestInfo requestInfo, String serviceFromPath, HttpHeaders headers){
        List<TradeLicense> licenses;
        // allow mobileNumber based search by citizen if interserviceCall
        boolean isInterServiceCall = isInterServiceCall(headers);
        tlValidator.validateSearch(requestInfo,criteria,serviceFromPath, isInterServiceCall);
        criteria.setBusinessService(serviceFromPath);
        enrichmentService.enrichSearchCriteriaWithAccountId(requestInfo,criteria);
        if(criteria.getRenewalPending()!=null && criteria.getRenewalPending()== true ) {
        	
        	String currentFinancialYear = "";
       	    
            
            Object mdmsData = util.mDMSCall(requestInfo, criteria.getTenantId() );
            String jsonPath = TLConstants.MDMS_CURRENT_FINANCIAL_YEAR.replace("{}",businessService_TL);
            List<Map<String,Object>> jsonOutput =  JsonPath.read(mdmsData, jsonPath);
            
            for (int i=0; i<jsonOutput.size();i++) {
           	 Object startingDate = jsonOutput.get(i).get(TLConstants.MDMS_STARTDATE);
           	 Object endingDate = jsonOutput.get(i).get(TLConstants.MDMS_ENDDATE);
           	 Long startTime = (Long)startingDate;
           	 Long endTime = (Long)endingDate;
           	 
           	 if(System.currentTimeMillis()>=startTime && System.currentTimeMillis()<=endTime) {
           		 currentFinancialYear = jsonOutput.get(i).get(TLConstants.MDMS_FIN_YEAR_RANGE).toString();
           		 break;
           	 }
           	 
            }
            
            
            criteria.setFinancialYear(currentFinancialYear);
        	
        }
        
         if(criteria.getMobileNumber()!=null || criteria.getOwnerName() != null){
             licenses = getLicensesFromMobileNumber(criteria,requestInfo);
         }
         else {
             licenses = getLicensesWithOwnerInfo(criteria,requestInfo);
         }

         return licenses;       
    }
    
    private void getLatestRejectedApplication(RequestInfo requestInfo, List<TradeLicense> licenses) {
    	List <TradeLicense> licensesToBeRemoved = new ArrayList<TradeLicense>();
    	List <TradeLicense> licensesToBeAdded = new ArrayList<TradeLicense>();
        
        for (TradeLicense rejectedLicense : licenses) {
       	 
       	 if(rejectedLicense.getStatus().toString().equalsIgnoreCase(TLConstants.STATUS_REJECTED)) {
       		 TradeLicenseSearchCriteria rejectedCriteria = new TradeLicenseSearchCriteria();
       		 
       		 rejectedCriteria.setTenantId(rejectedLicense.getTenantId());
       		 
       		 List <String> rejectedLicenseNumbers = new ArrayList<String>();
       		 rejectedLicenseNumbers.add(rejectedLicense.getLicenseNumber());
       		 
       		 rejectedCriteria.setLicenseNumbers(rejectedLicenseNumbers);
       		 licensesToBeRemoved.add(rejectedLicense);
       		 
       		 List <TradeLicense> rejectedLicenses = getLicensesWithOwnerInfo(rejectedCriteria,requestInfo);
       		 
       		 TradeLicense latestApplication = rejectedLicense;
       		 
       		 for(TradeLicense newLicense: rejectedLicenses) {
       			 if(latestApplication.getStatus().equalsIgnoreCase(TLConstants.STATUS_REJECTED)) {
       				 latestApplication = newLicense;
       			 }
       			 else {
       				 if(newLicense.getFinancialYear().toString().compareTo(latestApplication.getFinancialYear().toString())>0 && !newLicense.getStatus().equalsIgnoreCase(TLConstants.STATUS_REJECTED)) {
       					 latestApplication=newLicense;
       				 }
       			 }
       		 }
       		 
       		 if(latestApplication.getFinancialYear().toString().compareTo(rejectedLicense.getFinancialYear().toString()) <0) {
       			 licensesToBeAdded.add(latestApplication);
       		 }

       	 }
       	 
        }
        licenses.addAll(licensesToBeAdded);
        licenses.removeAll(licensesToBeRemoved);
	}


	private void filterRejectedApplications(RequestInfo requestInfo, List<TradeLicense> licenses) {
    	String currentFinancialYear = "";
   	    TradeLicenseRequest tradeLicenseRequest = new TradeLicenseRequest();
        tradeLicenseRequest.setRequestInfo(requestInfo);
        tradeLicenseRequest.setLicenses(licenses);
        
        Object mdmsData = util.mDMSCall(tradeLicenseRequest.getRequestInfo(), tradeLicenseRequest.getLicenses().get(0).getTenantId());
        String jsonPath = TLConstants.MDMS_CURRENT_FINANCIAL_YEAR.replace("{}",businessService_TL);
        List<Map<String,Object>> jsonOutput =  JsonPath.read(mdmsData, jsonPath);
        
        for (int i=0; i<jsonOutput.size();i++) {
       	 Object startingDate = jsonOutput.get(i).get(TLConstants.MDMS_STARTDATE);
       	 Object endingDate = jsonOutput.get(i).get(TLConstants.MDMS_ENDDATE);
       	 Long startTime = (Long)startingDate;
       	 Long endTime = (Long)endingDate;
       	 
       	 if(System.currentTimeMillis()>=startTime && System.currentTimeMillis()<=endTime) {
       		 currentFinancialYear = jsonOutput.get(i).get(TLConstants.MDMS_FIN_YEAR_RANGE).toString();
       		 break;
       	 }
       	 
        }
        
        String checker = currentFinancialYear;
        licenses.removeIf(t->t.getStatus().toString().equalsIgnoreCase(TLConstants.STATUS_REJECTED) && !t.getFinancialYear().toString().equalsIgnoreCase(checker));

	}

	
	public int countLicenses(TradeLicenseSearchCriteria criteria, RequestInfo requestInfo, String serviceFromPath, HttpHeaders headers){
		
		criteria.setBusinessService(serviceFromPath);
    	enrichmentService.enrichSearchCriteriaWithAccountId(requestInfo,criteria);


    	int licenseCount = repository.getLicenseCount(criteria);
    	
    	return licenseCount;
    }

	public Map<String,Integer> countApplications(TradeLicenseSearchCriteria criteria, RequestInfo requestInfo, String serviceFromPath, HttpHeaders headers){
	
		criteria.setBusinessService(serviceFromPath);
		
		Map<String,Integer> licenseCount = repository.getApplicationsCount(criteria);
	
		return licenseCount;
	}
    

    public void checkEndStateAndAddBPARoles(TradeLicenseRequest tradeLicenseRequest) {
        List<String> endstates = tradeUtil.getBPAEndState(tradeLicenseRequest);
        List<TradeLicense> licensesToAddRoles = new ArrayList<>();
        for (int i = 0; i < tradeLicenseRequest.getLicenses().size(); i++) {
            TradeLicense license = tradeLicenseRequest.getLicenses().get(0);
            if ((license.getStatus() != null) && license.getStatus().equalsIgnoreCase(endstates.get(i))) {
                licensesToAddRoles.add(license);
            }
        }
        if (!licensesToAddRoles.isEmpty()) {
            TradeLicenseRequest tradeLicenseRequestForUserUpdate = TradeLicenseRequest.builder().licenses(licensesToAddRoles).requestInfo(tradeLicenseRequest.getRequestInfo()).build();
            userService.createUser(tradeLicenseRequestForUserUpdate, true);
        }
    }

    public List<TradeLicense> getLicensesFromMobileNumber(TradeLicenseSearchCriteria criteria, RequestInfo requestInfo){
    	
        List<TradeLicense> licenses = new LinkedList<>();
        
        boolean isEmpty = enrichWithUserDetails(criteria,requestInfo);
        
        if(isEmpty) {
        	return Collections.emptyList();
        }
        
        //Get all tradeLicenses with ownerInfo enriched from user service
        licenses = getLicensesWithOwnerInfo(criteria,requestInfo);
        return licenses;
    }


    /**
     * Returns the tradeLicense with enrivhed owners from user servise
     * @param criteria The object containing the paramters on which to search
     * @param requestInfo The search request's requestInfo
     * @return List of tradeLicense for the given criteria
     */
    public List<TradeLicense> getLicensesWithOwnerInfo(TradeLicenseSearchCriteria criteria,RequestInfo requestInfo){
        List<TradeLicense> licenses = repository.getLicenses(criteria);
        if(licenses.isEmpty())
            return Collections.emptyList();
        licenses = enrichmentService.enrichTradeLicenseSearch(licenses,criteria,requestInfo);
        return licenses;
    }


    private void removeDuplicates(List<TradeLicense> licenses) {
    	List <TradeLicense> duplicateLicenses = new ArrayList<TradeLicense>();
    	
    	for(TradeLicense license : licenses) {
    		for(TradeLicense duplicateLicense : licenses) {
    			if (!license.getApplicationNumber().equalsIgnoreCase(duplicateLicense.getApplicationNumber()) && license.getLicenseNumber().equalsIgnoreCase(duplicateLicense.getLicenseNumber()) &&  duplicateLicense.getFinancialYear().compareTo(license.getFinancialYear())<0 ) {
    				duplicateLicenses.add(duplicateLicense);
    			}
    		}
    	}
    	
    	for (TradeLicense duplicateLicense : duplicateLicenses) {
    		licenses.removeIf(t->t.getApplicationNumber().equalsIgnoreCase(duplicateLicense.getApplicationNumber()));
    	}
		
	}

	/**
     * Returns tradeLicense from db for the update request
     * @param request The update request
     * @return List of tradeLicenses
     */
    public List<TradeLicense> getLicensesWithOwnerInfo(TradeLicenseRequest request){
        TradeLicenseSearchCriteria criteria = new TradeLicenseSearchCriteria();
        List<String> ids = new LinkedList<>();
        request.getLicenses().forEach(license -> {ids.add(license.getId());});

        criteria.setTenantId(request.getLicenses().get(0).getTenantId());
        criteria.setIds(ids);
        criteria.setBusinessService(request.getLicenses().get(0).getBusinessService());

        List<TradeLicense> licenses = repository.getLicenses(criteria);

        if(licenses.isEmpty())
            return Collections.emptyList();
        licenses = enrichmentService.enrichTradeLicenseSearch(licenses,criteria,request.getRequestInfo());
        return licenses;
    }


    /**
     * Updates the tradeLicenses
     * @param tradeLicenseRequest The update Request
     * @return Updated TradeLcienses
     */
    public List<TradeLicense> update(TradeLicenseRequest tradeLicenseRequest, String businessServicefromPath){
        TradeLicense licence = tradeLicenseRequest.getLicenses().get(0);
        TradeLicense.ApplicationTypeEnum applicationType = licence.getApplicationType();
        List<TradeLicense> licenceResponse = null;
        if(applicationType != null && (applicationType).toString().equals(TLConstants.APPLICATION_TYPE_RENEWAL ) &&
                licence.getAction().equalsIgnoreCase(TLConstants.TL_ACTION_INITIATE) && (licence.getStatus().equals(TLConstants.STATUS_APPROVED) || licence.getStatus().equals(TLConstants.STATUS_MANUALLYEXPIRED) || licence.getStatus().equals(TLConstants.STATUS_EXPIRED) )){
            List<TradeLicense> createResponse = create(tradeLicenseRequest, businessServicefromPath);
            licenceResponse =  createResponse;
        }
        else{
            if (businessServicefromPath == null)
                businessServicefromPath = businessService_TL;
            tlValidator.validateBusinessService(tradeLicenseRequest, businessServicefromPath);
            Object mdmsData = util.mDMSCall(tradeLicenseRequest.getRequestInfo(), tradeLicenseRequest.getLicenses().get(0).getTenantId());
            Object billingSlabs = util.getBillingSlabs(tradeLicenseRequest.getRequestInfo(), tradeLicenseRequest.getLicenses().get(0).getTenantId());
            String businessServiceName = null;
            switch (businessServicefromPath) {
                case businessService_TL:
                    businessServiceName = config.getTlBusinessServiceValue();
                    break;

                case businessService_BPA:
                    String tradeType = tradeLicenseRequest.getLicenses().get(0).getTradeLicenseDetail().getTradeUnits().get(0).getTradeType();
                    if (pickWFServiceNameFromTradeTypeOnly)
                        tradeType = tradeType.split("\\.")[0];
                    businessServiceName = tradeType;
                    break;
            }
            BusinessService businessService = workflowService.getBusinessService(tradeLicenseRequest.getLicenses().get(0).getTenantId(), tradeLicenseRequest.getRequestInfo(), businessServiceName);
            List<TradeLicense> searchResult = getLicensesWithOwnerInfo(tradeLicenseRequest);
            
            validateLatestApplicationCancellation(tradeLicenseRequest, businessService);

            enrichmentService.enrichTLUpdateRequest(tradeLicenseRequest, businessService);
            tlValidator.validateUpdate(tradeLicenseRequest, searchResult, mdmsData, billingSlabs);
            switch(businessServicefromPath)
            {
                case businessService_BPA:
                    validateMobileNumberUniqueness(tradeLicenseRequest);
                    break;
            }
            Map<String, Difference> diffMap = diffService.getDifference(tradeLicenseRequest, searchResult);
            Map<String, Boolean> idToIsStateUpdatableMap = util.getIdToIsStateUpdatableMap(businessService, searchResult);

            /*
             * call workflow service if it's enable else uses internal workflow process
             */
            List<String> endStates = Collections.nCopies(tradeLicenseRequest.getLicenses().size(),STATUS_APPROVED);
            switch (businessServicefromPath) {
                case businessService_TL:
                    if (config.getIsExternalWorkFlowEnabled()) {
                        wfIntegrator.callWorkFlow(tradeLicenseRequest);
                    } else {
                        TLWorkflowService.updateStatus(tradeLicenseRequest);
                    }
                    break;

                case businessService_BPA:
                    endStates = tradeUtil.getBPAEndState(tradeLicenseRequest);
                    wfIntegrator.callWorkFlow(tradeLicenseRequest);
                    break;
            }
            enrichmentService.postStatusEnrichment(tradeLicenseRequest,endStates,mdmsData);
            userService.createUser(tradeLicenseRequest, false);
            calculationService.addCalculation(tradeLicenseRequest);
            repository.update(tradeLicenseRequest, idToIsStateUpdatableMap);
            licenceResponse=  tradeLicenseRequest.getLicenses();
        }
        return licenceResponse;
        
    }

    private void validateLatestApplicationCancellation(TradeLicenseRequest tradeLicenseRequest, BusinessService businessService) {
    	List <TradeLicense> licenses = tradeLicenseRequest.getLicenses();
        TradeLicenseSearchCriteria criteria = new TradeLicenseSearchCriteria();
    	
    	List <String> licenseNumbers = new ArrayList<String>();
    	
    	for (TradeLicense license : licenses) {
    		licenseNumbers.add(license.getLicenseNumber());
    		
    	}
    	
    	criteria.setTenantId(licenses.get(0).getTenantId());
    	criteria.setLicenseNumbers(licenseNumbers);
    	
    	List<TradeLicense> searchResultForCancellation = getLicensesWithOwnerInfo(criteria,tradeLicenseRequest.getRequestInfo());
        
        actionValidator.validateUpdateRequest(tradeLicenseRequest, businessService,searchResultForCancellation);
		
	}





	public List<TradeLicense> plainSearch(TradeLicenseSearchCriteria criteria, RequestInfo requestInfo){
        List<TradeLicense> licenses;
        List<String> ids = repository.fetchTradeLicenseIds(criteria);
        if(ids.isEmpty())
            return Collections.emptyList();

        criteria.setIds(ids);

        TradeLicenseSearchCriteria idsCriteria = TradeLicenseSearchCriteria.builder().ids(ids).build();

        licenses = repository.getPlainLicenseSearch(idsCriteria);

        if(!CollectionUtils.isEmpty(licenses))
            licenses = enrichmentService.enrichTradeLicenseSearch(licenses,criteria,requestInfo);

        log.info("Total Records Returned: "+licenses.size());

        return licenses;
    }


    /**
     *
     * @param serviceName
     */
    public void runJob(String serviceName, String jobname, RequestInfo requestInfo){

        if(serviceName == null)
            serviceName = TRADE_LICENSE_MODULE_CODE;

        tlBatchService.getLicensesAndPerformAction(serviceName, jobname, requestInfo);


    }
    
    public boolean enrichWithUserDetails(TradeLicenseSearchCriteria criteria, RequestInfo requestInfo) {
    	List<TradeLicense> licenses = new LinkedList<>();
        UserDetailResponse userDetailResponse = userService.getUser(criteria,requestInfo);

        if(userDetailResponse.getUser().size()==0){
            return true;
        }
        enrichmentService.enrichTLCriteriaWithOwnerids(criteria,userDetailResponse);
        
        if(criteria.getOnlyMobileNumber()!=null && criteria.getOnlyMobileNumber() ) {
        	criteria.setTenantId(null);
        }
        
        licenses = repository.getLicenses(criteria);

        if(licenses.size()==0){
        	return true;
        }

        Boolean isRenewalPending = (criteria.getRenewalPending()!=null && criteria.getRenewalPending()==true);
        
        criteria=enrichmentService.getTradeLicenseCriteriaFromIds(licenses);
        
        if(isRenewalPending) {
        	criteria.setRenewalPending(true);
        }
        
        return false;
    }





	public int getApplicationValidity() {
		return Integer.valueOf(config.getApplicationValidity());
	}

}
