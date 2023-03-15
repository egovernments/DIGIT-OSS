package egov.casemanagement.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import egov.casemanagement.config.Configuration;
import egov.casemanagement.models.user.CreateUserRequest;
import egov.casemanagement.models.user.User;
import egov.casemanagement.models.user.UserDetailResponse;
import egov.casemanagement.models.user.UserSearchRequest;
import egov.casemanagement.repository.ServiceRequestRepository;
import egov.casemanagement.web.models.*;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;


@Slf4j
@Service
public class UserService {


    private ObjectMapper mapper;
    private ServiceRequestRepository serviceRequestRepository;
    private Configuration config;


    @Autowired
    public UserService(ObjectMapper mapper, ServiceRequestRepository serviceRequestRepository, Configuration configuration) {
        this.mapper = mapper;
        this.serviceRequestRepository = serviceRequestRepository;
        this.config = configuration;
    }



    User createCovaUser(RequestInfo requestInfo, String mobile) {
            User user = new User();
            Role role = getCitizenRole();

            user.setMobileNumber(mobile);
            user.setName(getUsername(mobile));
            user.setActive(false);
            user.setTenantId(config.getRootTenantId());
            user.setRoles(Collections.singletonList(role));
            user.setType("CITIZEN");
            user.setUserName(getUsername(mobile));
            user.setPermanentCity(config.getRootTenantId());

            //  UserDetailResponse userDetailResponse = userExists(owner,requestInfo);
            StringBuilder uri = new StringBuilder(config.getUserHost())
                    .append(config.getUserContextPath())
                    .append(config.getUserCreateEndpoint());

            UserDetailResponse userDetailResponse = userCall(new CreateUserRequest(requestInfo, user), uri);

            if(userDetailResponse.getUser() !=null && !userDetailResponse.getUser().isEmpty())
                return userDetailResponse.getUser().get(0);
            else
                return null;

    }

    /**
     * Creates users with uuid as username if uuid is already present for the user
     * in the request then the user is updated
     *
     * @param request TradeLciense create or update request
     */

    void createUser(CaseCreateRequest request) {
        ModelCase modelCase = request.get_case();
        RequestInfo requestInfo = request.getRequestInfo();


        User user = getUser(modelCase);
        //  UserDetailResponse userDetailResponse = userExists(owner,requestInfo);
        StringBuilder uri = new StringBuilder(config.getUserHost())
                .append(config.getUserContextPath())
                .append(config.getUserCreateEndpoint());

        UserDetailResponse userDetailResponse = userCall(new CreateUserRequest(requestInfo, user), uri);
        if (userDetailResponse.getUser().get(0).getUuid() == null) {
            throw new CustomException("INVALID USER RESPONSE", "The user created has uuid as null");
        }

        modelCase.setUserUuid(userDetailResponse.getUser().get(0).getUuid());
    }

    public UserDetailResponse getUserDetailsFromUuid(String userUuid) {
        UserSearchRequest userSearchRequest = new UserSearchRequest();
        userSearchRequest.setTenantId(config.getRootTenantId());
        userSearchRequest.setRequestInfo(RequestInfo.builder().build());
        userSearchRequest.setUuid(Collections.singletonList(userUuid));
        StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
        return userCall(userSearchRequest, uri);
    }

    public void createEmployee(EmployeeCreateRequest employeeCreateRequest) {
        RequestInfo requestInfo = employeeCreateRequest.getRequestInfo();
        Employee employee = employeeCreateRequest.getEmployee();

        User user = new User();

        user.setEmailId(employee.getEmailId());
        user.setUserName(employee.getEmailId());
        user.setTenantId(employee.getTenantId());
        user.setPermanentCity(employee.getTenantId());
        user.setName(employee.getName());
        user.setActive(false);
        user.setType("EMPLOYEE");
        user.setMobileNumber("9191919191");

        List<Role> roles = new ArrayList<>();
        for(String employeeRole : employee.getRoles()) {
            Role role = new Role();
            role.setCode(employeeRole);
            roles.add(role);
        }
        user.setRoles(roles);

        StringBuilder uri = new StringBuilder(config.getUserHost())
                .append(config.getUserContextPath())
                .append(config.getUserCreateEndpoint());

        UserDetailResponse userDetailResponse = userCall(new CreateUserRequest(requestInfo, user), uri);
        if (userDetailResponse.getUser().get(0).getUuid() == null) {
            throw new CustomException("INVALID USER RESPONSE", "The user created has uuid as null");
        }
    }



    /**
     * Sets the immutable fields from search to update request
     *
     * @param user                 The user to be updated
     * @param userFromSearchResult The current user details according to searcvh
     */
    private void addNonUpdatableFields(User user, User userFromSearchResult) {
        user.setUserName(userFromSearchResult.getUserName());
        user.setId(userFromSearchResult.getId());
        user.setActive(userFromSearchResult.getActive());
        user.setPassword(userFromSearchResult.getPassword());
    }


    /**
     * Checks if the user exists in the database
     *
     * @param mobileNumber       The owner from the tradeLicense
     * @param requestInfo The requestInfo of the request
     * @return The search response from the user service
     */
    public boolean userExists(String mobileNumber, RequestInfo requestInfo) {
        UserSearchRequest userSearchRequest = new UserSearchRequest();
        userSearchRequest.setTenantId(config.getRootTenantId());
        userSearchRequest.setRequestInfo(requestInfo);
        userSearchRequest.setActive(false);
        userSearchRequest.setUserType("CITIZEN");
        userSearchRequest.setUserName(getUsername(mobileNumber));
        StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
        UserDetailResponse userDetailResponse =  userCall(userSearchRequest, uri);
        return !userDetailResponse.getUser().isEmpty();
    }

    private String getUsername(String mobileNumber) {
        return config.getUsernamePrefix() + "-" + mobileNumber;

    }


    public Set<String> removeExistingUsers(Set<String> mobileNumbers, RequestInfo requestInfo) {

        StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
        UserSearchRequest userSearchRequest = new UserSearchRequest();
        userSearchRequest.setRequestInfo(requestInfo);
        userSearchRequest.setTenantId(config.getRootTenantId());
        userSearchRequest.setUserType("CITIZEN");
        Set<String> availableMobileNumbers = new HashSet<>();

        mobileNumbers.forEach(mobilenumber -> {
            userSearchRequest.setUserName(getUsername(mobilenumber));
            UserDetailResponse userDetailResponse = userCall(userSearchRequest, uri);
            if (CollectionUtils.isEmpty(userDetailResponse.getUser()))
                availableMobileNumbers.add(mobilenumber);
        });
        return availableMobileNumbers;
    }


    /**
     * Sets ownerfields from the userResponse
     *
     * @param user               The owner from tradeLicense
     * @param userDetailResponse The response from user search
     * @param requestInfo        The requestInfo of the request
     */
    private void setOwnerFields(User user, UserDetailResponse userDetailResponse, RequestInfo requestInfo) {
        user.setUuid(userDetailResponse.getUser().get(0).getUuid());
        user.setId(userDetailResponse.getUser().get(0).getId());
        user.setUserName((userDetailResponse.getUser().get(0).getUserName()));
        user.setCreatedBy(requestInfo.getUserInfo().getUuid());
        user.setCreatedDate(System.currentTimeMillis());
        user.setLastModifiedBy(requestInfo.getUserInfo().getUuid());
        user.setLastModifiedDate(System.currentTimeMillis());
        user.setActive(userDetailResponse.getUser().get(0).getActive());
    }



    private User getUser(ModelCase modelCase) {
        User user = new User();
        Role role = getCitizenRole();

        user.setMobileNumber(modelCase.getMobileNumber());
        user.setName(modelCase.getName());
        user.setActive(false);
        user.setTenantId(config.getRootTenantId());
        user.setRoles(Collections.singletonList(role));
        user.setType("CITIZEN");
        user.setUserName(modelCase.getCaseId());
        user.setPermanentCity(modelCase.getTenantId());
//        setUserName(user);

        return user;
    }


    /**
     * Creates citizen role
     *
     * @return Role object for citizen
     */
    private Role getCitizenRole() {
        Role role = new Role();
        role.setCode("CITIZEN");
        role.setName("Citizen");
        return role;
    }


    /**
     * Returns UserDetailResponse by calling user service with given uri and object
     *
     * @param userRequest Request object for user service
     * @param uri         The address of the endpoint
     * @return Response from user service as parsed as userDetailResponse
     */
    private UserDetailResponse userCall(Object userRequest, StringBuilder uri) {
        String dobFormat = null;
        if (uri.toString().contains(config.getUserSearchEndpoint()) || uri.toString().contains(config.getUserUpdateEndpoint()))
            dobFormat = "yyyy-MM-dd";
        else if (uri.toString().contains(config.getUserCreateEndpoint()))
            dobFormat = "dd/MM/yyyy";
        try {
            LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri.toString(), userRequest);
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
     * @param responeMap LinkedHashMap got from user api response
     */
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
                    }
            );
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
     * Call search in user service based on ownerids from criteria
     *
     * @param criteria    The search criteria containing the ownerids
     * @param requestInfo The requestInfo of the request
     * @return Search response from user service based on ownerIds
     */
    public UserDetailResponse getUser(CaseSearchRequest criteria, RequestInfo requestInfo) {
        UserSearchRequest userSearchRequest = getUserSearchRequest(criteria, requestInfo);
        StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
        UserDetailResponse userDetailResponse = userCall(userSearchRequest, uri);
        return userDetailResponse;
    }


    /**
     * Creates userSearchRequest from tradeLicenseSearchCriteria
     *
     * @param criteria    The tradeLcienseSearch criteria
     * @param requestInfo The requestInfo of the request
     * @return The UserSearchRequest based on ownerIds
     */
    private UserSearchRequest getUserSearchRequest(CaseSearchRequest criteria, RequestInfo requestInfo) {
        UserSearchRequest userSearchRequest = new UserSearchRequest();
        userSearchRequest.setUuid(criteria.getUserUuids() == null ? null : new ArrayList<>(criteria.getUserUuids()));
        userSearchRequest.setRequestInfo(requestInfo);
        userSearchRequest.setTenantId(config.getRootTenantId());
        userSearchRequest.setMobileNumber(criteria.getMobileNumber());
        userSearchRequest.setActive(false);
        userSearchRequest.setUserType("CITIZEN");

        return userSearchRequest;
    }


    private UserDetailResponse searchByUserName(String userName, String tenantId) {
        UserSearchRequest userSearchRequest = new UserSearchRequest();
        userSearchRequest.setUserType("CITIZEN");
        userSearchRequest.setUserName(userName);
        userSearchRequest.setTenantId(config.getRootTenantId());
        StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
        return userCall(userSearchRequest, uri);

    }


//    public void updateUser(CaseCreateRequest request) {
//        List<TradeLicense> licenses = request.getLicenses();
//        RequestInfo requestInfo = request.getRequestInfo();
//        UserDetailResponse userDetailResponse = isUserUpdatable(owner, requestInfo);
//        OwnerInfo user = new OwnerInfo();
//        StringBuilder uri = new StringBuilder(config.getUserHost());
//        if (CollectionUtils.isEmpty(userDetailResponse.getUser())) {
//            uri = uri.append(config.getUserContextPath()).append(config.getUserCreateEndpoint());
//            user.addUserWithoutAuditDetail(owner);
//            user.setUserName(owner.getMobileNumber());
//        } else {
//            owner.setUuid(userDetailResponse.getUser().get(0).getUuid());
//            uri = uri.append(config.getUserContextPath()).append(config.getUserUpdateEndpoint());
//            user.addUserWithoutAuditDetail(owner);
//        }
//        userDetailResponse = userCall(new CreateUserRequest(requestInfo, user), uri);
//        setOwnerFields(owner, userDetailResponse, requestInfo);
//    }


    private UserDetailResponse isUserUpdatable(User owner, RequestInfo requestInfo) {
        UserSearchRequest userSearchRequest = new UserSearchRequest();
        userSearchRequest.setTenantId(config.getRootTenantId());
        userSearchRequest.setMobileNumber(owner.getMobileNumber());
        userSearchRequest.setUuid(Collections.singletonList(owner.getUuid()));
        userSearchRequest.setRequestInfo(requestInfo);
        userSearchRequest.setActive(false);
        userSearchRequest.setUserType(owner.getType());
        StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
        return userCall(userSearchRequest, uri);
    }


}
