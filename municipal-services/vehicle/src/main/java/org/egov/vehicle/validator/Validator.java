package org.egov.vehicle.validator;


import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.vehicle.config.VehicleConfiguration;
import org.egov.vehicle.repository.VehicleRepository;
import org.egov.vehicle.service.UserService;
import org.egov.vehicle.util.Constants;
import org.egov.vehicle.util.VehicleErrorConstants;
import org.egov.vehicle.util.VehicleUtil;
import org.egov.vehicle.web.model.Vehicle;
import org.egov.vehicle.web.model.VehicleRequest;
import org.egov.vehicle.web.model.VehicleSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class Validator {

	@Autowired
	private VehicleConfiguration config;

	@Autowired
	private VehicleUtil util;
	
	@Autowired
	private MDMSValidator mdmsValidator;

	@Autowired
	private UserService userService;
	
	@Autowired
	private VehicleRepository repository;
	
	public void validateCreateOrUpdate(VehicleRequest vehicleRequest, Object mdmsData,boolean isUpdate) {

		Vehicle vehicle = vehicleRequest.getVehicle();
		if( StringUtils.isEmpty( vehicle.getRegistrationNumber())) {
			throw new CustomException(VehicleErrorConstants.INVALID_REGISTRATION_NUMBER,"Registation is mandatory");
		}
		if(isUpdate && StringUtils.isEmpty(vehicle.getId())) {
			throw new CustomException(VehicleErrorConstants.UPDATE_ERROR,"Vehicle id cannot be null in update request");
		}
		validateVehicle(vehicleRequest,isUpdate);
		mdmsValidator.validateMdmsData(vehicleRequest, mdmsData);
		if(!StringUtils.isEmpty(vehicle.getVehicleOwner())) {
			mdmsValidator.validateVehicleOwner(vehicleRequest.getVehicle().getVehicleOwner());	
		}
		mdmsValidator.validateVehicleType(vehicleRequest);
		mdmsValidator.validateSuctionType(vehicle.getSuctionType());
		userService.manageOwner(vehicleRequest);
		
		

	}
	
	private void validateVehicle(VehicleRequest vehicleRequest,boolean isUpdate) {
		Integer count = repository.getVehicleCount(vehicleRequest,"ACTIVE");
		if(count >0 && !isUpdate) {
			throw new CustomException(VehicleErrorConstants.INVALID_REGISTRATION_NUMBER,"Vehicle already exists ");
		}
		
	}

	/**
	 * Validates if the search parameters are valid
	 * 
	 * @param requestInfo
	 *            The requestInfo of the incoming request
	 * @param criteria
	 *            The FSMSearch Criteria
	 */
//TODO need to make the changes in the data
	public void validateSearch(RequestInfo requestInfo, VehicleSearchCriteria criteria) {
		if (!requestInfo.getUserInfo().getType().equalsIgnoreCase(Constants.CITIZEN) && criteria.isEmpty())
			throw new CustomException(VehicleErrorConstants.INVALID_SEARCH, "Search without any paramters is not allowed");

		if (!requestInfo.getUserInfo().getType().equalsIgnoreCase(Constants.CITIZEN) && !criteria.tenantIdOnly()
				&& criteria.getTenantId() == null)
			throw new CustomException(VehicleErrorConstants.INVALID_SEARCH, "TenantId is mandatory in search");

		if (requestInfo.getUserInfo().getType().equalsIgnoreCase(Constants.CITIZEN) && !criteria.isEmpty()
				&& !criteria.tenantIdOnly() && criteria.getTenantId() == null) 
			throw new CustomException(VehicleErrorConstants.INVALID_SEARCH, "TenantId is mandatory in search");
		if(criteria.getTenantId() == null)
			throw new CustomException(VehicleErrorConstants.INVALID_SEARCH, "TenantId is mandatory in search");
			
		String allowedParamStr = null;

		if (requestInfo.getUserInfo().getType().equalsIgnoreCase(Constants.CITIZEN))
			allowedParamStr = config.getAllowedCitizenSearchParameters();
		else if (requestInfo.getUserInfo().getType().equalsIgnoreCase(Constants.EMPLOYEE))
			allowedParamStr = config.getAllowedEmployeeSearchParameters();
		else
			throw new CustomException(VehicleErrorConstants.INVALID_SEARCH,
					"The userType: " + requestInfo.getUserInfo().getType() + " does not have any search config");

		if (StringUtils.isEmpty(allowedParamStr) && !criteria.isEmpty())
			throw new CustomException(VehicleErrorConstants.INVALID_SEARCH, "No search parameters are expected");
		else {
			List<String> allowedParams = Arrays.asList(allowedParamStr.split(","));
			validateSearchParams(criteria, allowedParams);
		}
	}

	/**
	 * Validates if the paramters coming in search are allowed
	 * 
	 * @param criteria
	 *            fsm search criteria
	 * @param allowedParams
	 *            Allowed Params for search
	 */
	private void validateSearchParams(VehicleSearchCriteria criteria, List<String> allowedParams) {

		if (criteria.getMobileNumber() != null && !allowedParams.contains("mobileNumber"))
			throw new CustomException(VehicleErrorConstants.INVALID_SEARCH, "Search on mobileNumber is not allowed");

		if (criteria.getOffset() != null && !allowedParams.contains("offset"))
			throw new CustomException(VehicleErrorConstants.INVALID_SEARCH, "Search on offset is not allowed");

		if (criteria.getLimit() != null && !allowedParams.contains("limit"))
			throw new CustomException(VehicleErrorConstants.INVALID_SEARCH, "Search on limit is not allowed");
		
		if (criteria.getIds() != null && !allowedParams.contains("ids"))
			throw new CustomException(VehicleErrorConstants.INVALID_SEARCH, "Search on ids is not allowed");
		
		if (criteria.getRegistrationNumber() != null && !allowedParams.contains("registrationNumber"))
			throw new CustomException(VehicleErrorConstants.INVALID_SEARCH, "Search on registrationNumber is not allowed");

		if (criteria.getType() != null && !allowedParams.contains("type"))
			throw new CustomException(VehicleErrorConstants.INVALID_SEARCH, "Search on type is not allowed");

		if (criteria.getModel() != null && !allowedParams.contains("model"))
			throw new CustomException(VehicleErrorConstants.INVALID_SEARCH, "Search on model is not allowed");
		
		if (criteria.getSuctionType() != null && !allowedParams.contains("suctionType"))
			throw new CustomException(VehicleErrorConstants.INVALID_SEARCH, "Search on suctionType is not allowed");
		

		if (criteria.getTankCapacity() != null && !allowedParams.contains("tankCapacity"))
			throw new CustomException(VehicleErrorConstants.INVALID_SEARCH, "Search on tankCapacity is not allowed");
		
		
		
		
			
	}
	

}
