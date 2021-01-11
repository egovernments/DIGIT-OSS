package org.egov.waterconnection.validator;

import java.util.*;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.waterconnection.constants.WCConstants;
import org.egov.waterconnection.util.WaterServicesUtil;
import org.egov.waterconnection.web.models.Property;
import org.egov.waterconnection.web.models.Status;
import org.egov.waterconnection.web.models.WaterConnectionRequest;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class ValidateProperty {

	@Autowired
	private WaterServicesUtil waterServiceUtil;

	@Autowired
	private MDMSValidator mdmsValidator;
	/**
	 * 
	 * @param property Property Objects
	 */
	public void validatePropertyFields(Property property, RequestInfo requestInfo) {
		if (StringUtils.isEmpty(property.getPropertyId())) {
			throw new CustomException("INVALID_PROPERTY", "WaterConnection cannot be updated without property Id");
		}

		JSONObject mdmsResponse=getWnsPTworkflowConfig(requestInfo,property.getTenantId());
		List<Status> allowedPropertyStatus = new ArrayList<>();
		allowedPropertyStatus.add(Status.ACTIVE);
		if (mdmsResponse.getBoolean("inWorkflowStatusAllowed"))
			allowedPropertyStatus.add(Status.INWORKFLOW);

		if (StringUtils.isEmpty(property.getStatus()) || !(allowedPropertyStatus.contains(property.getStatus()))) {
				throw new CustomException("INVALID_PROPERTY_STATUS", " Please enter a valid property ID");
			}
	}

	/**
	 * 
	 * @param waterConnectionRequest WaterConnectionRequest
	 */
	public Property getOrValidateProperty(WaterConnectionRequest waterConnectionRequest) {
		Optional<Property> propertyList = waterServiceUtil.propertySearch(waterConnectionRequest).stream().findFirst();
		if (!propertyList.isPresent()) {
			throw new CustomException("INVALID_PROPERTY",
					"Water connection cannot be enriched without PropertyId");
		}
		Property property = propertyList.get();
		if (StringUtils.isEmpty(property.getUsageCategory()) && !(waterConnectionRequest.getRequestInfo().getUserInfo().getType().equalsIgnoreCase("SYSTEM"))) {
			throw new CustomException("INVALID_PROPERTY_USAGE_TYPE",
					"Water connection cannot be enriched without property usage type");
		}
		return property;
	}

	public JSONObject getWnsPTworkflowConfig(RequestInfo requestInfo,String tenantId){
		tenantId = tenantId.split("\\.")[0];
		List<String> propertyModuleMasters = new ArrayList<>(Arrays.asList("PTWorkflow"));
		Map<String, List<String>> codes = mdmsValidator.getAttributeValues(tenantId,WCConstants.PROPERTY_MASTER_MODULE, propertyModuleMasters, "$.*",
				WCConstants.PROPERTY_JSONPATH_ROOT,requestInfo);
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
