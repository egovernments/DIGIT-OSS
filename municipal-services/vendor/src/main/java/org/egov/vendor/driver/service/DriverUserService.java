package org.egov.vendor.driver.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.tracer.model.CustomException;
import org.egov.vendor.config.VendorConfiguration;
import org.egov.vendor.driver.web.model.Driver;
import org.egov.vendor.driver.web.model.DriverRequest;
import org.egov.vendor.driver.web.model.DriverSearchCriteria;
import org.egov.vendor.repository.ServiceRequestRepository;
import org.egov.vendor.util.VendorConstants;
import org.egov.vendor.util.VendorErrorConstants;
import org.egov.vendor.web.model.user.User;
import org.egov.vendor.web.model.user.UserDetailResponse;
import org.egov.vendor.web.model.user.UserRequest;
import org.egov.vendor.web.model.user.UserSearchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DriverUserService {

	@Autowired
	VendorConfiguration config;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private ObjectMapper mapper;

	/**
	 * 
	 * @param driverRequest
	 */
	@SuppressWarnings("null")
	public void manageDrivers(DriverRequest driverRequest) {
		Driver driver = driverRequest.getDriver();
		RequestInfo requestInfo = driverRequest.getRequestInfo();
		User driverInfo = driver.getOwner();
		HashMap<String, String> errorMap = new HashMap<String, String>();

		UserDetailResponse userDetailResponse = null;

		if (driverInfo.getMobileNumber() != null) {

			userDetailResponse = userExists(driverInfo, requestInfo);
			User foundDriver = null;
			if (userDetailResponse != null && !CollectionUtils.isEmpty(userDetailResponse.getUser())) {

				for (int i = 0; i < userDetailResponse.getUser().size(); i++) {

					if (isRoleAvailale(userDetailResponse.getUser().get(i), config.getDsoDriver(),
							driver.getTenantId()) == Boolean.TRUE) {
						foundDriver = userDetailResponse.getUser().get(i);
					}
				}

				if (foundDriver == null) {
					foundDriver = userDetailResponse.getUser().get(0);
					foundDriver.getRoles().add(getRolObj(config.getDsoDriver(), config.getDsoDriverRoleName()));
					UserRequest userRequest = UserRequest.builder().user(foundDriver).requestInfo(requestInfo).build();
					StringBuilder uri = new StringBuilder();
					uri.append(config.getUserHost()).append(config.getUserContextPath())
							.append(config.getUserUpdateEndpoint());
					UserDetailResponse userResponse = ownerCall(userRequest, uri);
					if (userResponse != null || !CollectionUtils.isEmpty(userResponse.getUser())) {
						foundDriver = userResponse.getUser().get(0);
					} else {
						errorMap.put(VendorErrorConstants.INVALID_DRIVER_ERROR,
								"Unable to add Driver role to the existing user !");
					}

				}

			} else {
				foundDriver = createDriver(driverInfo, requestInfo);
			}
			
			driverRequest.getDriver().setOwner(foundDriver);
		} else {
			log.debug("MobileNo is not provided in Application.");
			errorMap.put(VendorErrorConstants.INVALID_DRIVER_ERROR,
					"MobileNo is mandatory for Driver " + driver.toString());
		}

		if (!errorMap.isEmpty()) {
			throw new CustomException(errorMap);
		}

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

		applicant.setType(VendorConstants.CITIZEN);
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
			UserDetailResponse userDetailResponse = mapper.convertValue(responseMap, UserDetailResponse.class);
			return userDetailResponse;
		} catch (IllegalArgumentException e) {
			throw new CustomException("IllegalArgumentException", "ObjectMapper not able to convertValue in userCall");
		}
	}

	
	/**
	 * create Employee in HRMS for Vendor owner
	 * 
	 * @param owner
	 * @param requestInfo
	 * @return
	 */
	private User createDriver(User driver, RequestInfo requestInfo) {

		if (!isUserValid(driver)) {
			throw new CustomException(VendorErrorConstants.INVALID_DRIVER_ERROR,
					"Dob, relationShip, relation ship name and gender are mandaotry !");
		}
		if (driver.getRoles() != null) {
			driver.getRoles().add(getRolObj(config.getDsoDriver(), config.getDsoDriverRoleName()));
		} else {
			driver.setRoles(Arrays.asList(getRolObj(config.getDsoDriver(), config.getDsoDriverRoleName())));
		}
		addUserDefaultFields(driver.getTenantId(), null, driver);
		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserContextPath())
				.append(config.getUserCreateEndpoint());
		setUserName(driver);
		driver.setType(VendorConstants.CITIZEN);
		UserDetailResponse userDetailResponse = userCall(new UserRequest(requestInfo, driver), uri);
		log.info("owner created --> " + userDetailResponse.getUser().get(0).getUuid());
		return userDetailResponse.getUser().get(0);
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

	

	private UserDetailResponse userExists(User owner, @Valid RequestInfo requestInfo) {

		UserSearchRequest ownerSearchRequest = new UserSearchRequest();
		ownerSearchRequest.setTenantId(owner.getTenantId().split("\\.")[0]);

		if (!StringUtils.isEmpty(owner.getMobileNumber())) {
			ownerSearchRequest.setMobileNumber(owner.getMobileNumber());
		}
		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
		UserDetailResponse vendorDetailResponse = ownerCall(ownerSearchRequest, uri);

		return vendorDetailResponse;

	}

	public Boolean isRoleAvailale(User user, String role, String tenantId) {
		Boolean flag = false;
		Map<String, List<String>> tenantIdToOwnerRoles = getTenantIdToOwnerRolesMap(user);
		log.info("Data available tenant Id" + tenantIdToOwnerRoles.get(tenantId.split("\\.")[0]));
		flag = isRoleAvailable(tenantIdToOwnerRoles.get(tenantId.split("\\.")[0]), role);
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
		Boolean flag = false;
		// List<String> allowedRoles = Arrays.asList(actionRoles.get(0).split(","));
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
			UserDetailResponse ownerDetailResponse = mapper.convertValue(responseMap, UserDetailResponse.class);
			return ownerDetailResponse;
		} catch (IllegalArgumentException e) {
			throw new CustomException("IllegalArgumentException", "ObjectMapper not able to convertValue in ownerCall");
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
			e.printStackTrace();
		}
		return d.getTime();
	}

	public UserDetailResponse getOwner(DriverSearchCriteria criteria, RequestInfo requestInfo) {
		UserSearchRequest ownerSearchRequest = getOwnerSearchRequest(criteria, requestInfo);
		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
		UserDetailResponse ownerDetailResponse = ownerCall(ownerSearchRequest, uri);
		return ownerDetailResponse;

	}

	public UserDetailResponse getUsers(DriverSearchCriteria criteria, RequestInfo requestInfo) {
		UserSearchRequest userSearchRequest = getUsersSearchRequest(criteria, requestInfo);
		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
		UserDetailResponse ownerDetailResponse = ownerCall(userSearchRequest, uri);
		return ownerDetailResponse;
	}

	private UserSearchRequest getOwnerSearchRequest(DriverSearchCriteria criteria, RequestInfo requestInfo) {
		UserSearchRequest userSearchRequest = new UserSearchRequest();
		userSearchRequest.setRequestInfo(requestInfo);
		userSearchRequest.setTenantId(criteria.getTenantId().split("\\.")[0]);
		userSearchRequest.setMobileNumber(criteria.getMobileNumber());
		userSearchRequest.setActive(true);
		if (!CollectionUtils.isEmpty(criteria.getOwnerIds()))
			userSearchRequest.setUuid(criteria.getOwnerIds());
		return userSearchRequest;
	}

	private UserSearchRequest getUsersSearchRequest(DriverSearchCriteria criteria, RequestInfo requestInfo) {
		UserSearchRequest userSearchRequest = new UserSearchRequest();
		userSearchRequest.setRequestInfo(requestInfo);
		userSearchRequest.setUuid(criteria.getIds());
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
}