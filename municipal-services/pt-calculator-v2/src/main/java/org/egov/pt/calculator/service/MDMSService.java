package org.egov.pt.calculator.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.pt.calculator.config.PTCalculatorConfigs;
import org.egov.pt.calculator.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class MDMSService {

	private static final Logger LOG = Logger.getLogger(MDMSService.class);

	private PTCalculatorConfigs config;

	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	public MDMSService(PTCalculatorConfigs config, ServiceRequestRepository serviceRequestRepository) {
		this.config = config;
		this.serviceRequestRepository = serviceRequestRepository;
	}

	/**
	 * Creates MDMS request
	 * 
	 * @param requestInfo The RequestInfo of the calculationRequest
	 * @param tenantId    The tenantId of the tradeLicense
	 * @return MDMSCriteria Request
	 */
	private MdmsCriteriaReq getMDMSRequest(RequestInfo requestInfo, String tenantId) {

		List<MasterDetail> ptMasterDetails = new ArrayList<>();

		MasterDetail masterDetailAppType = new MasterDetail();
		masterDetailAppType.setName("MutationFee");
		ptMasterDetails.add(masterDetailAppType);

		ModuleDetail ptModuleDtls = new ModuleDetail();
		ptModuleDtls.setMasterDetails(ptMasterDetails);
		ptModuleDtls.setModuleName("PropertyTax");

		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Arrays.asList(ptModuleDtls)).tenantId(tenantId)
				.build();

		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	}

	public Object mDMSCall(RequestInfo requestInfo, String tenantId) {
		MdmsCriteriaReq mdmsCriteriaReq = getMDMSRequest(requestInfo, tenantId);
		StringBuilder url = getMdmsSearchUrl();
		Object result = serviceRequestRepository.fetchResult(url, mdmsCriteriaReq);
		return result;
	}

	/**
	 * Creates and returns the url for mdms search endpoint
	 *
	 * @return MDMS Search URL
	 */
	private StringBuilder getMdmsSearchUrl() {
		return new StringBuilder().append(config.getMdmsHost()).append(config.getMdmsSearchEndpoint());
	}

	public Map<String, List<Object>> getAttributeValues(Object mdmsData) {

		List<String> modulepaths = Arrays.asList("$.MdmsRes.PropertyTax");
		final Map<String, List<Object>> mdmsResMap = new HashMap<>();
		modulepaths.forEach(modulepath -> {
			try {
				mdmsResMap.putAll(JsonPath.read(mdmsData, modulepath));
			} catch (Exception e) {
				LOG.error("Error while fetching MDMS data", e);
			}
		});
		return mdmsResMap;
	}
		
}
