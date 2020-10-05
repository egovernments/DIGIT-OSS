package org.egov.wscalculation.validator;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.wscalculation.constants.WSCalculationConstant;
import org.egov.wscalculation.util.CalculatorUtil;
import org.egov.wscalculation.web.models.Property;
import org.egov.wscalculation.web.models.WaterConnection;
import org.egov.wscalculation.web.models.workflow.ProcessInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Component
@Slf4j
public class WSCalculationWorkflowValidator {

	@Autowired
	private CalculatorUtil util;

	 public Boolean applicationValidation(RequestInfo requestInfo,String tenantId,String connectionNo, Boolean genratedemand){
	    Map<String,String> errorMap = new HashMap<>();
		 List<WaterConnection> waterConnectionList = util.getWaterConnection(requestInfo,connectionNo,tenantId);
		 WaterConnection waterConnection = null;
		 if(waterConnectionList != null){
			 int size = waterConnectionList.size();
			 waterConnection = waterConnectionList.get(size-1);

			 String waterApplicationNumber = waterConnection.getApplicationNo();
			 waterConnectionValidation(requestInfo, tenantId, waterApplicationNumber, errorMap);

			 String propertyId = waterConnection.getPropertyId();
			 Property property = util.getProperty(requestInfo,tenantId,propertyId);
			 String propertyApplicationNumber = property.getAcknowldgementNumber();
			 propertyValidation(requestInfo,tenantId,propertyApplicationNumber,errorMap);
		 }
		 else{
			 errorMap.put("WATER_CONNECTION_ERROR",
					 "Water connection object is null");
		 }

        if(!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);

        return genratedemand;
	}

	public void waterConnectionValidation(RequestInfo requestInfo, String tenantId, String waterApplicationNumber,
			Map<String, String> errorMap) {
		Boolean isApplicationApproved = workflowValidation(requestInfo, tenantId, waterApplicationNumber);
		if (!isApplicationApproved)
			errorMap.put("WATER_APPLICATION_ERROR",
					"Demand cannot be generated as water connection application with application number "
							+ waterApplicationNumber + " is in workflow and not approved yet");
	}

	public void propertyValidation(RequestInfo requestInfo, String tenantId, String propertyApplicationNumber,
			Map<String, String> errorMap) {
		Boolean isApplicationApproved = workflowValidation(requestInfo, tenantId, propertyApplicationNumber);
		if (!isApplicationApproved)
			errorMap.put("PROPERTY_APPLICATION_ERROR",
					"Demand cannot be generated as property application with application number "
							+ propertyApplicationNumber + " is in workflow and not approved yet");
	}

	public Boolean workflowValidation(RequestInfo requestInfo, String tenantId, String businessIds) {
		List<ProcessInstance> processInstancesList = util.getWorkFlowProcessInstance(requestInfo,tenantId,businessIds);
		Boolean isApplicationApproved = false;

		for (ProcessInstance processInstances : processInstancesList) {
			if (processInstances.getState().getIsTerminateState()) {
				isApplicationApproved = true;
			}
		}

		return isApplicationApproved;
	}
}