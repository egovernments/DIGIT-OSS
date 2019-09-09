package org.egov.demand.util;

import static org.egov.demand.util.Constants.INVALID_TENANT_ID_MDMS_KEY;
import static org.egov.demand.util.Constants.INVALID_TENANT_ID_MDMS_MSG;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.AuditDetails;
import org.egov.demand.repository.ServiceRequestRepository;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class Util {

	@Autowired
	private ApplicationProperties appProps;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	/**
	 * prepares mdms request
	 * 
	 * @param tenantId
	 * @param moduleName
	 * @param names
	 * @param filter
	 * @param requestInfo
	 * @return
	 */
	public MdmsCriteriaReq prepareMdMsRequest(String tenantId, String moduleName, List<String> names, String filter,
			RequestInfo requestInfo) {

		List<MasterDetail> masterDetails = new ArrayList<>();
		names.forEach(name -> {

			if (name.equalsIgnoreCase(Constants.BUSINESSSERVICE_MASTERNAME))
				masterDetails.add(MasterDetail.builder().name(name).filter(filter).build());
			else
				masterDetails.add(MasterDetail.builder().name(name).build());
		});

		ModuleDetail moduleDetail = ModuleDetail.builder().moduleName(moduleName).masterDetails(masterDetails).build();
		List<ModuleDetail> moduleDetails = new ArrayList<>();
		moduleDetails.add(moduleDetail);
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().tenantId(tenantId).moduleDetails(moduleDetails).build();
		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	}

	/**
	 * Fetches all the values of particular attribute as documentContext
	 *
	 * @param tenantId    tenantId of properties in PropertyRequest
	 * @param names       List of String containing the names of all master-data
	 *                    whose code has to be extracted
	 * @param requestInfo RequestInfo of the received PropertyRequest
	 * @return Map of MasterData name to the list of code in the MasterData
	 *
	 */
	public DocumentContext getAttributeValues(MdmsCriteriaReq mdmsReq) {
		StringBuilder uri = new StringBuilder(appProps.getMdmsHost()).append(appProps.getMdmsEndpoint());

		try {
			return JsonPath.parse(serviceRequestRepository.fetchResult(uri.toString(), mdmsReq));
		} catch (Exception e) {
			log.error("Error while fetvhing MDMS data", e);
			throw new CustomException(INVALID_TENANT_ID_MDMS_KEY, INVALID_TENANT_ID_MDMS_MSG);
		}
	}

	/**
	 * Generates the Audit details object for the requested user and current time
	 * 
	 * @param requestInfo
	 * @return
	 */
	public AuditDetails getAuditDetail(RequestInfo requestInfo) {

		String userId = requestInfo.getUserInfo().getUuid();
		Long currEpochDate = System.currentTimeMillis();

		return AuditDetails.builder().createdBy(userId).createdTime(currEpochDate).lastModifiedBy(userId)
				.lastModifiedTime(currEpochDate).build();
	}

	public String getStringVal(Set<String> set) {
		StringBuilder builder = new StringBuilder();
		int i = 0;
		for (String val : set) {
			builder.append(val);
			i++;
			if (i != set.size())
				builder.append(",");
		}
		return builder.toString();
	}
	
}