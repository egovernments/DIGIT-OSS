package org.egov.hrms.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.contract.request.RequestInfo;
import org.egov.hrms.utils.HRMSConstants;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.MdmsResponse;
import org.egov.mdms.model.ModuleDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MDMSService {

	@Autowired
	private RestTemplate restTemplate;
	
	@Value("${egov.mdms.host}")
	private String mdmsHost;

	@Value("${egov.mdms.search.endpoint}")
	private String mdmsEndpoint;
	
	
	/**
	 * Builds cache for MDMS data, this gets refreshed for every call.
	 * 
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	public Map<String, List<String>> getMDMSData(RequestInfo requestInfo, String tenantId){
		MdmsResponse response = fetchMDMSData(requestInfo, tenantId);
		MdmsResponse responseLoc = fetchMDMSDataLoc(requestInfo, tenantId);
		Map<String, List<String>> masterData = new HashMap<>();
		Map<String, List<String>> eachMasterMap = new HashMap<>();
		if(null != response) {
			if(!CollectionUtils.isEmpty(response.getMdmsRes().keySet())) {
				if(null != response.getMdmsRes().get(HRMSConstants.HRMS_MDMS_COMMON_MASTERS_CODE)){
					eachMasterMap = (Map) response.getMdmsRes().get(HRMSConstants.HRMS_MDMS_COMMON_MASTERS_CODE);
					masterData.put(HRMSConstants.HRMS_MDMS_DEPT_CODE, eachMasterMap.get(HRMSConstants.HRMS_MDMS_DEPT_CODE));
					masterData.put(HRMSConstants.HRMS_MDMS_DESG_CODE, eachMasterMap.get(HRMSConstants.HRMS_MDMS_DESG_CODE));
				}
				if(null != response.getMdmsRes().get(HRMSConstants.HRMS_MDMS_HR_MASTERS_CODE)) {
					eachMasterMap = (Map) response.getMdmsRes().get(HRMSConstants.HRMS_MDMS_HR_MASTERS_CODE);
					masterData.put(HRMSConstants.HRMS_MDMS_EMP_STATUS_CODE, eachMasterMap.get(HRMSConstants.HRMS_MDMS_EMP_STATUS_CODE));
					masterData.put(HRMSConstants.HRMS_MDMS_EMP_TYPE_CODE, eachMasterMap.get(HRMSConstants.HRMS_MDMS_EMP_TYPE_CODE));
					masterData.put(HRMSConstants.HRMS_MDMS_QUALIFICATION_CODE, eachMasterMap.get(HRMSConstants.HRMS_MDMS_QUALIFICATION_CODE));
					masterData.put(HRMSConstants.HRMS_MDMS_STREAMS_CODE, eachMasterMap.get(HRMSConstants.HRMS_MDMS_STREAMS_CODE));
					masterData.put(HRMSConstants.HRMS_MDMS_DEPT_TEST_CODE, eachMasterMap.get(HRMSConstants.HRMS_MDMS_DEPT_TEST_CODE));
					masterData.put(HRMSConstants.HRMS_MDMS_DEACT_REASON_CODE, eachMasterMap.get(HRMSConstants.HRMS_MDMS_DEACT_REASON_CODE));
				}
				if(null != response.getMdmsRes().get(HRMSConstants.HRMS_AC_ROLES_MASTERS_CODE)) {
					eachMasterMap = (Map) response.getMdmsRes().get(HRMSConstants.HRMS_AC_ROLES_MASTERS_CODE);
					masterData.put(HRMSConstants.HRMS_MDMS_ROLES_CODE, eachMasterMap.get(HRMSConstants.HRMS_MDMS_ROLES_CODE));
				}
			}
		}
		if(null != responseLoc){
			if(!CollectionUtils.isEmpty(responseLoc.getMdmsRes().keySet())) {
				if(null != responseLoc.getMdmsRes().get(HRMSConstants.HRMS_MDMS_EGOV_LOCATION_MASTERS_CODE)) {
					eachMasterMap = (Map) responseLoc.getMdmsRes().get(HRMSConstants.HRMS_MDMS_EGOV_LOCATION_MASTERS_CODE);
					masterData.put(HRMSConstants.HRMS_MDMS_TENANT_BOUNDARY_CODE,eachMasterMap.get(HRMSConstants.HRMS_MDMS_TENANT_BOUNDARY_CODE));
				}

			}
		}
		return masterData;
		
	}



	/**
	 * Makes call to the MDMS service to fetch the MDMS data.
	 *
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	public MdmsResponse fetchMDMSData(RequestInfo requestInfo, String tenantId) {
		StringBuilder uri = new StringBuilder();
		MdmsCriteriaReq request = prepareMDMSRequest(uri, requestInfo, tenantId);
		MdmsResponse response = null;
		try {
			response = restTemplate.postForObject(uri.toString(), request, MdmsResponse.class);
		}catch(Exception e) {
			log.info("Exception while fetching from MDMS: ",e);
			log.info("Request: "+ request);
		}
		return response;
	}

	/**
	 * Makes call to the MDMS service to fetch the MDMS Boundary data.
	 *
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	public MdmsResponse fetchMDMSDataLoc(RequestInfo requestInfo, String tenantId) {
		StringBuilder uri = new StringBuilder();
		MdmsCriteriaReq request = prepareMDMSRequestLoc(uri, requestInfo, tenantId);
		MdmsResponse response = null;
		try {
			response = restTemplate.postForObject(uri.toString(), request, MdmsResponse.class);
		}catch(Exception e) {
			log.info("Exception while fetching from MDMS: ",e);
			log.info("Request: "+ request);
		}
		return response;
	}

	/**
	 * Prepares request for MDMS in order to fetch all the required masters for HRMS.
	 * 
	 * @param uri
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	public MdmsCriteriaReq prepareMDMSRequest(StringBuilder uri, RequestInfo requestInfo, String tenantId) {
		Map<String, List<String>> mapOfModulesAndMasters = new HashMap<>();
		String[] hrMasters = {HRMSConstants.HRMS_MDMS_EMP_STATUS_CODE, HRMSConstants.HRMS_MDMS_EMP_TYPE_CODE, HRMSConstants.HRMS_MDMS_QUALIFICATION_CODE,
				HRMSConstants.HRMS_MDMS_SERVICE_STATUS_CODE, HRMSConstants.HRMS_MDMS_STREAMS_CODE, HRMSConstants.HRMS_MDMS_DEACT_REASON_CODE, HRMSConstants.HRMS_MDMS_DEPT_TEST_CODE};
		String[] commonMasters = {HRMSConstants.HRMS_MDMS_DEPT_CODE, HRMSConstants.HRMS_MDMS_DESG_CODE, HRMSConstants.HRMS_MDMS_YEAR_CODE};
		String[] accessControlRoles = {HRMSConstants.HRMS_MDMS_ROLES_CODE};
		mapOfModulesAndMasters.put(HRMSConstants.HRMS_MDMS_COMMON_MASTERS_CODE, Arrays.asList(commonMasters));
		mapOfModulesAndMasters.put(HRMSConstants.HRMS_MDMS_HR_MASTERS_CODE, Arrays.asList(hrMasters));
		mapOfModulesAndMasters.put(HRMSConstants.HRMS_AC_ROLES_MASTERS_CODE, Arrays.asList(accessControlRoles));
		List<ModuleDetail> moduleDetails = new ArrayList<>();
		for(String module: mapOfModulesAndMasters.keySet()) {
			ModuleDetail moduleDetail = new ModuleDetail();
			moduleDetail.setModuleName(module);
			List<MasterDetail> masterDetails = new ArrayList<>();
			for(String master: mapOfModulesAndMasters.get(module)) {
				MasterDetail masterDetail=null;
				if(module.equals(HRMSConstants.HRMS_AC_ROLES_MASTERS_CODE))
					masterDetail = MasterDetail.builder().name(master).filter(HRMSConstants.HRMS_MDMS_AC_ROLES_FILTER).build();
				else
					masterDetail = MasterDetail.builder().name(master).filter("[?(@.active == true)].code").build();
				masterDetails.add(masterDetail);
			}
			moduleDetail.setMasterDetails(masterDetails);
			moduleDetails.add(moduleDetail);
		}
		uri.append(mdmsHost).append(mdmsEndpoint);
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().tenantId(tenantId).moduleDetails(moduleDetails).build();
		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	
	}


	/**
	 * Prepares request for MDMS in order to fetch all the required masters for Boundary Data.
	 *
	 * @param uri
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	public MdmsCriteriaReq prepareMDMSRequestLoc(StringBuilder uri, RequestInfo requestInfo, String tenantId) {
		Map<String, List<String>> mapOfModulesAndMasters = new HashMap<>();
		String[] egovLoccation = {HRMSConstants.HRMS_MDMS_TENANT_BOUNDARY_CODE};
		mapOfModulesAndMasters.put(HRMSConstants.HRMS_MDMS_EGOV_LOCATION_MASTERS_CODE, Arrays.asList(egovLoccation));
		List<ModuleDetail> moduleDetails = new ArrayList<>();
		for(String module: mapOfModulesAndMasters.keySet()) {
			ModuleDetail moduleDetail = new ModuleDetail();
			moduleDetail.setModuleName(module);
			List<MasterDetail> masterDetails = new ArrayList<>();
			for(String master: mapOfModulesAndMasters.get(module)) {
				MasterDetail masterDetail=null;
				masterDetail = MasterDetail.builder().name(master).build();
				masterDetails.add(masterDetail);
			}
			moduleDetail.setMasterDetails(masterDetails);
			moduleDetails.add(moduleDetail);
		}
		uri.append(mdmsHost).append(mdmsEndpoint);
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().tenantId(tenantId).moduleDetails(moduleDetails).build();
		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();

	}

}
