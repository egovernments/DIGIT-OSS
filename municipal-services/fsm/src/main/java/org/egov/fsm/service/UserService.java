package org.egov.fsm.service;


import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.UUID;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.repository.ServiceRequestRepository;
import org.egov.fsm.util.FSMConstants;
import org.egov.fsm.util.FSMErrorConstants;
import org.egov.fsm.web.model.FSM;
import org.egov.fsm.web.model.FSMRequest;
import org.egov.fsm.web.model.FSMSearchCriteria;
import org.egov.fsm.web.model.user.CreateUserRequest;
import org.egov.fsm.web.model.user.User;
import org.egov.fsm.web.model.user.UserDetailResponse;
import org.egov.fsm.web.model.user.UserSearchRequest;
import org.egov.tracer.model.CustomException;
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
	private FSMConfiguration config;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private ObjectMapper mapper;


	public void manageApplicant(FSMRequest fsmRequest) {
		FSM fsm = fsmRequest.getFsm();
		 @Valid RequestInfo requestInfo = fsmRequest.getRequestInfo();
		 User applicant =  fsm.getCitizen();
			UserDetailResponse userDetailResponse = null;
			UserDetailResponse applicantDetailResponse = null;
			if (applicant.getMobileNumber() != null) {
				if (applicant.getTenantId() == null) {
					applicant.setTenantId(fsm.getTenantId().split("\\.")[0]);
				}

				userDetailResponse = userExists(applicant, requestInfo);
				
				if (userDetailResponse != null || !CollectionUtils.isEmpty(userDetailResponse.getUser())) {
					
					if( userDetailResponse.getUser().size() > 0 ){
						Boolean foundUser = Boolean.FALSE;
						for( int j=0;j<userDetailResponse.getUser().size();j++) {
							User user = userDetailResponse.getUser().get(j);
							if(!user.getUserName().equalsIgnoreCase(user.getMobileNumber()) && user.getName().equalsIgnoreCase(applicant.getName())){
								// found user with mobilenumber and username not same and name as equal to the applicnat name provided by ui
								// then consider that user as applicant
								applicant  = user;
								foundUser = Boolean.TRUE;
								break;
							}
						}
						// users exists with mobile number but non of them have the same name, then create new user
						if( foundUser == Boolean.FALSE) {
							applicantDetailResponse = createApplicant(applicant,fsmRequest.getRequestInfo(),Boolean.FALSE);
							applicant = applicantDetailResponse.getUser().get(0);
							
						}
					}else {
						// User exists but only one user with the mobile number and username as same, So create new user
						
						applicantDetailResponse = createApplicant(applicant,fsmRequest.getRequestInfo(),Boolean.FALSE);
						applicant = applicantDetailResponse.getUser().get(0);
						
					}
					
					
				}else {
					// User with mobile number itself not found then create new user and consider the new user as applicant.
					applicantDetailResponse = createApplicant(applicant,fsmRequest.getRequestInfo(),Boolean.TRUE);
					applicant = applicantDetailResponse.getUser().get(0);
				}
				
				fsm.setCitizen(applicant);
				
			} else {
				log.debug("MobileNo is not existed in Application.");
				throw new CustomException(FSMErrorConstants.INVALID_APPLICANT_ERROR, "MobileNo is mandatory for ownerInfo");
			}

	}
	/**
	 * create user for applicant
	 * @param applicant
	 * @param requestInfo
	 * @return
	 */
	private UserDetailResponse createApplicant(User applicant, RequestInfo requestInfo,Boolean newUser) {
		Role role = getCitizenRole();
		addUserDefaultFields(applicant.getTenantId(), role, applicant);
		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserContextPath())
				.append(config.getUserCreateEndpoint());
		setUserName(applicant);
		if(newUser == Boolean.TRUE) {
			applicant.setUserName(applicant.getMobileNumber());
		}
		applicant.setType(FSMConstants.CITIZEN);
		UserDetailResponse userDetailResponse = userCall(new CreateUserRequest(requestInfo, applicant), uri);
		log.debug("owner created --> " + userDetailResponse.getUser().get(0).getUuid());
		return userDetailResponse;
	}
	
	/**
	 * update user gender for applicant
	 * @param applicant
	 * @param requestInfo
	 * @return
	 */
	public UserDetailResponse updateApplicantsGender(User applicant, RequestInfo requestInfo) {
		applicant.setActive(true);
		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserContextPath())
				.append(config.getUserUpdateEndpoint());
		UserDetailResponse userDetailResponse = userCall(new CreateUserRequest(requestInfo, applicant), uri);
		log.debug("owner created --> " + userDetailResponse.getUser().get(0).getUuid());
		return userDetailResponse;
	}

	/**
	 * Creates citizen role
	 * 
	 * @return Role object for citizen
	 */
	private Role getCitizenRole() {
		Role role = new Role();
		role.setCode(FSMConstants.CITIZEN);
		role.setName("Citizen");
		return role;
	}

	/**
	 * Checks if the user exists in the database
	 * 
	 * @param applicant
	 *            The applicant from the FSM Application
	 * @param requestInfo
	 *            The requestInfo of the request
	 * @return The search response from the user service
	 */
	private UserDetailResponse userExists(User applicant, @Valid RequestInfo requestInfo) {

		UserSearchRequest userSearchRequest = new UserSearchRequest();
		userSearchRequest.setTenantId(applicant.getTenantId().split("\\.")[0]);
		userSearchRequest.setMobileNumber(applicant.getMobileNumber());
		if( !StringUtils.isEmpty(applicant.getName())) {
			userSearchRequest.setName(applicant.getName());
		}
		

		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
		return userCall(userSearchRequest, uri);
	}

	/**
	 * Sets the username as uuid
	 * 
	 * @param owner
	 *            The owner to whom the username is to assigned
	 */
	private void setUserName(User owner) {
		String uuid = UUID.randomUUID().toString();
		owner.setUserName(uuid);
		owner.setUuid(uuid);
		
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
		applicant.setRoles(Collections.singletonList(role));
		applicant.setType(FSMConstants.CITIZEN);
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
	public UserDetailResponse userCall(Object userRequest, StringBuilder uri) {
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
	 * Parses date formats to long for all users in responseMap
	 * 
	 * @param responeMap
	 *            LinkedHashMap got from user api response
	 */
	@SuppressWarnings({"unchecked", "rawtypes"})
	private void parseResponse(LinkedHashMap responeMap, String dobFormat) {
		List<LinkedHashMap> users = (List<LinkedHashMap>) responeMap.get("user");
		String format1 = "dd-MM-yyyy HH:mm:ss";
		if (users != null) {
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
	 * @param date
	 *            date to be parsed
	 * @param format
	 *            Format of the date
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
	 * Call search in user service based on ownerids from criteria
	 * 
	 * @param criteria
	 *            The search criteria containing the ownerids
	 * @param requestInfo
	 *            The requestInfo of the request
	 * @return Search response from user service based on ownerIds
	 */
	public UserDetailResponse getUser(FSMSearchCriteria criteria, RequestInfo requestInfo) {
		UserSearchRequest userSearchRequest = getUserSearchRequest(criteria, requestInfo);
		StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
		UserDetailResponse userDetailResponse = userCall(userSearchRequest, uri);
		return userDetailResponse;
	}

	/**
	 * Creates userSearchRequest from fsmSearchCriteria
	 * 
	 * @param criteria
	 *            The fsmSearch criteria
	 * @param requestInfo
	 *            The requestInfo of the request
	 * @return The UserSearchRequest based on ownerIds
	 */
	private UserSearchRequest getUserSearchRequest(FSMSearchCriteria criteria, RequestInfo requestInfo) {
		UserSearchRequest userSearchRequest = new UserSearchRequest();
		userSearchRequest.setRequestInfo(requestInfo);
		userSearchRequest.setTenantId(criteria.getTenantId().split("\\.")[0]);
		userSearchRequest.setMobileNumber(criteria.getMobileNumber());
		userSearchRequest.setActive(true);
		userSearchRequest.setUserType(FSMConstants.CITIZEN);
		if (!CollectionUtils.isEmpty(criteria.getOwnerIds()))
			userSearchRequest.setUuid(criteria.getOwnerIds());
		return userSearchRequest;
	}
	
	
}