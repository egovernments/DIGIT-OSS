package org.egov.fsm.plantmapping.validator;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.validation.Valid;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.plantmapping.config.PlantMappingConfiguration;
import org.egov.fsm.plantmapping.service.PlantMappingService;
import org.egov.fsm.plantmapping.util.PlantMappingConstants;
import org.egov.fsm.plantmapping.web.model.PlantMapping;
import org.egov.fsm.plantmapping.web.model.PlantMappingRequest;
import org.egov.fsm.plantmapping.web.model.PlantMappingResponse;
import org.egov.fsm.plantmapping.web.model.PlantMappingSearchCriteria;
import org.egov.fsm.service.UserService;
import org.egov.fsm.util.FSMConstants;
import org.egov.fsm.util.FSMErrorConstants;
import org.egov.fsm.validator.MDMSValidator;
import org.egov.fsm.web.model.user.UserDetailResponse;
import org.egov.fsm.web.model.user.UserSearchRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.common.base.Strings;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class PlantMappingValidator {

	@Autowired
	private MDMSValidator mdmsValidator;

	@Autowired
	private UserService userService;

	@Autowired
	private PlantMappingConfiguration config;

	@Autowired
	private PlantMappingService plantMappingService;

	public void validateCreateOrUpdate(@Valid PlantMappingRequest request, Object mdmsData) {

		if (StringUtils.isEmpty(request.getPlantMapping().getTenantId())) {
			throw new CustomException(PlantMappingConstants.INVALID_TENANT, "TenantId is mandatory");
		}
		if (request.getPlantMapping().getTenantId().split("\\.").length == 1) {
			throw new CustomException(PlantMappingConstants.INVALID_TENANT, "Invalid TenantId");
		}
		if (request.getPlantMapping().getEmployeeUuid() == null
				|| request.getPlantMapping().getEmployeeUuid().isEmpty()) {
			throw new CustomException(PlantMappingConstants.INVALID_UUID, "At lease one employee uuid is required");
		}
		if (request.getPlantMapping().getPlantCode() == null || request.getPlantMapping().getPlantCode().isEmpty()) {
			throw new CustomException(PlantMappingConstants.INVALID_PLANT_CODE, "");
		}
		mdmsValidator.validateMdmsData(request, mdmsData);

		PlantMapping plantMap = request.getPlantMapping();
		plantMap.getEmployeeUuid();
		if (!request.getRequestInfo().getUserInfo().getType().equalsIgnoreCase(FSMConstants.EMPLOYEE)) {
			throw new CustomException(FSMErrorConstants.INVALID_APPLICANT_ERROR, "Applicant must be an Employee");
		}
		mdmsValidator.validateFSTPPlantInfo(plantMap.getPlantCode(),request.getPlantMapping().getTenantId());

		UserDetailResponse userDetailResponse = userExists(request);

		ArrayList<String> code = new ArrayList<String>();
		if (userDetailResponse.getUser().size() > 0) {
			userDetailResponse.getUser().get(0).getRoles().forEach(role -> {
				code.add("" + role.getCode());
			});
			if (!code.contains(PlantMappingConstants.FSTPO_EMPLOYEE)) {
				throw new CustomException(FSMErrorConstants.INVALID_APPLICANT_ERROR,
						"Only FSTPO Empoyee Can do this creation.");
			}
		} else {
			throw new CustomException(FSMErrorConstants.FSTP_EMPLOYEE_INVALID_ERROR,
					"In FSTP plant to employee mapping, employee doesn't exists");

		}

	
	}

	public void validatePlantMappingExists(PlantMappingRequest request) {
		PlantMappingSearchCriteria plantMappingSearchCriteria = new PlantMappingSearchCriteria();
		plantMappingSearchCriteria.setEmployeeUuid(Arrays.asList(request.getPlantMapping().getEmployeeUuid()));
		plantMappingSearchCriteria.setPlantCode(request.getPlantMapping().getPlantCode());
		plantMappingSearchCriteria.setTenantId(request.getPlantMapping().getTenantId());
		PlantMappingResponse plantMapResponse = plantMappingService.search(plantMappingSearchCriteria,
				request.getRequestInfo());
		if (null != plantMapResponse && null != plantMapResponse.getPlantMapping()
				&& plantMapResponse.getPlantMapping().size() > 0
				&& StringUtils.isNotBlank(plantMapResponse.getPlantMapping().get(0).getId()))
			throw new CustomException(FSMErrorConstants.FSTP_EMPLOYEE_MAP_EXISTS_ERROR,
					"FSTP and employee mapping already exist.");
	}

	private UserDetailResponse userExists(PlantMappingRequest request) {
		UserSearchRequest userSearchRequest = new UserSearchRequest();
		List<String> uuid = new ArrayList<String>();
		uuid.add(request.getPlantMapping().getEmployeeUuid());
		userSearchRequest.setUuid(uuid);

		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
		UserDetailResponse userDetailResponse = userService.userCall(userSearchRequest, uri);
		return userDetailResponse;
	}

	public void validateSearch(@Valid PlantMappingSearchCriteria criteria, RequestInfo requestInfo) {
		if (StringUtils.isEmpty(criteria.getTenantId())) {
			throw new CustomException(PlantMappingConstants.INVALID_SEARCH, "TenantId is mandatory in search");
		}
		String allowedParamStr = config.getAllowedPlantMappingSearchParameters();
		if (StringUtils.isEmpty(allowedParamStr) && !criteria.isEmpty())
			throw new CustomException(PlantMappingConstants.INVALID_SEARCH, "No search parameters are expected");
		else {
			List<String> allowedParams = Arrays.asList(allowedParamStr.split(","));
			validateSearchParams(criteria, allowedParams);
		}

	}

	private void validateSearchParams(@Valid PlantMappingSearchCriteria criteria, List<String> allowedParams) {

		if (criteria.getPlantCode() != null && !allowedParams.contains("plantCode"))
			throw new CustomException(PlantMappingConstants.INVALID_SEARCH, "Search on plant code is not allowed");

		if (criteria.getEmployeeUuid() != null && !allowedParams.contains("employeeUuid"))
			throw new CustomException(PlantMappingConstants.INVALID_SEARCH, "Search on  employee uuid is not allowed");

		if (criteria.getTenantId() != null && !allowedParams.contains("tenantId"))
			throw new CustomException(PlantMappingConstants.INVALID_SEARCH, "Search on tenantid is not allowed");

	}

}
