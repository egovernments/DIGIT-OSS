package org.egov.vendor.validator;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.vendor.config.VendorConfiguration;
import org.egov.vendor.service.BoundaryService;
import org.egov.vendor.service.UserService;
import org.egov.vendor.service.VehicleService;
import org.egov.vendor.util.VendorConstants;
import org.egov.vendor.util.VendorErrorConstants;
import org.egov.vendor.util.VendorUtil;
import org.egov.vendor.web.model.VendorRequest;
import org.egov.vendor.web.model.VendorSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class VendorValidator {

	@Autowired
	private VendorConfiguration config;

	@Autowired
	private VendorUtil vendorUtil;

	@Autowired
	private UserService ownerService;

	@Autowired
	private MDMSValidator mdmsValidator;

	@Autowired
	private BoundaryService boundaryService;

	@Autowired
	private VehicleService vehicleService;

	@Autowired
	private UserService userService;

	public void validateSearch(RequestInfo requestInfo, VendorSearchCriteria criteria) {

		// Coz hear employee will be logged in to create vendor so..
		if (!requestInfo.getUserInfo().getType().equalsIgnoreCase(VendorConstants.EMPLOYEE) && criteria.isEmpty())
			throw new CustomException(VendorErrorConstants.INVALID_SEARCH,
					"Search without any paramters is not allowed");
		if (!requestInfo.getUserInfo().getType().equalsIgnoreCase(VendorConstants.EMPLOYEE) && !criteria.tenantIdOnly()
				&& criteria.getTenantId() == null)
			throw new CustomException(VendorErrorConstants.INVALID_SEARCH, VendorConstants.TENANT_ID_MANDATORY);

		if (requestInfo.getUserInfo().getType().equalsIgnoreCase(VendorConstants.EMPLOYEE) && !criteria.isEmpty()
				&& !criteria.tenantIdOnly() && criteria.getTenantId() == null)
			throw new CustomException(VendorErrorConstants.INVALID_SEARCH, VendorConstants.TENANT_ID_MANDATORY);
		if (criteria.getTenantId() == null)
			throw new CustomException(VendorErrorConstants.INVALID_SEARCH, VendorConstants.TENANT_ID_MANDATORY);

		String allowedParamStr = null;

		// I am in doute
		if (requestInfo.getUserInfo().getType().equalsIgnoreCase(VendorConstants.EMPLOYEE))
			allowedParamStr = config.getAllowedEmployeeSearchParameters();
		else if (requestInfo.getUserInfo().getType().equalsIgnoreCase(VendorConstants.CITIZEN))
			allowedParamStr = config.getAllowedCitizenSearchParameters();
		else
			throw new CustomException(VendorErrorConstants.INVALID_SEARCH,
					"The userType: " + requestInfo.getUserInfo().getType() + " does not have any search config");
		if (StringUtils.isEmpty(allowedParamStr) && !criteria.isEmpty())
			throw new CustomException(VendorErrorConstants.INVALID_SEARCH, "No search parameters are expected");
		else {
			List<String> allowedParams = Arrays.asList(allowedParamStr.split(","));
			validateSearchParams(criteria, allowedParams);
		}

	}

	private void validateSearchParams(VendorSearchCriteria criteria, List<String> allowedParams) {
		if (criteria.getOwnerIds() != null && !allowedParams.contains("ownerIds"))
			throw new CustomException(VendorErrorConstants.INVALID_SEARCH, "Search on ownerIds is not allowed");
		if (criteria.getOffset() != null && !allowedParams.contains("offset"))
			throw new CustomException(VendorErrorConstants.INVALID_SEARCH, "Search on offset is not allowed");
		if (criteria.getLimit() != null && !allowedParams.contains("limit"))
			throw new CustomException(VendorErrorConstants.INVALID_SEARCH, "Search on limit is not allowed");
		if (criteria.getName() != null && !allowedParams.contains("name")) {
			throw new CustomException(VendorErrorConstants.INVALID_SEARCH, "Search on ownerName is not allowed");
		}
		if (criteria.getTenantId() != null && !allowedParams.contains("tenantId")) {
			throw new CustomException(VendorErrorConstants.INVALID_SEARCH, "Search on tenantid is not allowed");
		}
		searchOnIdVehicleRegId(criteria, allowedParams);

	}

	private void searchOnIdVehicleRegId(VendorSearchCriteria criteria, List<String> allowedParams) {
		if (criteria.getIds() != null && !allowedParams.contains("ids"))
			throw new CustomException(VendorErrorConstants.INVALID_SEARCH, "Search on ids is not allowed");

		if (criteria.getVehicleRegistrationNumber() != null && !allowedParams.contains("vehicleRegistrationNumber"))
			throw new CustomException(VendorErrorConstants.INVALID_SEARCH,
					"Search on vehicleRegistrationNumber is not allowed");

		if (criteria.getVehicleIds() != null && !allowedParams.contains("vehicleIds"))
			throw new CustomException(VendorErrorConstants.INVALID_SEARCH, "Search on vehicleIds is not allowed");

	}

	/**
	 * 
	 * @param vendorRequest
	 * @param requestInfo
	 */
	public void validateCreateOrUpdateRequest(VendorRequest vendorRequest, Object mdmsData, boolean isCreate,
			RequestInfo requestInfo) {

		mdmsValidator.validateMdmsData(mdmsData);
		mdmsValidator.validateAgencyType(vendorRequest);
		mdmsValidator.validatePaymentPreference(vendorRequest);
		boundaryService.getAreaType(vendorRequest, config.getHierarchyTypeCode());

		vehicleService.manageVehicle(vendorRequest);
		if (!isCreate) {
			userService.vendorMobileExistanceCheck(vendorRequest, requestInfo);
		}
		if (isCreate) {
			ownerService.manageOwner(vendorRequest);
		} else {

			if (vendorRequest.getVendor() != null && vendorRequest.getVendor().getOwner() != null) {
				HashMap<String, String> errorMap = new HashMap<>();
				userService.updateUserDetails(vendorRequest.getVendor().getOwner(), vendorRequest.getRequestInfo(),
						errorMap);

			} else {
				log.debug("Vendor User Data Not found to Update user Details");
			}

		}

		ownerService.manageDrivers(vendorRequest);
	}
}
