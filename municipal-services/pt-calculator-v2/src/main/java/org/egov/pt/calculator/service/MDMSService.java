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
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

import static org.egov.pt.calculator.util.CalculatorConstants.INVALID_TENANT_ID_MDMS_KEY;
import static org.egov.pt.calculator.util.CalculatorConstants.INVALID_TENANT_ID_MDMS_MSG;
import static org.egov.pt.calculator.util.CalculatorConstants.MDMS_MASTER_MUTATIONFEE;
import static org.egov.pt.calculator.util.CalculatorConstants.MDMS_MASTER_SWACHHATA_TAX;
import static org.egov.pt.calculator.util.CalculatorConstants.PROPERTY_TAX_MODULE;


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
	private MdmsCriteriaReq getMDMSRequest(RequestInfo requestInfo,String masterName,String moduleName, String tenantId) {

		List<MasterDetail> ptMasterDetails = new ArrayList<>();
		MasterDetail masterDetailAppType = new MasterDetail();
		masterDetailAppType.setName(masterName);
		ptMasterDetails.add(masterDetailAppType);

		ModuleDetail ptModuleDtls = new ModuleDetail();
		ptModuleDtls.setMasterDetails(ptMasterDetails);
		ptModuleDtls.setModuleName(moduleName);

		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Arrays.asList(ptModuleDtls)).tenantId(tenantId)
				.build();

		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	}

	public Object mDMSCall(RequestInfo requestInfo, String tenantId) {
		MdmsCriteriaReq mdmsCriteriaReq = getMDMSRequest(requestInfo,MDMS_MASTER_MUTATIONFEE,PROPERTY_TAX_MODULE ,tenantId);
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
	
	
	public Integer getSwachataTaxRate(String tenantId) {
		Integer taxRate = 0;
		StringBuilder mdmsUrl = new StringBuilder(getMdmsSearchUrl());
		MdmsCriteriaReq mdmsCriteriaReq = getMDMSRequest(new RequestInfo(),MDMS_MASTER_SWACHHATA_TAX , PROPERTY_TAX_MODULE, tenantId);

		try {
			Object result = serviceRequestRepository.fetchResult(mdmsUrl, mdmsCriteriaReq);
			Map<String, List<Object>> taxRateConfig = getAttributeValues(result);
			List<Object> swachhataTaxRate = taxRateConfig.get("SwachhataTax");
			if (swachhataTaxRate == null || swachhataTaxRate.isEmpty()) {
				return taxRate;
			} else {
				Map<String, Object> swachhataTaxMap = (Map<String, Object>) swachhataTaxRate.get(0);
				taxRate = (Integer) swachhataTaxMap.get("rate");
			}
			return taxRate;
		} catch (Exception e) {
			throw new CustomException(INVALID_TENANT_ID_MDMS_KEY, INVALID_TENANT_ID_MDMS_MSG);
		}
	}

}
