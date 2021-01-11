package org.egov.swcalculation.validator;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

import org.egov.common.contract.request.RequestInfo;
import org.egov.swcalculation.service.MasterDataService;
import org.egov.swcalculation.util.CalculatorUtils;
import org.egov.swcalculation.web.models.Property;
import org.egov.swcalculation.web.models.SewerageConnection;
import org.egov.swcalculation.web.models.Status;
import org.egov.swcalculation.web.models.workflow.ProcessInstance;
import org.egov.tracer.model.CustomException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;

import static org.egov.swcalculation.constants.SWCalculationConstant.PROPERTY_JSONPATH_ROOT;
import static org.egov.swcalculation.constants.SWCalculationConstant.PROPERTY_MASTER_MODULE;

@Component
@Slf4j
public class SWCalculationWorkflowValidator {

    @Autowired
    private CalculatorUtils util;

    @Autowired
    private MasterDataService masterDataService;

    public Boolean nonMeterconnectionValidation(RequestInfo requestInfo, String tenantId, String connectionNo,Boolean genratedemand){
        Map<String,String> errorMap = new HashMap<>();
        applicationValidation(requestInfo,tenantId,connectionNo,errorMap);
        if(!CollectionUtils.isEmpty(errorMap))
            throw new CustomException(errorMap);
        return genratedemand;
    }

    public Map<String,String> applicationValidation(RequestInfo requestInfo,String tenantId,String connectionNo, Map<String,String> errorMap){
        List<SewerageConnection> sewerageConnectionList = util.getSewerageConnection(requestInfo,connectionNo,tenantId);
        SewerageConnection sewerageConnection = null;
        if(sewerageConnectionList != null){
            int size = sewerageConnectionList.size();
            sewerageConnection = sewerageConnectionList.get(size-1);
            String sewerageApplicationNumber = sewerageConnection.getApplicationNo();
            sewerageConnectionValidation(requestInfo,tenantId,sewerageApplicationNumber,errorMap);
            String propertyId = sewerageConnection.getPropertyId();
            Property property = util.getProperty(requestInfo,tenantId,propertyId);
            //String propertyApplicationNumber = property.getAcknowldgementNumber();
            propertyValidation(requestInfo,tenantId,property,errorMap);
        }
        else{
            errorMap.put("SEWERAGE_CONNECTION_ERROR",
                    "Sewerage connection object is null");
        }


        return  errorMap;
    }

    public void sewerageConnectionValidation(RequestInfo requestInfo,String tenantId, String sewerageApplicationNumber,Map<String,String> errorMap){
        Boolean isApplicationApproved = workflowValidation(requestInfo,tenantId,sewerageApplicationNumber);
        if(!isApplicationApproved)
            errorMap.put("SEWERAGE_APPLICATION_ERROR","Demand cannot be generated as sewerage connection application with application number "+sewerageApplicationNumber+" is in workflow and not approved yet");
    }

    public void propertyValidation(RequestInfo requestInfo,String tenantId, Property property,Map<String,String> errorMap){
        Boolean isApplicationApproved = workflowValidation(requestInfo,tenantId,property.getAcknowldgementNumber());
        JSONObject mdmsResponse=getWnsPTworkflowConfig(requestInfo,tenantId);
        if(mdmsResponse.getBoolean("inWorkflowStatusAllowed")&&!isApplicationApproved){
            if(property.getStatus().equals(Status.INWORKFLOW))
                isApplicationApproved=true;
        }

        if(!isApplicationApproved)
            errorMap.put("PROPERTY_APPLICATION_ERROR","Demand cannot be generated as property application with application number "+property.getAcknowldgementNumber()+" is not approved yet");
    }

    public Boolean workflowValidation(RequestInfo requestInfo,String tenantId, String businessIds){
    	List<ProcessInstance> processInstancesList = util.getWorkFlowProcessInstance(requestInfo,tenantId,businessIds);
        Boolean isApplicationApproved = false;

        for(ProcessInstance processInstances : processInstancesList){
            if(processInstances.getState().getIsTerminateState()){
                isApplicationApproved=true;
            }
        }

        return isApplicationApproved;
    }

    public JSONObject getWnsPTworkflowConfig(RequestInfo requestInfo, String tenantId){
        tenantId = tenantId.split("\\.")[0];
        List<String> propertyModuleMasters = new ArrayList<>(Arrays.asList("PTWorkflow"));
        Map<String, List<String>> codes = masterDataService.getAttributeValues(tenantId,PROPERTY_MASTER_MODULE, propertyModuleMasters, "$.*",
                PROPERTY_JSONPATH_ROOT,requestInfo);
        JSONObject obj = new JSONObject(codes);
        JSONArray configArray = obj.getJSONArray("PTWorkflow");
        JSONObject response = new JSONObject();
        for(int i=0;i<configArray.length();i++){
            if(configArray.getJSONObject(i).getBoolean("enable"))
                response=configArray.getJSONObject(i);
        }
        return response;
    }
}