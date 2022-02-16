package org.egov.vehicle.util;

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
import org.egov.vehicle.config.VehicleConfiguration;
import org.egov.vehicle.repository.ServiceRequestRepository;
import org.egov.vehicle.web.model.AuditDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.Option;
import com.jayway.jsonpath.spi.json.JacksonJsonProvider;
import com.jayway.jsonpath.spi.json.JsonProvider;
import com.jayway.jsonpath.spi.mapper.JacksonMappingProvider;
import com.jayway.jsonpath.spi.mapper.MappingProvider;

@Component
public class VehicleUtil {
	@Autowired
	VehicleConfiguration config;
	
	@Autowired
	ServiceRequestRepository serviceRequestRepository;
	
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
    
    
	/**
	 * Method to return auditDetails for create/update flows
	 *
	 * @param by
	 * @param isCreate
	 * @return AuditDetails
	 */
	public AuditDetails getAuditDetails(String by, Boolean isCreate, AuditDetails existingAudit) {
		Long time = System.currentTimeMillis();
		if (isCreate)
			return AuditDetails.builder().createdBy(by).lastModifiedBy(by).createdTime(time).lastModifiedTime(time)
					.build();
		else {
			return AuditDetails.builder().lastModifiedBy(by).lastModifiedTime(time).createdBy(existingAudit.getCreatedBy()).createdTime(existingAudit.getCreatedTime()).build();
		}
			
	}
	
    /**
	 * makes mdms call with the given criteria and reutrn mdms data
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	public Object mDMSCall(RequestInfo requestInfo, String tenantId) {
		MdmsCriteriaReq mdmsCriteriaReq = getMDMSRequest(requestInfo, tenantId);
		Object result = serviceRequestRepository.fetchResult(getMdmsSearchUrl(), mdmsCriteriaReq);
		return result;
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
	 * prepares the mdms request object
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	public MdmsCriteriaReq getMDMSRequest(RequestInfo requestInfo, String tenantId) {
		List<ModuleDetail> moduleRequest = getVehicleModuleRequest();

		List<ModuleDetail> moduleDetails = new LinkedList<>();
		moduleDetails.addAll(moduleRequest);

		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(moduleDetails).tenantId(tenantId).build();

		MdmsCriteriaReq mdmsCriteriaReq = MdmsCriteriaReq.builder().mdmsCriteria(mdmsCriteria).requestInfo(requestInfo)
				.build();
		
		return mdmsCriteriaReq;
	}
	public List<ModuleDetail> getVehicleModuleRequest() {

		// filter to only get code field from master data
				final String filterCode = "$.[?(@.active==true)].code";
				final String activeFilter = "$.[?(@.active==true)]";
		// master details for FSM module
		List<MasterDetail> masterDtls = new ArrayList<>();
		List<ModuleDetail> moduleDtls = new ArrayList<>();
			
		masterDtls = new ArrayList<>();
		masterDtls.add(MasterDetail.builder().name(Constants.VEHICLE_SUCTION_TYPE).filter(filterCode).build());
		masterDtls.add(MasterDetail.builder().name(Constants.VEHICLE_MAKE_MODEL).filter(activeFilter).build());
		masterDtls.add(MasterDetail.builder().name(Constants.VEHICLE_OWNER_TYPE).filter(activeFilter).build());
		masterDtls.add(MasterDetail.builder().name(Constants.VEHICLE_DECLINE_REASON).filter(activeFilter).build());
		moduleDtls.add(ModuleDetail.builder().masterDetails(masterDtls)
				.moduleName(Constants.VEHICLE_MODULE_CODE).build());
		
		return moduleDtls;

	} 

 }
