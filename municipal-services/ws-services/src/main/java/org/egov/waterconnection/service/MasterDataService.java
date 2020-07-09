package org.egov.waterconnection.service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.tracer.model.CustomException;
import org.egov.waterconnection.constants.WCConstants;
import org.egov.waterconnection.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.jayway.jsonpath.JsonPath;

@Service
public class MasterDataService {
	
	@Autowired
	private ServiceRequestRepository repository;
	
	@Value("${egov.mdms.host}")
	private String mdmsHost;

	@Value("${egov.mdms.search.endpoint}")
	private String mdmsEndpoint;

	/**
	 * 
	 * @param requestInfo RequestInfo Object
	 * @param tenantId Tenant Id
	 * @return MdmsCriteria
	 */
	private MdmsCriteriaReq getBillingFrequency(RequestInfo requestInfo, String tenantId) {

		MasterDetail mstrDetail = MasterDetail.builder().name(WCConstants.BILLING_PERIOD)
				.filter("[?(@.active== " + true + " && @.connectionType== '" + WCConstants.METERED_CONNECTION + "')]")
				.build();
		ModuleDetail moduleDetail = ModuleDetail.builder().moduleName(WCConstants.MDMS_WC_MOD_NAME)
				.masterDetails(Arrays.asList(mstrDetail)).build();
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Arrays.asList(moduleDetail)).tenantId(tenantId)
				.build();
		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	}
	
	/**
	 * 
	 * @param requestInfo RequestInfo Object
	 * @param tenantId Tenant Id
	 * @return Master For Billing Period
	 */
	public Map<String, Object> loadBillingFrequencyMasterData(RequestInfo requestInfo, String tenantId) {
		MdmsCriteriaReq mdmsCriteriaReq = getBillingFrequency(requestInfo, tenantId);
		StringBuilder uri = new StringBuilder(mdmsHost).append(mdmsEndpoint);
		Object res = repository.fetchResult(uri, mdmsCriteriaReq);
		if (res == null) {
			throw new CustomException("MDMS_ERROR_FOR_BILLING_FREQUENCY", "ERROR IN FETCHING THE BILLING FREQUENCY");
		}
		List<Map<String, Object>> jsonOutput = JsonPath.read(res, WCConstants.JSONPATH_ROOT_FOR_BILLING);
		return jsonOutput.get(0);
	}
	
	public String getBillingCycle(RequestInfo requestInfo, String tenantId) {
		Map<String, Object> billingMap = loadBillingFrequencyMasterData(requestInfo, tenantId);
		return (String) billingMap.get(WCConstants.BILLING_CYCLE_STRING);
	}
	
}
