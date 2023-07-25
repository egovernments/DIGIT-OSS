package org.egov.vehicle.service;

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

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.tracer.model.CustomException;
import org.egov.vehicle.config.VehicleConfiguration;
import org.egov.vehicle.repository.ServiceRequestRepository;
import org.egov.vehicle.util.Constants;
import org.egov.vehicle.util.VehicleErrorConstants;
import org.egov.vehicle.web.model.Vehicle;
import org.egov.vehicle.web.model.VehicleRequest;
import org.egov.vehicle.web.model.VehicleSearchCriteria;
import org.egov.vehicle.web.model.hrms.Assignment;
import org.egov.vehicle.web.model.hrms.Employee;
import org.egov.vehicle.web.model.hrms.EmployeeRequest;
import org.egov.vehicle.web.model.hrms.EmployeeResponse;
import org.egov.vehicle.web.model.hrms.Jurisdiction;
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
	
	@Autowired
	private Constants constants;

	/**
	 * 
	 * @param vendorRequest
	 */
	@SuppressWarnings("null")
	public void manageOwner(VehicleRequest vendorRequest) {

		Vehicle vehicle = vendorRequest.getVehicle();
		RequestInfo requestInfo = vendorRequest.getRequestInfo();
		User owner = vehicle.getOwner();

		
		UserDetailResponse userDetailResponse = null;
		

		if (owner!=null && owner.getMobileNumber() != null) {

			userDetailResponse = userExists(owner, requestInfo);
			if (userDetailResponse != null && !CollectionUtils.isEmpty(userDetailResponse.getUser())) {

				//TODO once role is introduced for vehicle owner then verify for the role from the list of users
				owner = userDetailResponse.getUser().get(0);
				
				

			} else {
				// User with mobile number ifself not found then create new user and consider
				// the new user as applicant.
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

		if(!isUserValid(owner)) {
			throw new CustomException(VehicleErrorConstants.INVALID_OWNER_ERROR,
					"Dob, relationShip, relation ship name and gender are mandaotry !");
		}
		
		//TODO once the role for vehicle ownere is confirmed, then need to add the role as well
		
		if( owner.getRoles() != null ) {
			owner.getRoles().add(getRolObj(Constants.DSO_DRIVER, Constants.DSO_DRIVER_ROLE_NAME));
		}else {
			owner.setRoles(Arrays.asList(getRolObj(Constants.DSO_DRIVER, Constants.DSO_DRIVER_ROLE_NAME)));
		}
		
		
		//Role role = getCitizenRole();
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
	 * Creates citizen role
	 * 
	 * @return Role object for citizen
	 */
	private Role getCitizenRole() {
		Role role = new Role();
		role.setCode(Constants.CITIZEN);
		role.setName("Citizen");
		return role;
	}
	
	/**
	 * Sets the role,type,active and tenantId for a Citizen
	 * 
	 * @param tenantId
	 *            TenantId of the property
	 * @param role 
	 * @param role
	 *            The role of the user set in this case to CITIZEN
	 * @param applicant
	 *            The user whose fields are to be set
	 */
	private void addUserDefaultFields(String tenantId, Role role, User applicant) {
		applicant.setActive(true);
		applicant.setTenantId(tenantId);
		
		if(role != null)
		applicant.setRoles(Collections.singletonList(role));
		
		applicant.setType(Constants.CITIZEN);
	}
	
	/**
	 * Sets the username as uuid
	 * 
	 * @param owner
	 *            The owner to whom the username is to assigned
	 */
	private void setUserName(User owner) {
		String uuid = UUID.randomUUID().toString();
		owner.setUserName(owner.getMobileNumber());
		owner.setUuid(uuid);
		
	}
	
	/**
	 * Returns UserDetailResponse by calling user service with given uri and object
	 * 
	 * @param userRequest
	 *            Request object for user service
	 * @param uri
	 *            The address of the end point
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
	private User createEmpVehicleOwner(User owner, RequestInfo requestInfo) {

		if(!isUserValid(owner)) {
			throw new CustomException(VehicleErrorConstants.INVALID_OWNER_ERROR,
					"Dob, relationShip, relation ship name and gender are mandaotry !");
		}
		
		//TODO once the role for vehicle ownere is confirmed, then need to add the role as well
		
		if( owner.getRoles() != null ) {
			owner.getRoles().add(getRolObj(Constants.DSO_DRIVER, Constants.DSO_DRIVER_ROLE_NAME));
		}else {
			owner.setRoles(Arrays.asList(getRolObj(Constants.DSO_DRIVER, Constants.DSO_DRIVER_ROLE_NAME)));
		}
		
		Jurisdiction juridiction = Jurisdiction.builder().hierarchy(constants.JURIDICTION_HIERARAHY)
				.boundaryType(constants.JURIDICTION_BOUNDARYTYPE).boundary(owner.getTenantId())
				.tenantId(owner.getTenantId()).build();
		Assignment assignment = Assignment.builder().fromDate(Calendar.getInstance().getTimeInMillis()+100000)
				.isCurrentAssignment(Boolean.TRUE).department(constants.ASSIGNMENT_DEPT)
				.designation(constants.ASSIGNMENT_DESGNATION).build();
		Employee employee = Employee.builder().employeeStatus(constants.EMP_STATUS)
				.dateOfAppointment(Calendar.getInstance().getTimeInMillis()).employeeType(constants.EMP_TYPE)
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
		owner.setType(constants.EMPLOYEE);
	}

	public UserDetailResponse userExists(User owner, @Valid RequestInfo requestInfo) {

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

	public UserDetailResponse getOwner(VehicleSearchCriteria criteria, RequestInfo requestInfo) {
		UserSearchRequest ownerSearchRequest = getOwnerSearchRequest(criteria, requestInfo);
		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
		UserDetailResponse ownerDetailResponse = ownerCall(ownerSearchRequest, uri);
		return ownerDetailResponse;
	}
	
	public User getUser(String uuid, String tenantId, RequestInfo requestInfo) {
		UserSearchRequest ownerSearchRequest  = new UserSearchRequest();
		ownerSearchRequest.setRequestInfo(requestInfo);
		ownerSearchRequest.setTenantId(tenantId.split("\\.")[0]);
		ownerSearchRequest.setActive(true);
		List ids = new ArrayList<String>();
		ids.add(uuid);
		ownerSearchRequest.setUuid(ids);
		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
		UserDetailResponse ownerDetailResponse = ownerCall(ownerSearchRequest, uri);
		if(ownerDetailResponse != null && ownerDetailResponse.getUser() != null  && ownerDetailResponse.getUser().size() > 0) {
			return ownerDetailResponse.getUser().get(0);
		}else {
			return null;
		}
	}

	// Dont Know what and all parameters need to be add in
	// VendorSearchRequest mean while i am adding same as UserSearchRequest
	private UserSearchRequest getOwnerSearchRequest(VehicleSearchCriteria criteria, RequestInfo requestInfo) {
		UserSearchRequest userSearchRequest = new UserSearchRequest();
		userSearchRequest.setRequestInfo(requestInfo);
		userSearchRequest.setTenantId(criteria.getTenantId());
		userSearchRequest.setMobileNumber(criteria.getMobileNumber());
		userSearchRequest.setActive(true);
//		userSearchRequest.setUserType(constants.EMPLOYEE);
		if (!CollectionUtils.isEmpty(criteria.getOwnerId()))
			userSearchRequest.setUuid(criteria.getOwnerId());
		return userSearchRequest;
	}
	/**
	 * Validates the mandatory fields for the user
	 * @param user
	 * @return
	 */
	@SuppressWarnings("deprecation")
	private Boolean isUserValid(User user) {
		if(StringUtils.isEmpty(user.getTenantId() ) || StringUtils.isEmpty(user.getName()) || StringUtils.isEmpty(user.getFatherOrHusbandName()) ||
				StringUtils.isEmpty(user.getRelationship()) || StringUtils.isEmpty(user.getDob()) || StringUtils.isEmpty(user.getGender()) || StringUtils.isEmpty(user.getEmailId())) {
				
			return Boolean.FALSE;
		}
		
		return Boolean.TRUE;
	}
	
	public UserDetailResponse  searchUsersByCriteria(UserSearchRequest userSearchRequest) {
		
		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
		UserDetailResponse ownerDetailResponse = ownerCall(userSearchRequest, uri);
		
		if (ownerDetailResponse != null && ownerDetailResponse.getUser() != null
				&& ownerDetailResponse.getUser().size() > 0) {
			return ownerDetailResponse;
		}else {
			return null;
		}
	}

}
