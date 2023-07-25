package org.egov.vendor.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.tracer.model.CustomException;
import org.egov.vendor.config.VendorConfiguration;
import org.egov.vendor.driver.web.model.Driver;
import org.egov.vendor.driver.web.model.DriverResponse;
import org.egov.vendor.driver.web.model.DriverSearchCriteria;
import org.egov.vendor.repository.ServiceRequestRepository;
import org.egov.vendor.repository.VendorRepository;
import org.egov.vendor.util.VendorConstants;
import org.egov.vendor.util.VendorErrorConstants;
import org.egov.vendor.web.model.Vendor;
import org.egov.vendor.web.model.VendorRequest;
import org.egov.vendor.web.model.VendorSearchCriteria;
import org.egov.vendor.web.model.hrms.Assignment;
import org.egov.vendor.web.model.hrms.Employee;
import org.egov.vendor.web.model.hrms.EmployeeRequest;
import org.egov.vendor.web.model.hrms.EmployeeResponse;
import org.egov.vendor.web.model.hrms.Jurisdiction;
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
public class UserService {

	@Autowired
	VendorConfiguration config;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	VendorRepository vendorRepository;

	@Autowired
	private ObjectMapper mapper;

	/**
	 * 
	 * @param vendorRequest
	 */
	@SuppressWarnings("null")
	public void manageOwner(VendorRequest vendorRequest) {

		Vendor vendor = vendorRequest.getVendor();
		RequestInfo requestInfo = vendorRequest.getRequestInfo();
		User owner = vendor.getOwner();

		UserDetailResponse userDetailResponse = null;

		if (owner.getMobileNumber() != null) {

			userDetailResponse = userExists(owner, requestInfo);
			User foundOwner = null;
			if (userDetailResponse != null && !CollectionUtils.isEmpty(userDetailResponse.getUser())) {

				validateVendorExists(userDetailResponse.getUser());

				for (int i = 0; i < userDetailResponse.getUser().size(); i++) {

					if (isRoleAvailale(userDetailResponse.getUser().get(i), config.getDsoRole(),
							vendor.getTenantId()) == Boolean.TRUE) {
						foundOwner = userDetailResponse.getUser().get(i);
						// throw new CustomException(VendorErrorConstants.INVALID_OWNER_ERROR, "Vendor
						// already exists with this mobile No");

					}
				}

				if (userDetailResponse.getUser().size() > 0 && foundOwner == null) {
					foundOwner = userDetailResponse.getUser().get(0);
					foundOwner.getRoles().add(getRolObj(config.getDsoRole(), config.getDsoRoleName()));
					UserRequest userRequest = UserRequest.builder().user(foundOwner).requestInfo(requestInfo).build();
					StringBuilder uri = new StringBuilder();
					uri.append(config.getUserHost()).append(config.getUserContextPath())
							.append(config.getUserUpdateEndpoint());
					UserDetailResponse userResponse = ownerCall(userRequest, uri);
					if (userResponse != null || !CollectionUtils.isEmpty(userResponse.getUser())) {
						owner = userResponse.getUser().get(0);
					} else {
						throw new CustomException(VendorErrorConstants.INVALID_OWNER_ERROR,
								"Unable to add DSO role to the existing user !");
					}

				} else {
					owner = foundOwner;
				}

			} else {
				// User with mobile number ifself not found then create new user and consider
				// the new user as applicant.
				owner = createVendorOwner(owner, vendorRequest.getRequestInfo());
			}

			vendor.setOwner(owner);

		} else {
			log.debug("MobileNo is not existed in Application.");
			throw new CustomException(VendorErrorConstants.INVALID_OWNER_ERROR, "MobileNo is mandatory for ownerInfo");
		}

	}

	private void validateVendorExists(List<User> user) {
		List<String> ownerIds = user.stream().map(User::getUuid).collect(Collectors.toList());
		int count = vendorRepository.getExistingVenodrsCount(ownerIds);

		if (count > 0) {
			throw new CustomException(VendorErrorConstants.ALREADY_VENDOR_EXIST,
					VendorErrorConstants.VENDOR_ERROR_MESSAGE);
		}
	}

	/**
	 * 
	 * @param vendorRequest
	 */
	@SuppressWarnings("null")
	public void manageDrivers(VendorRequest vendorRequest) {
		Vendor vendor = vendorRequest.getVendor();
		RequestInfo requestInfo = vendorRequest.getRequestInfo();

		List<Driver> drivers = vendor.getDrivers();
		List<Driver> newDrivers = new ArrayList<Driver>();
		HashMap<String, String> errorMap = new HashMap<String, String>();
		drivers.forEach(driver -> {

			UserDetailResponse userDetailResponse = null;

			if (driver.getOwner() != null && driver.getOwner().getMobileNumber() != null) {

				userDetailResponse = userExists(driver.getOwner(), requestInfo);
				User foundDriver = null;
				if (userDetailResponse != null && !CollectionUtils.isEmpty(userDetailResponse.getUser())) {

					for (int i = 0; i < userDetailResponse.getUser().size(); i++) {

						if (isRoleAvailale(userDetailResponse.getUser().get(i), config.getDsoDriver(),
								vendor.getTenantId()) == Boolean.TRUE) {
							foundDriver = userDetailResponse.getUser().get(i);
						}
					}

					if (foundDriver == null) {
						foundDriver = userDetailResponse.getUser().get(0);
						foundDriver.getRoles().add(getRolObj(config.getDsoDriver(), config.getDsoDriverRoleName()));
						UserRequest userRequest = UserRequest.builder().user(foundDriver).requestInfo(requestInfo)
								.build();
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
					foundDriver = createDriver(driver.getOwner(), requestInfo);
				}

				driver.setOwner(foundDriver);
				// foundDriver.setVendorDriverStatus(driver.getVendorDriverStatus());

				newDrivers.add(driver);

			} else {
				log.debug("MobileNo is not existed in Application.");
				errorMap.put(VendorErrorConstants.INVALID_DRIVER_ERROR,
						"MobileNo is mandatory for Driver " + driver.toString());
			}
		});
		vendor.setDrivers(newDrivers);
		if (!errorMap.isEmpty()) {
			throw new CustomException(errorMap);
		}

	}

	/**
	 * create Employee in HRMS for Vendor owner
	 * 
	 * @param owner
	 * @param requestInfo
	 * @return
	 */
	private User createVendorOwner(User owner, RequestInfo requestInfo) {

		if (!isUserValid(owner)) {
			throw new CustomException(VendorErrorConstants.INVALID_OWNER_ERROR,
					"Dob, relationShip, relation ship name and gender are mandaotry !");
		}

		if (owner.getRoles() != null) {
			owner.getRoles().add(getRolObj(config.getDsoRole(), config.getDsoRoleName()));
		} else {
			owner.setRoles(Arrays.asList(getRolObj(config.getDsoRole(), config.getDsoRoleName())));
		}

//		Role role = getCitizenRole();
		addUserDefaultFields(owner.getTenantId(), null, owner);
		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserContextPath())
				.append(config.getUserCreateEndpoint());
		setUserName(owner);
		owner.setType(VendorConstants.CITIZEN);
		UserDetailResponse userDetailResponse = userCall(new UserRequest(requestInfo, owner), uri);
		log.debug("owner created --> " + userDetailResponse.getUser().get(0).getUuid());
		return userDetailResponse.getUser().get(0);
	}

	/**
	 * Creates citizen role
	 * 
	 * @return Role object for citizen
	 */
	private Role getCitizenRole() {
		Role role = new Role();
		role.setCode(VendorConstants.CITIZEN);
		role.setName("Citizen");
		return role;
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
//			System.out.println("user search url: " + uri + userRequest);

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
	private User createEmpVendorOwner(User owner, RequestInfo requestInfo) {

		if (!isUserValid(owner)) {
			throw new CustomException(VendorErrorConstants.INVALID_OWNER_ERROR,
					"Dob, relationShip, relation ship name and gender are mandaotry !");
		}

		if (owner.getRoles() != null) {
			owner.getRoles().add(getRolObj(config.getDsoRole(), config.getDsoRoleName()));
		} else {
			owner.setRoles(Arrays.asList(getRolObj(config.getDsoRole(), config.getDsoRoleName())));
		}
		Jurisdiction juridiction = Jurisdiction.builder().hierarchy(VendorConstants.JURIDICTION_HIERARAHY)
				.boundaryType(VendorConstants.JURIDICTION_BOUNDARYTYPE).boundary(owner.getTenantId())
				.tenantId(owner.getTenantId()).build();
		Assignment assignment = Assignment.builder().fromDate(Calendar.getInstance().getTimeInMillis() + 100000)
				.isCurrentAssignment(Boolean.TRUE).department(VendorConstants.ASSIGNMENT_DEPT)
				.designation(VendorConstants.ASSIGNMENT_DESGNATION).build();
		Employee employee = Employee.builder().employeeStatus(VendorConstants.EMP_STATUS)
				.dateOfAppointment(Calendar.getInstance().getTimeInMillis()).employeeType(VendorConstants.EMP_TYPE)
				.tenantId(owner.getTenantId()).user(owner).jurisdictions(Arrays.asList(juridiction))
				.assignments(Arrays.asList(assignment)).build();
		EmployeeRequest employeeReq = EmployeeRequest.builder().employees(Arrays.asList(employee))
				.requestInfo(requestInfo).build();
		StringBuilder uri = new StringBuilder(config.getEmployeeHost()).append(config.getEmployeeContextPath())
				.append(config.getEmployeeCreateEndpoint());
		try {
			LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri, employeeReq);
			User newOwner = null;
			Employee vendorOwner = null;
			EmployeeResponse employeeDetailResponse = mapper.convertValue(responseMap, EmployeeResponse.class);
			if (employeeDetailResponse.getEmployees() != null && employeeDetailResponse.getEmployees().size() > 0) {
				vendorOwner = employeeDetailResponse.getEmployees().get(0);
				newOwner = vendorOwner.getUser();
			}
			return newOwner;
		} catch (IllegalArgumentException e) {
			throw new CustomException("IllegalArgumentException",
					"ObjectMapper not able to convertValue in create vendor owner");
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

//		Role role = getCitizenRole();
		addUserDefaultFields(driver.getTenantId(), null, driver);
		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserContextPath())
				.append(config.getUserCreateEndpoint());
		setUserName(driver);
		driver.setType(VendorConstants.CITIZEN);
		UserDetailResponse userDetailResponse = userCall(new UserRequest(requestInfo, driver), uri);
		log.debug("owner created --> " + userDetailResponse.getUser().get(0).getUuid());
		return userDetailResponse.getUser().get(0);
	}

	/**
	 * create Employee in HRMS for Vendor owner
	 * 
	 * @param driver
	 * @param requestInfo
	 * @return
	 */
	private User createEmpDriver(User driver, RequestInfo requestInfo) {

		if (!isUserValid(driver)) {
			throw new CustomException(VendorErrorConstants.INVALID_DRIVER_ERROR,
					"Dob, relationShip, relation ship name and gender are mandaotry !");
		}
		if (driver.getRoles() != null) {
			driver.getRoles().add(getRolObj(config.getDsoDriver(), config.getDsoDriverRoleName()));
		} else {
			driver.setRoles(Arrays.asList(getRolObj(config.getDsoDriver(), config.getDsoDriverRoleName())));
		}
		Jurisdiction juridiction = Jurisdiction.builder().hierarchy(VendorConstants.JURIDICTION_HIERARAHY)
				.boundaryType(VendorConstants.JURIDICTION_BOUNDARYTYPE).boundary(driver.getTenantId())
				.tenantId(driver.getTenantId()).build();
		Assignment assignment = Assignment.builder().fromDate(Calendar.getInstance().getTimeInMillis() + 100000)
				.isCurrentAssignment(Boolean.TRUE).department(VendorConstants.ASSIGNMENT_DEPT)
				.designation(VendorConstants.ASSIGNMENT_DESGNATION).build();
		Employee employee = Employee.builder().employeeStatus(VendorConstants.EMP_STATUS)
				.dateOfAppointment(Calendar.getInstance().getTimeInMillis()).employeeType(VendorConstants.EMP_TYPE)
				.tenantId(driver.getTenantId()).user(driver).jurisdictions(Arrays.asList(juridiction))
				.assignments(Arrays.asList(assignment)).build();
		EmployeeRequest employeeReq = EmployeeRequest.builder().employees(Arrays.asList(employee))
				.requestInfo(requestInfo).build();
		StringBuilder uri = new StringBuilder(config.getEmployeeHost()).append(config.getEmployeeContextPath())
				.append(config.getEmployeeCreateEndpoint());
		try {
			LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri, employeeReq);
			User newDriver = null;
			Employee driverEmployee = null;
			EmployeeResponse employeeDetailResponse = mapper.convertValue(responseMap, EmployeeResponse.class);
			if (employeeDetailResponse.getEmployees() != null && employeeDetailResponse.getEmployees().size() > 0) {
				driverEmployee = employeeDetailResponse.getEmployees().get(0);
				newDriver = driverEmployee.getUser();
			}
			return newDriver;
		} catch (IllegalArgumentException e) {
			throw new CustomException("IllegalArgumentException",
					"ObjectMapper not able to convertValue in create vendor owner");
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

	private void addDsoDefaultFields(String tenantId, Role role, User owner) {
		owner.setTenantId(tenantId);
		owner.setRoles(Collections.singletonList(role));
		owner.setType(VendorConstants.EMPLOYEE);
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

	public UserDetailResponse getOwner(VendorSearchCriteria criteria, RequestInfo requestInfo) {
		UserSearchRequest ownerSearchRequest = getOwnerSearchRequest(criteria, requestInfo);
		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
		UserDetailResponse ownerDetailResponse = ownerCall(ownerSearchRequest, uri);
		return ownerDetailResponse;

	}

	public UserDetailResponse getUsers(VendorSearchCriteria criteria, RequestInfo requestInfo) {
		UserSearchRequest userSearchRequest = getUsersSearchRequest(criteria, requestInfo);
		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
		UserDetailResponse ownerDetailResponse = ownerCall(userSearchRequest, uri);
		return ownerDetailResponse;
	}

	// Dont Know what and all parameters need to be add in
	// VendorSearchRequest mean while i am adding same as UserSearchRequest
	private UserSearchRequest getOwnerSearchRequest(VendorSearchCriteria criteria, RequestInfo requestInfo) {
		UserSearchRequest userSearchRequest = new UserSearchRequest();
		userSearchRequest.setRequestInfo(requestInfo);
		userSearchRequest.setTenantId(criteria.getTenantId().split("\\.")[0]);
		userSearchRequest.setMobileNumber(criteria.getMobileNumber());
		userSearchRequest.setActive(true);
//		userSearchRequest.setUserType(VendorConstants.EMPLOYEE);
		if (!CollectionUtils.isEmpty(criteria.getOwnerIds()))
			userSearchRequest.setUuid(criteria.getOwnerIds());
		return userSearchRequest;
	}

	private UserSearchRequest getUsersSearchRequest(VendorSearchCriteria criteria, RequestInfo requestInfo) {
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
