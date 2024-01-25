package org.egov.vehicle.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.tracer.model.CustomException;
import org.egov.vehicle.config.VehicleConfiguration;
import org.egov.vehicle.repository.ServiceRequestRepository;
import org.egov.vehicle.trip.util.VehicleTripConstants;
import org.egov.vehicle.util.Constants;
import org.egov.vehicle.util.VehicleErrorConstants;
import org.egov.vehicle.web.model.Vehicle;
import org.egov.vehicle.web.model.VehicleRequest;
import org.egov.vehicle.web.model.VehicleSearchCriteria;
import org.egov.vehicle.web.model.user.User;
import org.egov.vehicle.web.model.user.UserDetailResponse;
import org.egov.vehicle.web.model.user.UserRequest;
import org.egov.vehicle.web.model.user.UserSearchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserService {

	@Autowired
	VehicleConfiguration config;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private ObjectMapper mapper;

	/**
	 * 
	 * @param vendorRequest
	 */
	@SuppressWarnings("null")
	public void manageOwner(VehicleRequest vendorRequest) {

		Vehicle vehicle = vendorRequest.getVehicle();
		User owner = vehicle.getOwner();

		UserDetailResponse userDetailResponse = null;
		if (owner != null) {
			userDetailResponse = userExists(owner);
			if (userDetailResponse != null && !CollectionUtils.isEmpty(userDetailResponse.getUser())) {
				owner = userDetailResponse.getUser().get(0);
			} else {
				owner = createVehicleOwner(owner, vendorRequest.getRequestInfo());
			}
			vehicle.setOwner(owner);

		} else {
			log.debug("MobileNo is not existed in Application.");
			throw new CustomException(VehicleErrorConstants.INVALID_OWNER_ERROR, "MobileNo is mandatory for ownerInfo");
		}

	}

	/**
	 * create Employee in HRMS for Vendor owner
	 * 
	 * @param owner
	 * @param requestInfo
	 * @return
	 */
	private User createVehicleOwner(User owner, RequestInfo requestInfo) {

		if (!isUserValid(owner)) {
			throw new CustomException(VehicleErrorConstants.INVALID_OWNER_ERROR,
					"Dob, relationShip, relation ship name and gender are mandaotry !");
		}
		if (owner.getRoles() != null) {
			owner.getRoles().add(getRolObj(Constants.DSO_DRIVER, Constants.DSO_DRIVER_ROLE_NAME));
		} else {
			owner.setRoles(Arrays.asList(getRolObj(Constants.DSO_DRIVER, Constants.DSO_DRIVER_ROLE_NAME)));
		}

		addUserDefaultFields(owner.getTenantId(), null, owner);
		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserContextPath())
				.append(config.getUserCreateEndpoint());
		setUserName(owner);
		owner.setType(Constants.CITIZEN);
		UserDetailResponse userDetailResponse = userCall(new UserRequest(requestInfo, owner), uri);
		log.debug("owner created --> " + userDetailResponse.getUser().get(0).getUuid());
		return userDetailResponse.getUser().get(0);
	}

	/**
	 * Sets the role,type,active and tenantId for a Citizen
	 * 
	 * @param tenantId  TenantId of the property
	 * @param role
	 * @param role      The role of the user set in this case to CITIZEN
	 * @param applicant The user whose fields are to be set
	 */
	private void addUserDefaultFields(String tenantId, Role role, User applicant) {
		applicant.setActive(true);
		applicant.setTenantId(tenantId);

		if (role != null)
			applicant.setRoles(Collections.singletonList(role));

		applicant.setType(Constants.CITIZEN);
	}

	/**
	 * Sets the username as uuid
	 * 
	 * @param owner The owner to whom the username is to assigned
	 */
	private void setUserName(User owner) {
		String uuid = UUID.randomUUID().toString();
		owner.setUserName(owner.getMobileNumber());
		owner.setUuid(uuid);

	}

	/**
	 * Returns UserDetailResponse by calling user service with given uri and object
	 * 
	 * @param userRequest Request object for user service
	 * @param uri         The address of the end point
	 * @return Response from user service as parsed as userDetailResponse
	 */
	@SuppressWarnings("rawtypes")
	UserDetailResponse userCall(Object userRequest, StringBuilder uri) {
		String dobFormat = null;
		if (uri.toString().contains(config.getUserSearchEndpoint())
				|| uri.toString().contains(config.getUserUpdateEndpoint()))
			dobFormat = "yyyy-MM-dd";
		else if (uri.toString().contains(config.getUserCreateEndpoint()))
			dobFormat = "dd/MM/yyyy";
		try {

			LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri, userRequest);
			parseResponse(responseMap, dobFormat);
			return mapper.convertValue(responseMap, UserDetailResponse.class);
		} catch (IllegalArgumentException e) {
			throw new CustomException(VehicleTripConstants.ILLEGAL_ARGUMENT_EXCEPTION,
					"ObjectMapper not able to convertValue in userCall");
		}
	}

	/**
	 * 
	 * @return
	 */
	private Role getRolObj(String roleCode, String roleName) {
		Role role = new Role();
		role.setCode(roleCode);
		role.setName(roleName);
		return role;
	}

	public UserDetailResponse userExists(User owner) {

		UserSearchRequest ownerSearchRequest = new UserSearchRequest();
		ownerSearchRequest.setTenantId(owner.getTenantId().split("\\.")[0]);

		if (!StringUtils.isEmpty(owner.getMobileNumber())) {
			ownerSearchRequest.setMobileNumber(owner.getMobileNumber());
		}
		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
		return ownerCall(ownerSearchRequest, uri);

	}

	public Boolean isRoleAvailale(User user, String role, String tenantId) {
		Boolean flag = false;
		Map<String, List<String>> tenantIdToOwnerRoles = getTenantIdToOwnerRolesMap(user);
		flag = isRoleAvailable(tenantIdToOwnerRoles.get(tenantId), role);
		return flag;
	}

	public Map<String, List<String>> getTenantIdToOwnerRolesMap(User user) {
		Map<String, List<String>> tenantIdToOwnerRoles = new HashMap<>();
		user.getRoles().forEach(role -> {
			if (tenantIdToOwnerRoles.containsKey(role.getTenantId())) {
				tenantIdToOwnerRoles.get(role.getTenantId()).add(role.getCode());
			} else {
				List<String> roleCodes = new LinkedList<>();
				roleCodes.add(role.getCode());
				tenantIdToOwnerRoles.put(role.getTenantId(), roleCodes);
			}

		});
		return tenantIdToOwnerRoles;
	}

	private Boolean isRoleAvailable(List<String> ownerRoles, String role) {
		if (CollectionUtils.isEmpty(ownerRoles)) {
			return false;
		}
		return ownerRoles.contains(role);

	}

	/**
	 * 
	 * @param ownerRequest
	 * @param uri
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	UserDetailResponse ownerCall(Object ownerRequest, StringBuilder uri) {
		String dobFormat = null;
		if (uri.toString().contains(config.getUserSearchEndpoint())
				|| uri.toString().contains(config.getUserUpdateEndpoint()))
			dobFormat = "yyyy-MM-dd";
		else if (uri.toString().contains(config.getUserCreateEndpoint()))
			dobFormat = "dd/MM/yyyy";
		try {
			LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri, ownerRequest);
			parseResponse(responseMap, dobFormat);
			return mapper.convertValue(responseMap, UserDetailResponse.class);
		} catch (IllegalArgumentException e) {
			throw new CustomException(VehicleTripConstants.ILLEGAL_ARGUMENT_EXCEPTION,
					"ObjectMapper not able to convertValue in ownerCall");
		}

	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	private void parseResponse(LinkedHashMap responeMap, String dobFormat) {
		List<LinkedHashMap> owners = (List<LinkedHashMap>) responeMap.get("user");
		String format1 = "dd-MM-yyyy HH:mm:ss";
		if (owners != null) {
			owners.forEach(map -> {
				map.put("createdDate", dateTolong((String) map.get("createdDate"), format1));
				if ((String) map.get("lastModifiedDate") != null)
					map.put("lastModifiedDate", dateTolong((String) map.get("lastModifiedDate"), format1));
				if ((String) map.get("dob") != null)
					map.put("dob", dateTolong((String) map.get("dob"), dobFormat));
				if ((String) map.get("pwdExpiryDate") != null)
					map.put("pwdExpiryDate", dateTolong((String) map.get("pwdExpiryDate"), format1));
			});
		}
	}

	private Long dateTolong(String date, String format) {
		SimpleDateFormat f = new SimpleDateFormat(format);
		Date d = null;
		try {
			d = f.parse(date);
		} catch (ParseException e) {
			throw new CustomException("PARSING_ERROR", "Failed to parse dateTolong" + e);
		}
		return d != null ? d.getTime() : 0;
	}

	public UserDetailResponse getOwner(VehicleSearchCriteria criteria, RequestInfo requestInfo) {
		UserSearchRequest ownerSearchRequest = getOwnerSearchRequest(criteria, requestInfo);
		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
		return ownerCall(ownerSearchRequest, uri);
	}

	public User getUser(String uuid, String tenantId, RequestInfo requestInfo) {
		UserSearchRequest ownerSearchRequest = new UserSearchRequest();
		ownerSearchRequest.setRequestInfo(requestInfo);
		ownerSearchRequest.setTenantId(tenantId.split("\\.")[0]);
		ownerSearchRequest.setActive(true);
		List ids = new ArrayList<String>();
		ids.add(uuid);
		ownerSearchRequest.setUuid(ids);
		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
		UserDetailResponse ownerDetailResponse = ownerCall(ownerSearchRequest, uri);
		if (ownerDetailResponse != null && ownerDetailResponse.getUser() != null
				&& !ownerDetailResponse.getUser().isEmpty()) {
			return ownerDetailResponse.getUser().get(0);
		} else {
			return null;
		}
	}

	private UserSearchRequest getOwnerSearchRequest(VehicleSearchCriteria criteria, RequestInfo requestInfo) {
		UserSearchRequest userSearchRequest = new UserSearchRequest();
		userSearchRequest.setRequestInfo(requestInfo);
		userSearchRequest.setTenantId(criteria.getTenantId());
		userSearchRequest.setMobileNumber(criteria.getMobileNumber());
		userSearchRequest.setActive(true);
		if (!CollectionUtils.isEmpty(criteria.getOwnerId()))
			userSearchRequest.setUuid(criteria.getOwnerId());
		return userSearchRequest;
	}

	/**
	 * Validates the mandatory fields for the user
	 * 
	 * @param user
	 * @return
	 */
	@SuppressWarnings("deprecation")
	private Boolean isUserValid(User user) {
		if (StringUtils.isEmpty(user.getTenantId()) || StringUtils.isEmpty(user.getName())
				|| StringUtils.isEmpty(user.getFatherOrHusbandName()) || StringUtils.isEmpty(user.getRelationship())
				|| StringUtils.isEmpty(user.getDob()) || StringUtils.isEmpty(user.getGender())
				|| StringUtils.isEmpty(user.getEmailId())) {

			return Boolean.FALSE;
		}

		return Boolean.TRUE;
	}

	public UserDetailResponse searchUsersByCriteria(UserSearchRequest userSearchRequest) {

		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
		UserDetailResponse ownerDetailResponse = ownerCall(userSearchRequest, uri);

		if (ownerDetailResponse != null && ownerDetailResponse.getUser() != null
				&& !ownerDetailResponse.getUser().isEmpty()) {
			return ownerDetailResponse;
		} else {
			return null;
		}
	}

}
