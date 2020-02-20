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
import org.springframework.stereotype.Service;

import static org.egov.tl.util.TLConstants.*;

import lombok.extern.slf4j.Slf4j;

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
       Object mdmsData = util.mDMSCall(tradeLicenseRequest);
       actionValidator.validateCreateRequest(tradeLicenseRequest);
       enrichmentService.enrichTLCreateRequest(tradeLicenseRequest, mdmsData);
       tlValidator.validateCreate(tradeLicenseRequest, mdmsData);
       switch(businessServicefromPath)
       {
           case businessService_BPA:
               validateMobileNumberUniqueness(tradeLicenseRequest);
               break;
       }
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
    public List<TradeLicense> search(TradeLicenseSearchCriteria criteria, RequestInfo requestInfo, String serviceFromPath){
        List<TradeLicense> licenses;
        tlValidator.validateSearch(requestInfo,criteria,serviceFromPath);
        criteria.setBusinessService(serviceFromPath);
        enrichmentService.enrichSearchCriteriaWithAccountId(requestInfo,criteria);
         if(criteria.getMobileNumber()!=null){
             licenses = getLicensesFromMobileNumber(criteria,requestInfo);
         }
         else {
             licenses = getLicensesWithOwnerInfo(criteria,requestInfo);
         }
       return licenses;
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
        UserDetailResponse userDetailResponse = userService.getUser(criteria,requestInfo);
        // If user not found with given user fields return empty list
        if(userDetailResponse.getUser().size()==0){
            return Collections.emptyList();
        }
        enrichmentService.enrichTLCriteriaWithOwnerids(criteria,userDetailResponse);
        licenses = repository.getLicenses(criteria);

        if(licenses.size()==0){
            return Collections.emptyList();
        }

        // Add tradeLicenseId of all licenses owned by the user
        criteria=enrichmentService.getTradeLicenseCriteriaFromIds(licenses);
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
        if(applicationType != null && (applicationType).toString().equals(TLConstants.APPLICATION_TYPE_RENEWAL )&& licence.getAction().equalsIgnoreCase(TLConstants.TL_ACTION_INITIATE)){
            List<TradeLicense> createResponse = create(tradeLicenseRequest, businessServicefromPath);
            licenceResponse =  createResponse;
        }
        else{
            if (businessServicefromPath == null)
                businessServicefromPath = businessService_TL;
            tlValidator.validateBusinessService(tradeLicenseRequest, businessServicefromPath);
            Object mdmsData = util.mDMSCall(tradeLicenseRequest);
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
            actionValidator.validateUpdateRequest(tradeLicenseRequest, businessService);
            enrichmentService.enrichTLUpdateRequest(tradeLicenseRequest, businessService);
            tlValidator.validateUpdate(tradeLicenseRequest, searchResult, mdmsData);
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
            switch (businessServicefromPath) {
                case businessService_TL:
                    editNotificationService.sendEditNotification(tradeLicenseRequest, diffMap);
                    break;
            }
            repository.update(tradeLicenseRequest, idToIsStateUpdatableMap);
            licenceResponse=  tradeLicenseRequest.getLicenses();
        }
        return licenceResponse;
        
    }


    /**
     *
     * @param serviceName
     */
    public void runJob(String serviceName, String jobname){

        if(serviceName == null)
            serviceName = TRADE_LICENSE_MODULE_CODE;

        Long validTill = System.currentTimeMillis() + config.getReminderPeriod();


        RequestInfo requestInfo = new RequestInfo();

        tlBatchService.getLicensesAndPerformAction(serviceName, jobname, validTill, requestInfo);


    }

}
