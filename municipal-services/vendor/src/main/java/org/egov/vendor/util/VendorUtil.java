package org.egov.vendor.util;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.vendor.config.VendorConfiguration;
import org.egov.vendor.repository.ServiceRequestRepository;
import org.egov.vendor.web.model.AuditDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.Option;
import com.jayway.jsonpath.spi.json.JacksonJsonProvider;
import com.jayway.jsonpath.spi.json.JsonProvider;
import com.jayway.jsonpath.spi.mapper.JacksonMappingProvider;
import com.jayway.jsonpath.spi.mapper.MappingProvider;

@Component
public class VendorUtil {

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;
	
	@Autowired
	private VendorConfiguration vendorConfiguration;

	public void defaultJsonPathConfig() {
		Configuration.setDefaults(new Configuration.Defaults() {

			private final JsonProvider jsonProvider = new JacksonJsonProvider();
			private final MappingProvider mappingProvider = new JacksonMappingProvider();

			@Override
			public Set<Option> options() {
				return EnumSet.noneOf(Option.class);
			}

			@Override
			public MappingProvider mappingProvider() {
				return mappingProvider;
			}

			@Override
			public JsonProvider jsonProvider() {
				return jsonProvider;
			}
		});
	}

	public Object mDMSCall(RequestInfo requestInfo, String tenantId) {
		MdmsCriteriaReq mdmsCriteriaReq = getMDMSRequest(requestInfo, tenantId);
		Object result = serviceRequestRepository.fetchResult(getMdmsSearchUrl(), mdmsCriteriaReq);
		return result;
	}

	public StringBuilder getMdmsSearchUrl() {
		return new StringBuilder().append(vendorConfiguration.getMdmsHost()).append(vendorConfiguration.getMdmsEndPoint());
	}

	public MdmsCriteriaReq getMDMSRequest(RequestInfo requestInfo, String tenantId) {

		List<ModuleDetail> moduleRequest = getVendorModuleRequest();
		List<ModuleDetail> moduleDetails = new LinkedList<>();
		moduleDetails.addAll(moduleRequest);
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(moduleDetails).tenantId(tenantId).build();
		MdmsCriteriaReq mdmsCriteriaReq = MdmsCriteriaReq.builder().mdmsCriteria(mdmsCriteria).requestInfo(requestInfo)
				.build();
		return mdmsCriteriaReq;
	}

	public List<ModuleDetail> getVendorModuleRequest() {

		// filter to only get code field from master data
		final String activeFilter = "$.[?(@.active==true)]";
		// master details for Vendor module
		List<MasterDetail> masterDtls = new ArrayList<>();
		List<ModuleDetail> moduleDtls = new ArrayList<>();
			
		masterDtls = new ArrayList<>();
		masterDtls.add(MasterDetail.builder().name(VendorConstants.VENDOR_AGENCY_TYPE).filter(activeFilter).build());
		masterDtls.add(MasterDetail.builder().name(VendorConstants.VENDOR_PAYMENT_PREFERENCE).filter(activeFilter).build());
		moduleDtls.add(ModuleDetail.builder().masterDetails(masterDtls)
				.moduleName(VendorConstants.VENDOR_MODULE).build());
		
		return moduleDtls;

	}
	
	public AuditDetails getAuditDetails(String by, Boolean isCreate) {
		Long time = System.currentTimeMillis();
		if (isCreate)
			return AuditDetails.builder().createdBy(by).lastModifiedBy(by).createdTime(time).lastModifiedTime(time)
					.build();
		else
			return AuditDetails.builder().lastModifiedBy(by).lastModifiedTime(time).build();
	}
}
