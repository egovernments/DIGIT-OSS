package org.egov.tl.service;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.repository.TLRepository;
import org.egov.tl.service.notification.EditNotificationService;
import org.egov.tl.util.TradeUtil;
import org.egov.tl.validator.TLValidator;
import org.egov.tl.web.models.Difference;
import org.egov.tl.web.models.TradeLicense;
import org.egov.tl.web.models.TradeLicenseRequest;
import org.egov.tl.web.models.TradeLicenseSearchCriteria;
import org.egov.tl.web.models.user.UserDetailResponse;
import org.egov.tl.web.models.workflow.BusinessService;
import org.egov.tl.workflow.ActionValidator;
import org.egov.tl.workflow.TLWorkflowService;
import org.egov.tl.workflow.WorkflowIntegrator;
import org.egov.tl.workflow.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
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

    @Autowired
    public TradeLicenseService(WorkflowIntegrator wfIntegrator, EnrichmentService enrichmentService,
                               UserService userService, TLRepository repository, ActionValidator actionValidator,
                               TLValidator tlValidator, TLWorkflowService TLWorkflowService,
                               CalculationService calculationService, TradeUtil util, DiffService diffService,
                               TLConfiguration config,EditNotificationService editNotificationService,WorkflowService workflowService) {
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
    }





    /**
     * creates the tradeLicense for the given request
     * @param tradeLicenseRequest The TradeLicense Create Request
     * @return The list of created traddeLicense
     */
    public List<TradeLicense> create(TradeLicenseRequest tradeLicenseRequest){
        Object mdmsData = util.mDMSCall(tradeLicenseRequest);
        actionValidator.validateCreateRequest(tradeLicenseRequest);
        enrichmentService.enrichTLCreateRequest(tradeLicenseRequest,mdmsData);
        tlValidator.validateCreate(tradeLicenseRequest,mdmsData);
        userService.createUser(tradeLicenseRequest);
        calculationService.addCalculation(tradeLicenseRequest);
		
        /*
		 * call workflow service if it's enable else uses internal workflow process
		 */
		if (config.getIsExternalWorkFlowEnabled())
			wfIntegrator.callWorkFlow(tradeLicenseRequest);
		repository.save(tradeLicenseRequest);
		return tradeLicenseRequest.getLicenses();
	}


    /**
     *  Searches the tradeLicense for the given criteria if search is on owner paramter then first user service
     *  is called followed by query to db
     * @param criteria The object containing the paramters on which to search
     * @param requestInfo The search request's requestInfo
     * @return List of tradeLicense for the given criteria
     */
    public List<TradeLicense> search(TradeLicenseSearchCriteria criteria, RequestInfo requestInfo){
        List<TradeLicense> licenses;
        tlValidator.validateSearch(requestInfo,criteria);
        enrichmentService.enrichSearchCriteriaWithAccountId(requestInfo,criteria);
         if(criteria.getMobileNumber()!=null){
             licenses = getLicensesFromMobileNumber(criteria,requestInfo);
         }
         else {
             licenses = getLicensesWithOwnerInfo(criteria,requestInfo);
         }
       return licenses;
    }


    private List<TradeLicense> getLicensesFromMobileNumber(TradeLicenseSearchCriteria criteria, RequestInfo requestInfo){
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
    public List<TradeLicense> update(TradeLicenseRequest tradeLicenseRequest){
        Object mdmsData = util.mDMSCall(tradeLicenseRequest);
        BusinessService businessService = workflowService.getBusinessService(tradeLicenseRequest.getLicenses().get(0).getTenantId(), tradeLicenseRequest.getRequestInfo());
        List<TradeLicense> searchResult = getLicensesWithOwnerInfo(tradeLicenseRequest);
        actionValidator.validateUpdateRequest(tradeLicenseRequest,businessService);
        enrichmentService.enrichTLUpdateRequest(tradeLicenseRequest,businessService);
        tlValidator.validateUpdate(tradeLicenseRequest,searchResult,mdmsData);
        Map<String,Difference> diffMap = diffService.getDifference(tradeLicenseRequest,searchResult);
        Map<String,Boolean> idToIsStateUpdatableMap = util.getIdToIsStateUpdatableMap(businessService,searchResult);

        /*
	 * call workflow service if it's enable else uses internal workflow process
	 */
		if (config.getIsExternalWorkFlowEnabled())
			wfIntegrator.callWorkFlow(tradeLicenseRequest);
		else
			TLWorkflowService.updateStatus(tradeLicenseRequest);

		enrichmentService.postStatusEnrichment(tradeLicenseRequest);
        userService.createUser(tradeLicenseRequest);
        calculationService.addCalculation(tradeLicenseRequest);
        editNotificationService.sendEditNotification(tradeLicenseRequest,diffMap);
        repository.update(tradeLicenseRequest,idToIsStateUpdatableMap);
        return tradeLicenseRequest.getLicenses();
    }


}
