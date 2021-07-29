package org.egov.fsm.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.repository.ServiceRequestRepository;
import org.egov.fsm.web.model.AuditDetails;
import org.egov.fsm.web.model.FSMRequest;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
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
public class FSMUtil {
	/**
	 * json path's defuault cofig to read/parse the json
	 */
	@Autowired
	private ServiceRequestRepository serviceRequestRepository;
	
	@Autowired
	private FSMConfiguration config;
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
	public AuditDetails getAuditDetails(String by, Boolean isCreate) {
		Long time = System.currentTimeMillis();
		if (isCreate)
			return AuditDetails.builder().createdBy(by).lastModifiedBy(by).createdTime(time).lastModifiedTime(time)
					.build();
		else
			return AuditDetails.builder().lastModifiedBy(by).lastModifiedTime(time).build();
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
		List<ModuleDetail> moduleRequest = getFSMModuleRequest();

		List<ModuleDetail> moduleDetails = new LinkedList<>();
		moduleDetails.addAll(moduleRequest);

		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(moduleDetails).tenantId(tenantId).build();

		MdmsCriteriaReq mdmsCriteriaReq = MdmsCriteriaReq.builder().mdmsCriteria(mdmsCriteria).requestInfo(requestInfo)
				.build();
		return mdmsCriteriaReq;
	}
	public List<ModuleDetail> getFSMModuleRequest() {

		// filter to only get code field from master data
				final String filterCode = "$.[?(@.active==true)].code";
				final String activeFilter = "$.[?(@.active==true)]";
		// master details for FSM module
		List<MasterDetail> fsmMasterDtls = new ArrayList<>();

		fsmMasterDtls.add(MasterDetail.builder().name(FSMConstants.MDMS_APPLICATION_CHANNEL).filter(filterCode).build());
		fsmMasterDtls.add(MasterDetail.builder().name(FSMConstants.MDMS_SANITATION_TYPE).filter(filterCode).build());
		fsmMasterDtls.add(MasterDetail.builder().name(FSMConstants.MDMS_PIT_TYPE).filter(filterCode).build());
		fsmMasterDtls.add(MasterDetail.builder().name(FSMConstants.MDMS_PROPERTY_TYPE).filter(filterCode).build());
		fsmMasterDtls.add(MasterDetail.builder().name(FSMConstants.MDMS_CHECKLIST).filter(activeFilter).build());
		fsmMasterDtls.add(MasterDetail.builder().name(FSMConstants.MDMS_CONFIG).filter(activeFilter).build());
		fsmMasterDtls.add(MasterDetail.builder().name(FSMConstants.MDMS_SLUM_NAME).filter(activeFilter).build());
		ModuleDetail fsmMasterMDtl = ModuleDetail.builder().masterDetails(fsmMasterDtls)
				.moduleName(FSMConstants.FSM_MODULE_CODE).build();
		

		List<MasterDetail> vehicleMasterDtls = new ArrayList<>();
		vehicleMasterDtls.add(MasterDetail.builder().name(FSMConstants.MDMS_VEHICLE_MAKE_MODEL).filter(filterCode).build());
		ModuleDetail vehicleMasterMDtl = ModuleDetail.builder().masterDetails(vehicleMasterDtls)
				.moduleName(FSMConstants.VEHICLE_MODULE_CODE).build();


		return Arrays.asList(fsmMasterMDtl,vehicleMasterMDtl);

	}
	
	/**
	 * Check if the logged in user has the role for the FSM application tenantId
	 * @param fsmRequest
	 * @param role
	 * @return
	 */
	public Boolean isRoleAvailale(FSMRequest fsmRequest, String role) {
		Boolean flag = false;
		Map<String,List<String>> tenantIdToUserRoles = getTenantIdToUserRolesMap(fsmRequest.getRequestInfo().getUserInfo());
		 flag = isRoleAvailable(tenantIdToUserRoles.get(fsmRequest.getFsm().getTenantId()), role);
		
		return flag;
	}
	
	/**
	 * Check if the logged in user has the role for the FSM application tenantId
	 * @param fsmRequest
	 * @param role
	 * @return
	 */
	public Boolean isRoleAvailale(User user, String role, String tenantId) {
		Boolean flag = false;
		Map<String,List<String>> tenantIdToUserRoles = getTenantIdToUserRolesMap(user);
		 flag = isRoleAvailable(tenantIdToUserRoles.get(tenantId), role);
		
		return flag;
	}

	  /**
     * Checks if the user has role allowed for the action
     * @param userRoles The roles available with the user
     * @pram role  The role to verified
     * @return True if user can perform the action else false
     */
    private Boolean isRoleAvailable(List<String> userRoles, String role){
        Boolean flag = false;
        //       List<String> allowedRoles = Arrays.asList(actionRoles.get(0).split(","));
        if(CollectionUtils.isEmpty(userRoles))
            return false;

       userRoles.contains(role);
        return flag;
    }
    
    /**
     * Gets the map of tenantId to roles the user is assigned
     * @param requestInfo RequestInfo of the request
     * @return Map of tenantId to roles for user in the requestInfo
     */
    public Map<String,List<String>> getTenantIdToUserRolesMap(User user){
        Map<String,List<String>> tenantIdToUserRoles = new HashMap<>();
        user.getRoles().forEach(role -> {
            if(tenantIdToUserRoles.containsKey(role.getTenantId())){
                tenantIdToUserRoles.get(role.getTenantId()).add(role.getCode());
            }
            else {
                List<String> roleCodes = new LinkedList<>();
                roleCodes.add(role.getCode());
                tenantIdToUserRoles.put(role.getTenantId(),roleCodes);
            }

        });
        return tenantIdToUserRoles;
    }
}
