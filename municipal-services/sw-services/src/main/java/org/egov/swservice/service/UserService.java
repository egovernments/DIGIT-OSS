package org.egov.swservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.swservice.config.SWConfiguration;
import org.egov.swservice.repository.ServiceRequestRepository;
import org.egov.swservice.web.models.*;
import org.egov.swservice.web.models.users.UserDetailResponse;
import org.egov.swservice.web.models.users.UserSearchRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

	@Autowired
	private SWConfiguration configuration;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private ObjectMapper mapper;

	/**
	 * Creates user of the connection holders of sewerage connection if it is not
	 * created already
	 *
	 * @param request SewerageConnectionRequest
	 */
	public void createUser(SewerageConnectionRequest request) {
		if (!CollectionUtils.isEmpty(request.getSewerageConnection().getConnectionHolders())) {
			Role role = getCitizenRole();
			Set<String> listOfMobileNumbers = getMobileNumbers(request);
			request.getSewerageConnection().getConnectionHolders().forEach(holderInfo -> {
				addUserDefaultFields(request.getSewerageConnection().getTenantId(), role, holderInfo);
				UserDetailResponse userDetailResponse = userExists(holderInfo, request.getRequestInfo());
				if (CollectionUtils.isEmpty(userDetailResponse.getUser())) {
					/*
					 * Sets userName equal to mobileNumber
					 *
					 * If mobileNumber already assigned as user-name for another user
					 *
					 * then random uuid is assigned as user-name
					 */
					StringBuilder uri = new StringBuilder(configuration.getUserHost())
							.append(configuration.getUserContextPath()).append(configuration.getUserCreateEndPoint());
					setUserName(holderInfo, listOfMobileNumbers);

					ConnectionUserRequest userRequest = ConnectionUserRequest.builder()
							.requestInfo(request.getRequestInfo()).user(holderInfo).build();

					userDetailResponse = userCall(userRequest, uri);

					if (ObjectUtils.isEmpty(userDetailResponse)) {
						throw new CustomException("INVALID USER RESPONSE",
								"The user create has failed for the mobileNumber : " + holderInfo.getUserName());
					}

				} else {

					holderInfo.setId(userDetailResponse.getUser().get(0).getId());
					holderInfo.setUuid(userDetailResponse.getUser().get(0).getUuid());
					addUserDefaultFields(request.getSewerageConnection().getTenantId(), role, holderInfo);

					StringBuilder uri = new StringBuilder(configuration.getUserHost())
							.append(configuration.getUserContextPath()).append(configuration.getUserUpdateEndPoint());
					userDetailResponse = userCall(new ConnectionUserRequest(request.getRequestInfo(), holderInfo), uri);
					if (userDetailResponse.getUser().get(0).getUuid() == null) {
						throw new CustomException("INVALID_USER_RESPONSE", "The user updated has uuid as null");
					}
				}
				// Assigns value of fields from user got from userDetailResponse to owner object
				setOwnerFields(holderInfo, userDetailResponse, request.getRequestInfo());
			});
		}
	}

	/**
	 * Create citizen role
	 *
	 * @return Role
	 */
	private Role getCitizenRole() {
		return Role.builder().code("CITIZEN").name("Citizen").build();
	}

	/**
	 * Fetches all the unique mobileNumbers from a connection holders
	 *
	 * @param sewerageConnectionRequest
	 * @return list of all unique mobileNumbers in the given sewerage connection
	 *         holder details
	 */
	private Set<String> getMobileNumbers(SewerageConnectionRequest sewerageConnectionRequest) {
		Set<String> listOfMobileNumbers = sewerageConnectionRequest.getSewerageConnection().getConnectionHolders()
				.stream().map(OwnerInfo::getMobileNumber).collect(Collectors.toSet());
		StringBuilder uri = new StringBuilder(configuration.getUserHost())
				.append(configuration.getUserSearchEndpoint());
		UserSearchRequest userSearchRequest = UserSearchRequest.builder()
				.requestInfo(sewerageConnectionRequest.getRequestInfo()).userType("CITIZEN")
				.tenantId(sewerageConnectionRequest.getSewerageConnection().getTenantId()).build();
		Set<String> availableMobileNumbers = new HashSet<>();
		listOfMobileNumbers.forEach(mobilenumber -> {
			userSearchRequest.setUserName(mobilenumber);
			UserDetailResponse userDetailResponse = userCall(userSearchRequest, uri);
			if (CollectionUtils.isEmpty(userDetailResponse.getUser()))
				availableMobileNumbers.add(mobilenumber);
		});
		return availableMobileNumbers;
	}

	/**
	 * Returns UserDetailResponse by calling user service with given uri and object
	 *
	 * @param userRequest Request object for user service
	 * @param uri         The address of the endpoint
	 * @return Response from user service as parsed as userDetailResponse
	 */
	@SuppressWarnings("unchecked")
	private UserDetailResponse userCall(Object userRequest, StringBuilder uri) {
		String dobFormat = null;
		if (uri.toString().contains(configuration.getUserSearchEndpoint())
				|| uri.toString().contains(configuration.getUserUpdateEndPoint()))
			dobFormat = "yyyy-MM-dd";
		else if (uri.toString().contains(configuration.getUserCreateEndPoint()))
			dobFormat = "dd/MM/yyyy";
		try {
			LinkedHashMap<String, Object> responseMap = (LinkedHashMap<String, Object>) serviceRequestRepository
					.fetchResult(uri, userRequest);
			if (!CollectionUtils.isEmpty(responseMap)) {
				parseResponse(responseMap, dobFormat);
				return mapper.convertValue(responseMap, UserDetailResponse.class);
			} else {
				return new UserDetailResponse();
			}
		}
		// Which Exception to throw?
		catch (IllegalArgumentException e) {
			throw new CustomException("IllegalArgumentException", "ObjectMapper not able to convertValue in userCall");
		}
	}

	/**
	 * Parses date formats to long for all users in responseMap
	 *
	 * @param responeMap LinkedHashMap got from user api response
	 * @param dobFormat  dob format (required because dob is returned in different
	 *                   format's in search and create response in user service)
	 */
	@SuppressWarnings("unchecked")
	private void parseResponse(LinkedHashMap<String, Object> responeMap, String dobFormat) {
		List<LinkedHashMap<String, Object>> users = (List<LinkedHashMap<String, Object>>) responeMap.get("user");
		String format1 = "dd-MM-yyyy HH:mm:ss";
		if (null != users) {
			users.forEach(map -> {
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

	/**
	 * Converts date to long
	 *
	 * @param date   date to be parsed
	 * @param format Format of the date
	 * @return Long value of date
	 */
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

	/**
	 * Sets the role,type,active and tenantId for a Citizen
	 *
	 * @param tenantId  TenantId of the sewerage connection
	 * @param role      The role of the user set in this case to CITIZEN
	 * @param holderInfo The user whose fields are to be set
	 */
	private void addUserDefaultFields(String tenantId, Role role, OwnerInfo holderInfo) {
		holderInfo.setActive(true);
		holderInfo.setStatus(Status.ACTIVE);
		holderInfo.setTenantId(tenantId);
		holderInfo.setRoles(Collections.singletonList(role));
		holderInfo.setType("CITIZEN");
		holderInfo.setCreatedDate(null);
		holderInfo.setCreatedBy(null);
		holderInfo.setLastModifiedDate(null);
		holderInfo.setLastModifiedBy(null);
	}

	/**
	 * Searches if the connection holder is already created. Search is based on name
	 * of owner, uuid and mobileNumbe
	 *
	 * @param connectionHolderInfo ConnectionHolderInfo which is to be searched
	 * @param requestInfo          RequestInfo from the sewerageConnectionRequest
	 * @return UserDetailResponse containing the user if present and the
	 *         responseInfo
	 */
	private UserDetailResponse userExists(OwnerInfo connectionHolderInfo, RequestInfo requestInfo) {
		UserSearchRequest userSearchRequest = getBaseUserSearchRequest(connectionHolderInfo.getTenantId(), requestInfo);
		userSearchRequest.setMobileNumber(connectionHolderInfo.getMobileNumber());
		userSearchRequest.setUserType(connectionHolderInfo.getType());
		userSearchRequest.setName(connectionHolderInfo.getName());
		StringBuilder uri = new StringBuilder(configuration.getUserHost())
				.append(configuration.getUserSearchEndpoint());
		return userCall(userSearchRequest, uri);
	}

	/**
	 * provides a user search request with basic mandatory parameters
	 *
	 * @param tenantId
	 * @param requestInfo
	 * @return
	 */
	public UserSearchRequest getBaseUserSearchRequest(String tenantId, RequestInfo requestInfo) {
		return UserSearchRequest.builder().requestInfo(requestInfo).userType("CITIZEN").tenantId(tenantId).active(true)
				.build();
	}

	/**
	 * Sets userName for the owner as mobileNumber if mobileNumber already assigned
	 * last 10 digits of currentTime is assigned as userName
	 *
	 * @param owner              owner whose username has to be assigned
	 * @param listOfMobileNumber list of unique mobileNumbers in the propertyRequest
	 */
	/**
	 * @param holderInfo         holder whose username has to be assigned
	 * @param listOfMobileNumber list of unique mobileNumbers in the
	 *                           sewerageconnection request
	 */
	private void setUserName(OwnerInfo holderInfo, Set<String> listOfMobileNumber) {

		if (listOfMobileNumber.contains(holderInfo.getMobileNumber())) {
			holderInfo.setUserName(holderInfo.getMobileNumber());
			// Once mobileNumber is set as userName it is removed from the list
			listOfMobileNumber.remove(holderInfo.getMobileNumber());
		} else {
			String username = UUID.randomUUID().toString();
			holderInfo.setUserName(username);
		}
	}

	/**
	 * @param holderInfo
	 * @param userDetailResponse
	 * @param requestInfo
	 */
	private void setOwnerFields(OwnerInfo holderInfo, UserDetailResponse userDetailResponse,
			RequestInfo requestInfo) {

		holderInfo.setUuid(userDetailResponse.getUser().get(0).getUuid());
		holderInfo.setId(userDetailResponse.getUser().get(0).getId());
		holderInfo.setUserName((userDetailResponse.getUser().get(0).getUserName()));
		holderInfo.setCreatedBy(requestInfo.getUserInfo().getUuid());
		holderInfo.setCreatedDate(System.currentTimeMillis());
		holderInfo.setLastModifiedBy(requestInfo.getUserInfo().getUuid());
		holderInfo.setLastModifiedDate(System.currentTimeMillis());
		holderInfo.setActive(userDetailResponse.getUser().get(0).getActive());
	}

	/**
	 * @param userSearchRequest
	 * @return serDetailResponse containing the user if present and the responseInfo
	 */
	public UserDetailResponse getUser(UserSearchRequest userSearchRequest) {
		StringBuilder uri = new StringBuilder(configuration.getUserHost())
				.append(configuration.getUserSearchEndpoint());
		UserDetailResponse userDetailResponse = userCall(userSearchRequest, uri);
		return userDetailResponse;
	}

	/**
	 * Get user based on given property
	 *
	 * @param userSearchRequest
	 * @return combination of uuid given in search criteria
	 */
	private Set<String> getUsersUUID(UserSearchRequest userSearchRequest) {
		StringBuilder uri = new StringBuilder(configuration.getUserHost())
				.append(configuration.getUserSearchEndpoint());
		UserDetailResponse userDetailResponse = userCall(userSearchRequest, uri);
		if (CollectionUtils.isEmpty(userDetailResponse.getUser()))
			return Collections.emptySet();
		return userDetailResponse.getUser().stream().map(OwnerInfo::getUuid).collect(Collectors.toSet());
	}

	/**
	 * @param mobileNumber
	 * @param tenantId
	 * @param requestInfo
	 * @return
	 */
	public Set<String> getUUIDForUsers(String mobileNumber, String tenantId, RequestInfo requestInfo) {
		//TenantId is not mandatory when Citizen searches. So it can be empty. Refer the value from UserInfo
		tenantId = StringUtils.isEmpty(tenantId) ? requestInfo.getUserInfo().getTenantId() : tenantId;
		UserSearchRequest userSearchRequest = UserSearchRequest.builder().requestInfo(requestInfo).userType("CITIZEN")
				.tenantId(tenantId).mobileNumber(mobileNumber).build();
		return getUsersUUID(userSearchRequest);
	}

	public void updateUser(SewerageConnectionRequest request, SewerageConnection existingSewerageConnection) {
		if (!CollectionUtils.isEmpty(existingSewerageConnection.getConnectionHolders())) {
			// We have connection holder in the existing application.
			if (CollectionUtils.isEmpty(request.getSewerageConnection().getConnectionHolders())) {
				// New update request removed the connectionHolder - need to clear the records.
				OwnerInfo conHolder = new OwnerInfo();
				request.getSewerageConnection().addConnectionHolderInfo(conHolder);
				return;
			}
		}
		//Update connection holder.
		createUser(request);
	}

}