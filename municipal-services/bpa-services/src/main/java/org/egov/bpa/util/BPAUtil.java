package org.egov.bpa.util;

import static org.egov.bpa.util.BPAConstants.BILL_AMOUNT;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.egov.bpa.config.BPAConfiguration;
import org.egov.bpa.repository.ServiceRequestRepository;
import org.egov.bpa.web.model.AuditDetails;
import org.egov.bpa.web.model.BPA;
import org.egov.bpa.web.model.BPARequest;
import org.egov.bpa.web.model.RequestInfoWrapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.tracer.model.CustomException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.Option;
import com.jayway.jsonpath.spi.json.JacksonJsonProvider;
import com.jayway.jsonpath.spi.json.JsonProvider;
import com.jayway.jsonpath.spi.mapper.JacksonMappingProvider;
import com.jayway.jsonpath.spi.mapper.MappingProvider;

@Component
public class BPAUtil {

	private BPAConfiguration config;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	public BPAUtil(BPAConfiguration config, ServiceRequestRepository serviceRequestRepository) {
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
	 * Creates request to search ApplicationType and etc from MDMS
	 * 
	 * @param requestInfo
	 *            The requestInfo of the request
	 * @param tenantId
	 *            The tenantId of the BPA
	 * @return request to search ApplicationType and etc from MDMS
	 */
	public List<ModuleDetail> getBPAModuleRequest() {

		// master details for BPA module
		List<MasterDetail> bpaMasterDtls = new ArrayList<>();

		// filter to only get code field from master data
		final String filterCode = "$.[?(@.active==true)].code";

		bpaMasterDtls.add(MasterDetail.builder().name(BPAConstants.APPLICATION_TYPE).filter(filterCode).build());
		bpaMasterDtls.add(MasterDetail.builder().name(BPAConstants.SERVICE_TYPE).filter(filterCode).build());
		bpaMasterDtls.add(MasterDetail.builder().name(BPAConstants.DOCUMENT_TYPE_MAPPING).build());
		bpaMasterDtls.add(MasterDetail.builder().name(BPAConstants.RISKTYPE_COMPUTATION).build());
		bpaMasterDtls.add(MasterDetail.builder().name(BPAConstants.OCCUPANCY_TYPE).filter(filterCode).build());
		bpaMasterDtls.add(MasterDetail.builder().name(BPAConstants.SUB_OCCUPANCY_TYPE).filter(filterCode).build());
		bpaMasterDtls.add(MasterDetail.builder().name(BPAConstants.USAGES).filter(filterCode).build());
		bpaMasterDtls.add(MasterDetail.builder().name(BPAConstants.CalculationType).build());
		bpaMasterDtls.add(MasterDetail.builder().name(BPAConstants.CHECKLIST_NAME).build());
		ModuleDetail bpaModuleDtls = ModuleDetail.builder().masterDetails(bpaMasterDtls)
				.moduleName(BPAConstants.BPA_MODULE).build();

		// master details for common-masters module
		List<MasterDetail> commonMasterDetails = new ArrayList<>();
		commonMasterDetails
				.add(MasterDetail.builder().name(BPAConstants.OWNERSHIP_CATEGORY).filter(filterCode).build());
		commonMasterDetails.add(MasterDetail.builder().name(BPAConstants.OWNER_TYPE).filter(filterCode).build());
		commonMasterDetails.add(MasterDetail.builder().name(BPAConstants.DOCUMENT_TYPE).filter(filterCode).build());
		ModuleDetail commonMasterMDtl = ModuleDetail.builder().masterDetails(commonMasterDetails)
				.moduleName(BPAConstants.COMMON_MASTERS_MODULE).build();

		return Arrays.asList(bpaModuleDtls, commonMasterMDtl);

	}

	public MdmsCriteriaReq getMDMSRequest(RequestInfo requestInfo, String tenantId) {
		List<ModuleDetail> moduleRequest = getBPAModuleRequest();

		List<ModuleDetail> moduleDetails = new LinkedList<>();
		moduleDetails.addAll(moduleRequest);

		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(moduleDetails).tenantId(tenantId).build();

		MdmsCriteriaReq mdmsCriteriaReq = MdmsCriteriaReq.builder().mdmsCriteria(mdmsCriteria).requestInfo(requestInfo)
				.build();
		return mdmsCriteriaReq;
	}

	public Object mDMSCall(RequestInfo requestInfo, String tenantId) {
		MdmsCriteriaReq mdmsCriteriaReq = getMDMSRequest(requestInfo, tenantId);
		Object result = serviceRequestRepository.fetchResult(getMdmsSearchUrl(), mdmsCriteriaReq);
		return result;
	}
	
	
	public void defaultJsonPathConfig() {
		Configuration.setDefaults(new Configuration.Defaults() {

			private final JsonProvider jsonProvider = new JacksonJsonProvider();
			private final MappingProvider mappingProvider = new JacksonMappingProvider();

			@Override
			public JsonProvider jsonProvider() {
				return jsonProvider;
			}

			@Override
			public MappingProvider mappingProvider() {
				return mappingProvider;
			}

			@Override
			public Set<Option> options() {
				return EnumSet.noneOf(Option.class);
			}
		});
	}

	public ArrayList<String> getBusinessService(String applicationType, String serviceType) {
		Map<String, Map<String, String>> appSrvTypeBussSrvCode = config.getAppSrvTypeBussSrvCode();
		String[] codes = null;
		Map<String, String> serviceTypeMap = appSrvTypeBussSrvCode.get(applicationType);
		if (!CollectionUtils.isEmpty(serviceTypeMap)) {
			if (serviceType != null) {
				String serviceCodes = serviceTypeMap.get(serviceType);
				codes = serviceCodes.split(",");
			} else {
				codes = (String[]) serviceTypeMap.values().toArray(new String[serviceTypeMap.size()]);
				codes = codes[0].toString().split(",");
			}
		}else{
			codes = new String[0];
		}
		return  new ArrayList<String>(Arrays.asList(codes));
	}

	public BigDecimal getDemandAmount(BPARequest bpaRequest) {
		BPA bpa = bpaRequest.getBPA();
		RequestInfo requestInfo = bpaRequest.getRequestInfo();
		LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(getBillUri(bpa),
				new RequestInfoWrapper(requestInfo));
		JSONObject jsonObject = new JSONObject(responseMap);
		double amount = 0.0;
		try {
			JSONArray demandArray = (JSONArray) jsonObject.get("Demands");
			if (demandArray != null && demandArray.length() > 0) {
				JSONObject firstElement = (JSONObject) demandArray.get(0);
				if (firstElement != null) {
					JSONArray demandDetails = (JSONArray) firstElement.get("demandDetails");
					if (demandDetails != null) {
						for (int i = 0; i < demandDetails.length(); i++) {
							JSONObject object = (JSONObject) demandDetails.get(i);
							Double taxAmt = Double.valueOf((object.get("taxAmount").toString()));
							amount = amount + taxAmt;
						}
					}
				}
			}
			return BigDecimal.valueOf(amount);
		} catch (Exception e) {
			throw new CustomException("PARSING ERROR", "Failed to parse the response using jsonPath: " + BILL_AMOUNT);
		}
	}

	private StringBuilder getBillUri(BPA bpa) {
		String status = bpa.getStatus().toString();
		String code = null;

		if (bpa.getBusinessService().equalsIgnoreCase(BPAConstants.BPA_MODULE)) {
			if (status.equalsIgnoreCase(BPAConstants.APPL_FEE_STATE)) {
				code = "BPA.NC_APP_FEE";
			} else {
				code = "BPA.NC_SAN_FEE";
			}
		} else if (bpa.getBusinessService().equalsIgnoreCase(BPAConstants.BPA_LOW_MODULE_CODE)) {
			if (status.equalsIgnoreCase(BPAConstants.BPA_LOW_APPL_FEE_STATE))
				code = "BPA.LOW_RISK_PERMIT_FEE";
		} else if (bpa.getBusinessService().equalsIgnoreCase(BPAConstants.BPA_OC_MODULE_CODE)) {
			if (status.equalsIgnoreCase(BPAConstants.APPL_FEE_STATE)) {
				code = "BPA.NC_OC_APP_FEE";
			} else {
				code = "BPA.NC_OC_SAN_FEE";
			}
		}

		StringBuilder builder = new StringBuilder(config.getBillingHost());
		builder.append(config.getDemandSearchEndpoint());
		builder.append("?tenantId=");
		builder.append(bpa.getTenantId());
		builder.append("&consumerCode=");
		builder.append(bpa.getApplicationNo());
		builder.append("&businessService=");
		builder.append(code);
		return builder;
	}

}
