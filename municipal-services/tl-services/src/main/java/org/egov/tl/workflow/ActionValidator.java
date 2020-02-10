package org.egov.tl.workflow;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.tl.util.TLConstants;
import org.egov.tl.web.models.TradeLicense;
import org.egov.tl.web.models.TradeLicenseRequest;
import org.egov.tl.web.models.workflow.BusinessService;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.*;

import static org.egov.tl.util.TLConstants.*;


@Component
public class ActionValidator {


    private WorkflowConfig workflowConfig;

    private WorkflowService workflowService;

    @Autowired
    public ActionValidator(WorkflowConfig workflowConfig, WorkflowService workflowService) {
        this.workflowConfig = workflowConfig;
        this.workflowService = workflowService;
    }




    /**
     * Validates create request
     * @param request The tradeLicense Create request
     */
	public void validateCreateRequest(TradeLicenseRequest request){
        Map<String, String> errorMap = new HashMap<>();
        Set<String> applicationTypes = new HashSet<>();
        request.getLicenses().forEach(license -> {
        
            applicationTypes.add(license.getApplicationType().toString());
            String businessService = license.getBusinessService();
            if (businessService == null)
                businessService = businessService_TL;
                
            switch(businessService)
            {
                case businessService_TL:
                //TLR Changes
//                    if (ACTION_INITIATE.equalsIgnoreCase(license.getAction())) {
//                        if (license.getTradeLicenseDetail().getApplicationDocuments() != null)
//                            errorMap.put("INVALID ACTION", "Action should be APPLY when application document are provided");
//                    }
                    
                    if (ACTION_APPLY.equalsIgnoreCase(license.getAction())) {
                        if (license.getTradeLicenseDetail().getApplicationDocuments() == null)
                            errorMap.put("INVALID ACTION", "Action cannot be changed to APPLY. Application document are not provided");
                    }
                    if (!ACTION_APPLY.equalsIgnoreCase(license.getAction()) &&
                            !ACTION_INITIATE.equalsIgnoreCase(license.getAction())) {
                        errorMap.put("INVALID ACTION", "Action can only be APPLY or INITIATE during create");
                    }
                    break;

                case businessService_BPA:
                    if (!TRIGGER_NOWORKFLOW.equalsIgnoreCase(license.getAction())) {
                        errorMap.put("INVALID ACTION", "Action should be NOWORKFLOW during create");
                    }
                    break;
            }
        });
        //    validateRole(request);

        // Check if all the applicationTypes of bulk request is same.
        if(request.getLicenses().size() > 1){
            if(applicationTypes.size() != 1){
                errorMap.put("INVALID APPLICATION TYPES", "Application Types should be identical for bulk requests");
            }
        }

        if (!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }


    /**
     * Validates the update request
     * @param request The tradeLciense update request
     */
    public void validateUpdateRequest(TradeLicenseRequest request,BusinessService businessService){
        validateDocumentsForUpdate(request);
       // validateRole(request);
       // validateAction(request);
        validateIds(request,businessService);
    }


    /**
     * Validates the applicationDocument
     * @param request The tradeLciense create or update request
     */
    private void validateDocumentsForUpdate(TradeLicenseRequest request){
        Map<String,String> errorMap = new HashMap<>();
        request.getLicenses().forEach(license -> {
            if(ACTION_INITIATE.equalsIgnoreCase(license.getAction())){
                if(license.getTradeLicenseDetail().getApplicationDocuments()!=null)
                    errorMap.put("INVALID STATUS","Status cannot be INITIATE when application document are provided");
            }
            if(ACTION_APPLY.equalsIgnoreCase(license.getAction())){
                if(license.getTradeLicenseDetail().getApplicationDocuments()==null)
                    errorMap.put("INVALID STATUS","Status cannot be APPLY when application document are not provided");
            }
        });

        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }


    /**
     * Validates if the role of the logged in user can perform the given action
     * @param request The tradeLciense create or update request
     */
    private void validateRole(TradeLicenseRequest request){
       Map<String,List<String>> roleActionMap = workflowConfig.getRoleActionMap();
       Map<String,String> errorMap = new HashMap<>();
       List<TradeLicense> licenses = request.getLicenses();
       RequestInfo requestInfo = request.getRequestInfo();
       List<Role> roles = requestInfo.getUserInfo().getRoles();

       List<String> actions = new LinkedList<>();
       roles.forEach(role -> {
           if(!CollectionUtils.isEmpty(roleActionMap.get(role.getCode())))
           {
               actions.addAll(roleActionMap.get(role.getCode()));}
       });

       licenses.forEach(license -> {
          if(!actions.contains(license.getAction().toString()))
              errorMap.put("UNAUTHORIZED UPDATE","The action cannot be performed by this user");
       });
       if(!errorMap.isEmpty())
           throw new CustomException(errorMap);
    }


    /**
     * Validate if the action can be performed on the current status
     * @param request The tradeLciense update request
     */
    private void validateAction(TradeLicenseRequest request){
       Map<String,List<String>> actionStatusMap = workflowConfig.getActionCurrentStatusMap();
        Map<String,String> errorMap = new HashMap<>();

        request.getLicenses().forEach(license -> {
           if(actionStatusMap.get(license.getStatus().toString())!=null){
               if(!actionStatusMap.get(license.getStatus().toString()).contains(license.getAction().toString()))
                   errorMap.put("UNAUTHORIZED ACTION","The action "+license.getAction() +" cannot be applied on the status "+license.getStatus());
               }
       });
        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }


    /**
     * Validates if the any new object is added in the request
     * @param request The tradeLciense update request
     */
    private void validateIds(TradeLicenseRequest request,BusinessService businessService){
        Map<String,String> errorMap = new HashMap<>();
        request.getLicenses().forEach(license -> {

            String namefBusinessService=license.getBusinessService();
            if((namefBusinessService==null) || (namefBusinessService.equals(businessService_TL))||(namefBusinessService.equals(businessService_BPA) && (!license.getStatus().equalsIgnoreCase(STATUS_INITIATED))))
            {
                if(!workflowService.isStateUpdatable(license.getStatus(), businessService)) {
                    if (license.getId() == null)
                        errorMap.put("INVALID UPDATE", "Id of tradeLicense cannot be null");
                    if(license.getTradeLicenseDetail().getId()==null)
                        errorMap.put("INVALID UPDATE", "Id of tradeLicenseDetail cannot be null");
                    if(license.getTradeLicenseDetail().getAddress()==null)
                        errorMap.put("INVALID UPDATE", "Id of address cannot be null");
                    license.getTradeLicenseDetail().getOwners().forEach(owner -> {
                        if(owner.getUuid()==null)
                            errorMap.put("INVALID UPDATE", "Id of owner cannot be null");
                        if(!CollectionUtils.isEmpty(owner.getDocuments())){
                            owner.getDocuments().forEach(document -> {
                                if(document.getId()==null)
                                    errorMap.put("INVALID UPDATE", "Id of owner document cannot be null");
                            });
                          }
                        });
                    license.getTradeLicenseDetail().getTradeUnits().forEach(tradeUnit -> {
                        if(tradeUnit.getId()==null)
                            errorMap.put("INVALID UPDATE", "Id of tradeUnit cannot be null");
                    });
                    if(!CollectionUtils.isEmpty(license.getTradeLicenseDetail().getAccessories())){
                        license.getTradeLicenseDetail().getAccessories().forEach(accessory -> {
                            if(accessory.getId()==null)
                                errorMap.put("INVALID UPDATE", "Id of accessory cannot be null");
                        });
                    }
                    if(!CollectionUtils.isEmpty(license.getTradeLicenseDetail().getApplicationDocuments())){
                        license.getTradeLicenseDetail().getApplicationDocuments().forEach(document -> {
                            if(document.getId()==null)
                                errorMap.put("INVALID UPDATE", "Id of applicationDocument cannot be null");
                        });
                    }
                }
            }
        });
        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }





}
