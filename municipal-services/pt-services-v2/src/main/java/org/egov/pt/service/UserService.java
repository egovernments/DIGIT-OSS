package org.egov.pt.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.web.models.*;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Slf4j
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
        List<Property> properties = request.getProperties();
        RequestInfo requestInfo = request.getRequestInfo();
        Role role = getCitizenRole();
        properties.forEach(property -> {
            property.getPropertyDetails().forEach(propertyDetail -> {
                // Fetches the unique mobileNumbers from all the owners
                Set<String> listOfMobileNumbers = getMobileNumbers(propertyDetail,requestInfo,property.getTenantId());
                propertyDetail.getOwners().forEach(owner -> {
                        addUserDefaultFields(property.getTenantId(),role,owner);
                        // Checks if the user is already present based on name of the owner and mobileNumber
                        UserDetailResponse userDetailResponse = userExists(owner,requestInfo);
                        // If user not present new user is created
                        if(CollectionUtils.isEmpty(userDetailResponse.getUser()))
                        {   /* Sets userName equal to mobileNumber if mobileNumber already assigned as username
                          random number is assigned as username */
                            StringBuilder uri = new StringBuilder(userHost).append(userContextPath).append(userCreateEndpoint);
                            setUserName(owner,listOfMobileNumbers);

                            userDetailResponse = userCall(new CreateUserRequest(requestInfo,owner),uri);
                            if(userDetailResponse.getUser().get(0).getUuid()==null){
                                throw new CustomException("INVALID USER RESPONSE","The user created has uuid as null");
                            }
                        }
                        else
                        {
                          owner.setId(userDetailResponse.getUser().get(0).getId());
                          owner.setUuid(userDetailResponse.getUser().get(0).getUuid());
                          addUserDefaultFields(property.getTenantId(),role,owner);

                          StringBuilder uri = new StringBuilder(userHost).append(userContextPath)
                                              .append(userUpdateEndpoint);
                          userDetailResponse = userCall( new CreateUserRequest(requestInfo,owner),uri);
                            if(userDetailResponse.getUser().get(0).getUuid()==null){
                                throw new CustomException("INVALID USER RESPONSE","The user updated has uuid as null");
                            }
                        }
                        // Assigns value of fields from user got from userDetailResponse to owner object
                        setOwnerFields(owner,userDetailResponse,requestInfo);
                });
            });
        });
    }


    /**
     * Sets the role,type,active and tenantId for a Citizen
     * @param tenantId TenantId of the property
     * @param role The role of the user set in this case to CITIZEN
     * @param owner The user whose fields are to be set
     */
    private void addUserDefaultFields(String tenantId,Role role,OwnerInfo owner){
        owner.setActive(true);
        owner.setTenantId(tenantId.split("\\.")[0]);
        owner.setRoles(Collections.singletonList(role));
        owner.setType("CITIZEN");
        owner.setCreatedDate(null);
        owner.setCreatedBy(null );
        owner.setLastModifiedDate(null);
        owner.setLastModifiedBy(null );
    }

    private Role getCitizenRole(){
        Role role = new Role();
        role.setCode("CITIZEN");
        role.setName("Citizen");
        return role;
    }

    /**
     * Searches if the owner is already created. Search is based on name of owner, uuid and mobileNumber
     * @param owner Owner which is to be searched
     * @param requestInfo RequestInfo from the propertyRequest
     * @return UserDetailResponse containing the user if present and the responseInfo
     */
    private UserDetailResponse userExists(OwnerInfo owner,RequestInfo requestInfo){
        UserSearchRequest userSearchRequest =new UserSearchRequest();
        userSearchRequest.setTenantId(owner.getTenantId());
        userSearchRequest.setMobileNumber(owner.getMobileNumber());
        userSearchRequest.setName(owner.getName());
        userSearchRequest.setRequestInfo(requestInfo);
        userSearchRequest.setActive(true);
        userSearchRequest.setUserType(owner.getType());
        /*if(owner.getUuid()!=null)
            userSearchRequest.setUuid(Collections.singletonList(owner.getUuid()));*/
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
     * @param propertyDetail whose unique mobileNumbers are needed to be fetched
     * @return list of all unique mobileNumbers in the given propertyDetail
     */
     private Set<String> getMobileNumbers(PropertyDetail propertyDetail,RequestInfo requestInfo,String tenantId){
        Set<String> listOfMobileNumbers = new HashSet<>();
        propertyDetail.getOwners().forEach(owner -> {listOfMobileNumbers.add(owner.getMobileNumber());});
        StringBuilder uri = new StringBuilder(userHost).append(userSearchEndpoint);
        UserSearchRequest userSearchRequest = new UserSearchRequest();
        userSearchRequest.setRequestInfo(requestInfo);
        userSearchRequest.setTenantId(tenantId);
        // Should this be hardcoded?
        userSearchRequest.setUserType("CITIZEN");
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
     * @param criteria
     * @param requestInfo
     * @return serDetailResponse containing the user if present and the responseInfo
     */
    public UserDetailResponse getUser(PropertyCriteria criteria,RequestInfo requestInfo){
        UserSearchRequest userSearchRequest = getUserSearchRequest(criteria,requestInfo);
        StringBuilder uri = new StringBuilder(userHost).append(userSearchEndpoint);
        UserDetailResponse userDetailResponse = userCall(userSearchRequest,uri);
        return userDetailResponse;
    }

    /**
     * Returns UserDetailResponse by calling user service with given uri and object
     * @param userRequest Request object for user service
     * @param uri The address of the endpoint
     * @return Response from user service as parsed as userDetailResponse
     */
    private UserDetailResponse userCall(Object userRequest, StringBuilder uri) {
        String dobFormat = null;
        if(uri.toString().contains(userSearchEndpoint) || uri.toString().contains(userUpdateEndpoint))
            dobFormat="yyyy-MM-dd";
        else if(uri.toString().contains(userCreateEndpoint))
            dobFormat = "dd/MM/yyyy";
        try{
            LinkedHashMap responseMap = (LinkedHashMap)serviceRequestRepository.fetchResult(uri, userRequest);
            parseResponse(responseMap,dobFormat);
            UserDetailResponse userDetailResponse = mapper.convertValue(responseMap,UserDetailResponse.class);
            return userDetailResponse;
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
    private void parseResponse(LinkedHashMap responeMap,String dobFormat){
        List<LinkedHashMap> users = (List<LinkedHashMap>)responeMap.get("user");
        String format1 = "dd-MM-yyyy HH:mm:ss";
        if(users!=null){
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
     * Creates and Returns UserSearchRequest from the propertyCriteria(Creates UserSearchRequest from values related to owner(i.e mobileNumber and name) from propertyCriteria )
     * @param criteria PropertyCriteria from which UserSearchRequest is to be created
     * @param requestInfo RequestInfo of the propertyRequest
     * @return UserSearchRequest created from propertyCriteria
     */
    private UserSearchRequest getUserSearchRequest(PropertyCriteria criteria,RequestInfo requestInfo){
        UserSearchRequest userSearchRequest = new UserSearchRequest();
        Set<String> userIds = criteria.getOwnerids();
        if(!CollectionUtils.isEmpty(userIds))
            userSearchRequest.setUuid( new ArrayList(userIds));
        userSearchRequest.setRequestInfo(requestInfo);
        userSearchRequest.setTenantId(criteria.getTenantId());
        userSearchRequest.setMobileNumber(criteria.getMobileNumber());
        userSearchRequest.setName(criteria.getName());
        userSearchRequest.setActive(true);
        userSearchRequest.setUserType("CITIZEN");
        return userSearchRequest;
    }


    /**
     * Updates user if present else creates new user
     * @param request PropertyRequest received from update
     */
    public void updateUser(PropertyRequest request){
        List<Property> properties = request.getProperties();
        RequestInfo requestInfo = request.getRequestInfo();
        properties.forEach(property -> {
            property.getPropertyDetails().forEach(propertyDetail -> {
                propertyDetail.getOwners().forEach(owner -> {
                    UserDetailResponse userDetailResponse = userExists(owner,requestInfo);
                    StringBuilder uri  = new StringBuilder(userHost);
                    if(CollectionUtils.isEmpty(userDetailResponse.getUser())) {
                        uri = uri.append(userContextPath).append(userCreateEndpoint);
                    }
                    else
                    { owner.setId(userDetailResponse.getUser().get(0).getId());
                        uri=uri.append(userContextPath).append(owner.getId()).append(userUpdateEndpoint);
                    }
                    userDetailResponse = userCall( new CreateUserRequest(requestInfo,owner),uri);
                    setOwnerFields(owner,userDetailResponse,requestInfo);
                });
            });
        });
    }

    /**
     * Creates citizenInfo if employee is creating assessment in case of user the citizenInfo object is pointed to userinfo from requestInfo
     * @param request PropertyRequest for the assessment
     */
    public void createCitizen(PropertyRequest request){
        StringBuilder uriCreate = new StringBuilder(userHost).append(userContextPath).append(userCreateEndpoint);
        RequestInfo requestInfo = request.getRequestInfo();

        Role role = getCitizenRole();
        // If user is creating assessment, userInfo object from requestInfo is assigned as citizenInfo
        if(requestInfo.getUserInfo().getType().equalsIgnoreCase("CITIZEN"))
        {   request.getProperties().forEach(property -> {
            property.getPropertyDetails().forEach(propertyDetail -> {
                propertyDetail.setCitizenInfo(new OwnerInfo(requestInfo.getUserInfo()));
                log.debug("userInfo---> "+requestInfo.getUserInfo().toString());
            });
        });
        }
        else{
            // In case of employee login it checks if the citizenInfo object is present else it creates it
            request.getProperties().forEach(property -> {
                property.getPropertyDetails().forEach(propertyDetail -> {
                    addUserDefaultFields(property.getTenantId(),role,propertyDetail.getCitizenInfo());
                    // Send MobileNumber as the userName in search
                    String userName = null;
                    if(!StringUtils.isEmpty(propertyDetail.getCitizenInfo().getMobileNumber()))
                        userName = propertyDetail.getCitizenInfo().getMobileNumber();
                    else if(propertyDetail.getCitizenInfo().getUserName()!=null &&
                               propertyDetail.getOwnershipCategory().contains("INSTITUTIONAL"))
                        userName = propertyDetail.getCitizenInfo().getUserName();
                    else throw new CustomException("INVALID CITIZENINFO","Both mobileNumber and altContactNumber cannot be null");

                    UserDetailResponse userDetailResponse = searchByUserName(userName,propertyDetail.getCitizenInfo().getTenantId());
                    // If user not present new user is created
                    if(CollectionUtils.isEmpty(userDetailResponse.getUser()))
                    {
                        propertyDetail.getCitizenInfo().setUserName(propertyDetail.getCitizenInfo().getMobileNumber());
                        userDetailResponse = userCall(new CreateUserRequest(requestInfo,propertyDetail.getCitizenInfo()),uriCreate);
                        log.info("citizen created --> "+userDetailResponse.getUser().get(0).getUuid());
                    }
                    propertyDetail.setCitizenInfo(userDetailResponse.getUser().get(0));
                    if(userDetailResponse.getUser().get(0).getUuid()==null){
                        throw new CustomException("INVALID CITIZENINFO","CitizenInfo cannot have uuid equal to null");
                    }
                });
            });
        }

    }

    private UserDetailResponse searchByUserName(String userName,String tenantId){
        UserSearchRequest userSearchRequest = new UserSearchRequest();
        userSearchRequest.setUserType("CITIZEN");
        userSearchRequest.setUserName(userName);
        userSearchRequest.setTenantId(tenantId);
        StringBuilder uri = new StringBuilder(userHost).append(userSearchEndpoint);
        return userCall(userSearchRequest,uri);

    }



}
