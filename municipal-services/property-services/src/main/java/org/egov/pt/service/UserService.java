package org.egov.pt.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.pt.models.OwnerInfo;
import org.egov.pt.models.Property;
import org.egov.pt.models.enums.Status;
import org.egov.pt.models.user.CreateUserRequest;
import org.egov.pt.models.user.User;
import org.egov.pt.models.user.UserDetailResponse;
import org.egov.pt.models.user.UserSearchRequest;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.web.contracts.PropertyRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class UserService {

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Value("${egov.user.host}")
    private String userHost;

    @Value("${egov.user.context.path}")
    private String userContextPath;

    @Value("${egov.user.create.path}")
    private String userCreateEndpoint;

    @Value("${egov.user.search.path}")
    private String userSearchEndpoint;

    @Value("${egov.user.update.path}")
    private String userUpdateEndpoint;

    /**
     * Creates user of the owners of property if it is not created already
     * @param request PropertyRequest received for creating properties
     */
    public void createUser(PropertyRequest request){
    	
        Property property = request.getProperty();
		RequestInfo requestInfo = request.getRequestInfo();
		Role role = getCitizenRole();
		List<OwnerInfo> owners = property.getOwners();

		for (OwnerInfo ownerFromRequest : owners) {

			addUserDefaultFields(property.getTenantId(), role, ownerFromRequest);
			UserDetailResponse userDetailResponse = userExists(ownerFromRequest, requestInfo);
			List<OwnerInfo> existingUsersFromService = userDetailResponse.getUser();
			Map<String, OwnerInfo> ownerMapFromSearch = existingUsersFromService.stream().collect(Collectors.toMap(OwnerInfo::getUuid, Function.identity()));

			if (CollectionUtils.isEmpty(existingUsersFromService)) {

				ownerFromRequest.setUserName(UUID.randomUUID().toString());
				userDetailResponse = createUser(requestInfo, ownerFromRequest);
				
			} else {

				String uuid = ownerFromRequest.getUuid();
				if (uuid != null && ownerMapFromSearch.containsKey(uuid)) {
					userDetailResponse = updateExistingUser(property, requestInfo, role, ownerFromRequest, ownerMapFromSearch.get(uuid));
				} else {

					ownerFromRequest.setUserName(UUID.randomUUID().toString());
					userDetailResponse = createUser(requestInfo, ownerFromRequest);
				}
			}
			// Assigns value of fields from user got from userDetailResponse to owner object
			setOwnerFields(ownerFromRequest, userDetailResponse, requestInfo);
		}
	}


    /**
     * update existing user
     * 
     */
	private UserDetailResponse updateExistingUser(Property property, RequestInfo requestInfo, Role role,
			OwnerInfo ownerFromRequest, OwnerInfo ownerInfoFromSearch) {
		
		UserDetailResponse userDetailResponse;
		
		ownerFromRequest.setId(ownerInfoFromSearch.getId());
		ownerFromRequest.setUuid(ownerInfoFromSearch.getUuid());
		addUserDefaultFields(property.getTenantId(), role, ownerFromRequest);

		StringBuilder uri = new StringBuilder(userHost).append(userContextPath).append(userUpdateEndpoint);
		userDetailResponse = userCall(new CreateUserRequest(requestInfo, ownerFromRequest), uri);
		if (userDetailResponse.getUser().get(0).getUuid() == null) {
			throw new CustomException("INVALID USER RESPONSE", "The user updated has uuid as null");
		}
		return userDetailResponse;
	}
    

    /**
     * creating multiple usersfor mutation request 
     * 
     * @param request
     */
    public void createUserForMutation (PropertyRequest request, Boolean isWorkflowStarting){
    	
        Property property = request.getProperty();
		RequestInfo requestInfo = request.getRequestInfo();
		Role role = getCitizenRole();
		List<OwnerInfo> owners = property.getOwners();

		for (OwnerInfo ownerFromRequest : owners) {

			if (ownerFromRequest.getUuid() != null && ownerFromRequest.getStatus().equals(Status.ACTIVE) && isWorkflowStarting)
				continue;

			addUserDefaultFields(property.getTenantId(), role, ownerFromRequest);
			UserDetailResponse userDetailResponse = userExists(ownerFromRequest, requestInfo);
			List<OwnerInfo> existingUsersFromService = userDetailResponse.getUser();
			Map<String, OwnerInfo> ownerMapFromSearch = existingUsersFromService.stream().collect(Collectors.toMap(OwnerInfo::getUuid, Function.identity()));

			if (CollectionUtils.isEmpty(existingUsersFromService)) {

				ownerFromRequest.setUserName(UUID.randomUUID().toString());
				userDetailResponse = createUser(requestInfo, ownerFromRequest);
				
			} else {

				String uuid = ownerFromRequest.getUuid();
				if (uuid != null && ownerMapFromSearch.containsKey(uuid)) {
					userDetailResponse = updateExistingUser(property, requestInfo, role, ownerFromRequest, ownerMapFromSearch.get(uuid));
				} else {

					ownerFromRequest.setUserName(UUID.randomUUID().toString());
					userDetailResponse = createUser(requestInfo, ownerFromRequest);
				}
			}
			// Assigns value of fields from user got from userDetailResponse to owner object
			setOwnerFields(ownerFromRequest, userDetailResponse, requestInfo);
		}
	}

    	private UserDetailResponse createUser(RequestInfo requestInfo, OwnerInfo owner) {
		UserDetailResponse userDetailResponse;
		StringBuilder uri = new StringBuilder(userHost).append(userContextPath).append(userCreateEndpoint);

		CreateUserRequest userRequest = CreateUserRequest.builder()
				.requestInfo(requestInfo)
				.user(owner)
				.build();

		userDetailResponse = userCall(userRequest, uri);
		
		if (ObjectUtils.isEmpty(userDetailResponse)) {

			throw new CustomException("INVALID USER RESPONSE",
					"The user create has failed for the mobileNumber : " + owner.getUserName());

		}
		return userDetailResponse;
	}


    /**
     * Sets the role,type,active and tenantId for a Citizen
     * @param tenantId TenantId of the property
     * @param role The role of the user set in this case to CITIZEN
     * @param owner The user whose fields are to be set
     */
    private void addUserDefaultFields(String tenantId,Role role, OwnerInfo owner){
    	
        owner.setActive(true);
        owner.setTenantId(tenantId);
        owner.setRoles(Collections.singletonList(role));
        owner.setType("CITIZEN");
        owner.setCreatedDate(null);
        owner.setCreatedBy(null );
        owner.setLastModifiedDate(null);
        owner.setLastModifiedBy(null );
    }

    private Role getCitizenRole() {
    	
		return Role.builder()
				.code("CITIZEN")
				.name("Citizen")
				.build();
	}

    /**
     * Searches if the owner is already created. Search is based on name of owner, uuid and mobileNumber
     * @param owner Owner which is to be searched
     * @param requestInfo RequestInfo from the propertyRequest
     * @return UserDetailResponse containing the user if present and the responseInfo
     */
	private UserDetailResponse userExists(OwnerInfo owner, RequestInfo requestInfo) {

		UserSearchRequest userSearchRequest = getBaseUserSearchRequest(owner.getTenantId(), requestInfo);
		userSearchRequest.setMobileNumber(owner.getMobileNumber());
		userSearchRequest.setUserType(owner.getType());
		userSearchRequest.setName(owner.getName());
		
        StringBuilder uri = new StringBuilder(userHost).append(userSearchEndpoint);
        return userCall(userSearchRequest,uri);
    }


    /**
     * Sets userName for the owner as mobileNumber if mobileNumber already assigned last 10 digits of currentTime is assigned as userName
     * @param owner owner whose username has to be assigned
     * @param listOfMobileNumber list of unique mobileNumbers in the propertyRequest
     */
    private void setUserName(OwnerInfo owner,Set<String> listOfMobileNumber){
    	
        if(listOfMobileNumber.contains(owner.getMobileNumber())){
            owner.setUserName(owner.getMobileNumber());
            // Once mobileNumber is set as userName it is removed from the list
            listOfMobileNumber.remove(owner.getMobileNumber());
        }
        else {
            String username = UUID.randomUUID().toString();
            owner.setUserName(username);
        }
    }

    /**
     * Fetches all the unique mobileNumbers from a propertyDetail
     * @param property whose unique mobileNumbers are needed to be fetched
     * @return list of all unique mobileNumbers in the given propertyDetail
     */
     private Set<String> getMobileNumbers(Property property,RequestInfo requestInfo,String tenantId){
    	 
		Set<String> listOfMobileNumbers = property.getOwners().stream().map(OwnerInfo::getMobileNumber)
				.collect(Collectors.toSet());
        StringBuilder uri = new StringBuilder(userHost).append(userSearchEndpoint);
        
        UserSearchRequest userSearchRequest = UserSearchRequest.builder()
        		.requestInfo(requestInfo)
        		.userType("CITIZEN")
				.tenantId(tenantId)
				.build();
        
        
        Set<String> availableMobileNumbers = new HashSet<>();

        listOfMobileNumbers.forEach(mobilenumber -> {
        	
            userSearchRequest.setUserName(mobilenumber);
            UserDetailResponse userDetailResponse =  userCall(userSearchRequest,uri);
            if(CollectionUtils.isEmpty(userDetailResponse.getUser()))
                availableMobileNumbers.add(mobilenumber);
        });
        return availableMobileNumbers;
    }

    /**
     * Returns user using user search based on propertyCriteria(owner name,mobileNumber,userName)
     * @param userSearchRequest
     * @return serDetailResponse containing the user if present and the responseInfo
     */
	public UserDetailResponse getUser(UserSearchRequest userSearchRequest) {

		StringBuilder uri = new StringBuilder(userHost).append(userSearchEndpoint);
		UserDetailResponse userDetailResponse = userCall(userSearchRequest, uri);
		return userDetailResponse;
	}

    /**
     * Returns UserDetailResponse by calling user service with given uri and object
     * @param userRequest Request object for user service
     * @param url The address of the endpoint
     * @return Response from user service as parsed as userDetailResponse
     */
    @SuppressWarnings("unchecked")
	private UserDetailResponse userCall(Object userRequest, StringBuilder url) {
    	
		String dobFormat = null;
		if (url.indexOf(userSearchEndpoint) != -1 || url.indexOf(userUpdateEndpoint) != -1)
			dobFormat = "yyyy-MM-dd";
		else if (url.indexOf(userCreateEndpoint) != -1)
			dobFormat = "dd/MM/yyyy";
		try {
        	Optional<Object> response = serviceRequestRepository.fetchResult(url, userRequest);
        	
        	if(response.isPresent()) {
        		LinkedHashMap<String, Object> responseMap = (LinkedHashMap<String, Object>)response.get();
                parseResponse(responseMap,dobFormat);
                UserDetailResponse userDetailResponse = mapper.convertValue(responseMap,UserDetailResponse.class);
                return userDetailResponse;
        	}else {
        		return new UserDetailResponse();
        	}
        }
        // Which Exception to throw?
        catch(IllegalArgumentException  e)
        {
            throw new CustomException("IllegalArgumentException","ObjectMapper not able to convertValue in userCall");
        }
    }


    /**
     * Parses date formats to long for all users in responseMap
     * @param responeMap LinkedHashMap got from user api response
     * @param dobFormat dob format (required because dob is returned in different format's in search and create response in user service)
     */
    @SuppressWarnings("unchecked")
	private void parseResponse(LinkedHashMap<String, Object> responeMap,String dobFormat) {
    	
        List<LinkedHashMap<String, Object>> users = (List<LinkedHashMap<String, Object>>)responeMap.get("user");
        String format1 = "dd-MM-yyyy HH:mm:ss";
        
        if(null != users) {
        	
            users.forEach( map -> {
            	
                        map.put("createdDate",dateTolong((String)map.get("createdDate"),format1));
                        if((String)map.get("lastModifiedDate")!=null)
                            map.put("lastModifiedDate",dateTolong((String)map.get("lastModifiedDate"),format1));
                        if((String)map.get("dob")!=null)
                            map.put("dob",dateTolong((String)map.get("dob"),dobFormat));
                        if((String)map.get("pwdExpiryDate")!=null)
                            map.put("pwdExpiryDate",dateTolong((String)map.get("pwdExpiryDate"),format1));
                    }
            );
        }
    }

    /**
     * Converts date to long
     * @param date date to be parsed
     * @param format Format of the date
     * @return Long value of date
     */
    private Long dateTolong(String date,String format){
        SimpleDateFormat f = new SimpleDateFormat(format);
        Date d = null;
        try {
            d = f.parse(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return  d.getTime();
    }

    /**
     * Sets owner fields (so that the owner table can be linked to user table)
     * @param owner Owner in the propertyDetail whose user is created
     * @param userDetailResponse userDetailResponse from the user Service corresponding to the given owner
     */
    private void setOwnerFields(OwnerInfo owner, UserDetailResponse userDetailResponse,RequestInfo requestInfo){
    	
        owner.setUuid(userDetailResponse.getUser().get(0).getUuid());
        owner.setId(userDetailResponse.getUser().get(0).getId());
        owner.setUserName((userDetailResponse.getUser().get(0).getUserName()));
        owner.setCreatedBy(requestInfo.getUserInfo().getUuid());
        owner.setCreatedDate(System.currentTimeMillis());
        owner.setLastModifiedBy(requestInfo.getUserInfo().getUuid());
        owner.setLastModifiedDate(System.currentTimeMillis());
        owner.setActive(userDetailResponse.getUser().get(0).getActive());
    }


    /**
     * Updates user if present else creates new user
     * @param request PropertyRequest received from update
     */
    public void updateUser(PropertyRequest request) {

		Property property = request.getProperty();
		RequestInfo requestInfo = request.getRequestInfo();

		property.getOwners().forEach(owner -> {

			UserDetailResponse userDetailResponse = userExists(owner, requestInfo);
			StringBuilder uri = new StringBuilder(userHost);
			
			if (CollectionUtils.isEmpty(userDetailResponse.getUser())) {
				uri = uri.append(userContextPath).append(userCreateEndpoint);
			} else {
				owner.setId(userDetailResponse.getUser().get(0).getId());
				uri = uri.append(userContextPath).append(owner.getId()).append(userUpdateEndpoint);
			}
			userDetailResponse = userCall(new CreateUserRequest(requestInfo, owner), uri);
			setOwnerFields(owner, userDetailResponse, requestInfo);
		});
	}

    /**
     * provides a user search request with basic mandatory parameters
     * 
     * @param tenantId
     * @param requestInfo
     * @return
     */
    public UserSearchRequest getBaseUserSearchRequest(String tenantId, RequestInfo requestInfo) {
    	
		return UserSearchRequest.builder()
				.requestInfo(requestInfo)
				.userType("CITIZEN")
				.tenantId(tenantId)
				.active(true)
				.build();
    }


	public Set<OwnerInfo>  getUUidFromUserName(Property property){

		String tenantId = property.getTenantId();
		List<OwnerInfo> ownerInfos = property.getOwners();

		Set<String> mobileNumbers = new HashSet<>();

		// Get all unique mobileNumbers in the license
		ownerInfos.forEach(owner -> {
			mobileNumbers.add(owner.getMobileNumber());
		});

		Set<OwnerInfo>  userSet = new HashSet<>();

		// For every unique mobilenumber search the use with mobilenumber as username and get uuid
		mobileNumbers.forEach(mobileNumber -> {
			UserDetailResponse userDetailResponse = searchByUserName(mobileNumber, getStateLevelTenant(tenantId));
			if(!CollectionUtils.isEmpty(userDetailResponse.getUser())){
				userSet.add(userDetailResponse.getUser().get(0));
			}
		});

		return userSet;
	}

	private UserDetailResponse searchByUserName(String userName,String tenantId){
		UserSearchRequest userSearchRequest = new UserSearchRequest();
		userSearchRequest.setUserType("CITIZEN");
		userSearchRequest.setUserName(userName);
		userSearchRequest.setTenantId(tenantId);
		return getUser(userSearchRequest);
	}

	private String getStateLevelTenant(String tenantId){
		return tenantId.split("\\.")[0];
	}
	
    public void createUserForAlternateNumber(PropertyRequest request){
    
        Property property = request.getProperty();
		RequestInfo requestInfo = request.getRequestInfo();
		Role role = getCitizenRole();

		List <OwnerInfo> owners = property.getOwners();

		for (OwnerInfo owner: owners) {
			OwnerInfo ownerFromRequest = new OwnerInfo();

			ownerFromRequest.setUuid(owner.getUuid());
			ownerFromRequest.setName(owner.getName());
			ownerFromRequest.setMobileNumber(owner.getMobileNumber());

			addUserDefaultFields(property.getTenantId(), role, ownerFromRequest);
			UserDetailResponse userDetailResponse = userExists(ownerFromRequest, requestInfo);
			List<OwnerInfo> existingUsersFromService = userDetailResponse.getUser();

			if (CollectionUtils.isEmpty(existingUsersFromService)) {

				throw new CustomException("USER DOES NOT EXIST", "The owner to be updated does not exist");
				
			} 
			
			for (OwnerInfo existingUser : existingUsersFromService) {
				if(existingUser.getUuid().equals(ownerFromRequest.getUuid())) {
					ownerFromRequest.setAlternatemobilenumber(owner.getAlternatemobilenumber());
					userDetailResponse = updateExistingUser(property, requestInfo, role, ownerFromRequest, existingUser);
					break;
				}
			}

			// Assigns value of fields from user got from userDetailResponse to owner object
			setOwnerFields(ownerFromRequest, userDetailResponse, requestInfo);
		}
	}

    /*
		Method to update user mobile number
	*/
    
	public void updateUserMobileNumber(PropertyRequest request,Map <String, String> uuidToMobileNumber) {
		
		Property property = request.getProperty();
		RequestInfo requestInfo = request.getRequestInfo();

		property.getOwners().forEach(owner -> {

			UserDetailResponse userDetailResponse = searchedSingleUserExists(owner, requestInfo);
			StringBuilder uri = new StringBuilder(userHost);
			 
				owner.setId(userDetailResponse.getUser().get(0).getId());
				uri = uri.append(userContextPath).append(userUpdateEndpoint);
			
			userDetailResponse = userCall(new CreateUserRequest(requestInfo, owner), uri);
			setOwnerFields(owner, userDetailResponse, requestInfo);
		});
				
	}
	
	/*
	 	Method to check if the searched user exists
	*/

	private UserDetailResponse searchedSingleUserExists(OwnerInfo owner, RequestInfo requestInfo) {
		
		UserSearchRequest userSearchRequest = getBaseUserSearchRequest(owner.getTenantId(), requestInfo);
		userSearchRequest.setUserType(owner.getType());
		Set <String> uuids = new HashSet<String>();
		uuids.add(owner.getUuid());
		userSearchRequest.setUuid(uuids);
		
        StringBuilder uri = new StringBuilder(userHost).append(userSearchEndpoint);
        return userCall(userSearchRequest,uri);
	}

}
