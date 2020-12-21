package org.egov.noc.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.noc.config.NOCConfiguration;
import org.egov.noc.repository.ServiceRequestRepository;
import org.egov.noc.web.model.AuditDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class NOCUtil {

	private NOCConfiguration config;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	public NOCUtil(NOCConfiguration config, ServiceRequestRepository serviceRequestRepository) {
		this.config = config;
		this.serviceRequestRepository = serviceRequestRepository;
	}

	/**
	 * Method to return auditDetails for create/update flows
	 *
	 * @param by
	 * @param isCreate
	 * @return AuditDetails
	 */
	public AuditDetails getAuditDetails(String by, Boolean isCreate) {
		Long time = System.currentTimeMillis();
		if (isCreate)
			return AuditDetails.builder().createdBy(by).lastModifiedBy(by).createdTime(time).lastModifiedTime(time)
					.build();
		else
			return AuditDetails.builder().lastModifiedBy(by).lastModifiedTime(time).build();
	}

	/**
	 * Returns the URL for MDMS search end point
	 *
	 * @return URL for MDMS search end point
	 */
	public StringBuilder getMdmsSearchUrl() {
		return new StringBuilder().append(config.getMdmsHost()).append(config.getMdmsEndPoint());
	}

	/**
	 * prepares the MDMSCriteria to make MDMS Request
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	public MdmsCriteriaReq getMDMSRequest(RequestInfo requestInfo, String tenantId) {
		List<ModuleDetail> moduleRequest = getNOCModuleRequest();

		List<ModuleDetail> moduleDetails = new LinkedList<>();
		moduleDetails.addAll(moduleRequest);

		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(moduleDetails).tenantId(tenantId).build();

		MdmsCriteriaReq mdmsCriteriaReq = MdmsCriteriaReq.builder().mdmsCriteria(mdmsCriteria).requestInfo(requestInfo)
				.build();
		return mdmsCriteriaReq;
	}
	/**
	 * fetches the noc documentTypes and nocTypes mdms data
	 * @return
	 */
	public List<ModuleDetail> getNOCModuleRequest() {
		List<MasterDetail> nocMasterDtls = new ArrayList<>();

		final String nocFilterCode = "$.[?(@.isActive==true)]";

		nocMasterDtls.add(MasterDetail.builder().name(NOCConstants.NOC_TYPE).filter(nocFilterCode).build());
		nocMasterDtls.add(MasterDetail.builder().name(NOCConstants.NOC_DOC_TYPE_MAPPING).build());
		ModuleDetail nocModuleDtls = ModuleDetail.builder().masterDetails(nocMasterDtls)
				.moduleName(NOCConstants.NOC_MODULE).build();
		
		final String filterCode = "$.[?(@.active==true)]";

		List<MasterDetail> commonMasterDetails = new ArrayList<>();
			commonMasterDetails.add(MasterDetail.builder().name(NOCConstants.DOCUMENT_TYPE).filter(filterCode).build());
		ModuleDetail commonMasterMDtl = ModuleDetail.builder().masterDetails(commonMasterDetails)
				.moduleName(NOCConstants.COMMON_MASTERS_MODULE).build();

		return Arrays.asList(nocModuleDtls, commonMasterMDtl);
	}	

	/**
	 * prepares MDMS call 
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	public Object mDMSCall(RequestInfo requestInfo, String tenantId) {
		MdmsCriteriaReq mdmsCriteriaReq = getMDMSRequest(requestInfo, tenantId);
		Object result = serviceRequestRepository.fetchResult(getMdmsSearchUrl(), mdmsCriteriaReq);
		return result;
	}
	
}