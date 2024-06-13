package digit.service;

import digit.config.VTRConfiguration;
import digit.utils.UserUtil;
import digit.web.models.*;
import digit.web.models.coremodels.CreateUserRequest;
import digit.web.models.coremodels.UserDetailResponse;
import digit.web.models.coremodels.UserSearchRequest;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class UserService {
    private UserUtil userUtils;

    private VTRConfiguration config;

    @Autowired
    public UserService(UserUtil userUtils, VTRConfiguration config) {
        this.userUtils = userUtils;
        this.config = config;
    }

    /**
     * Calls user service to enrich user from search or upsert user
     * @param request
     */
    public void callUserService(VoterRegistrationRequest request){
        request.getVoterRegistrationApplications().forEach(application -> {
            if(!StringUtils.isEmpty(application.getApplicant().getId()))
                enrichUser(application, request.getRequestInfo());
            else
                upsertUser(application, request.getRequestInfo());
        });
    }

    private void upsertUser(VoterRegistrationApplication application, RequestInfo requestInfo){
        Applicant applicant = application.getApplicant();
        User user = User.builder().userName(applicant.getUserName())
                                    .password(applicant.getPassword())
                                    .salutation(applicant.getSalutation())
                                    .name(applicant.getName())
                                    .gender(applicant.getGender())
                                    .mobileNumber(applicant.getMobileNumber())
                                    .emailId(applicant.getEmailId())
                                    .altContactNumber(applicant.getAltContactNumber())
                                    .pan(applicant.getPan())
                                    .permanentAddress(applicant.getPermanentAddress())
                                    .permanentCity(applicant.getPermanentCity())
                                    .permanentPincode(applicant.getPermanentPincode())
                                    .correspondenceCity(applicant.getCorrespondenceCity())
                                    .correspondencePincode(applicant.getCorrespondencePincode())
                                    .correspondenceAddress(applicant.getCorrespondenceAddress())
                                    .active(applicant.getActive())
                                    .locale(applicant.getLocale())
                                    .signature(applicant.getSignature())
                                    .accountLocked(applicant.getAccountLocked())
                                    .fatherOrHusbandName(applicant.getFatherOrHusbandName())
                                    .bloodGroup(applicant.getBloodGroup())
                                    .identificationMark(applicant.getIdentificationMark())
                                    .photo(applicant.getPhoto())
                                    .otpReference(applicant.getOtpReference())
                                    .tenantId(applicant.getTenantId())
                                    .type(applicant.getType())
                                    .roles(applicant.getRoles())
                                    .tenantId(applicant.getTenantId())
                                    .aadhaarNumber(applicant.getAadhaarNumber())
                                    .build();
        String tenantId = applicant.getTenantId();
        User userServiceResponse = null;

        // Search on mobile number as user name
        UserDetailResponse userDetailResponse = searchUser(userUtils.getStateLevelTenant(tenantId),null, user.getMobileNumber());
        if (!userDetailResponse.getUser().isEmpty()) {
            User userFromSearch = userDetailResponse.getUser().get(0);
            if(!user.getName().equalsIgnoreCase(userFromSearch.getName())){
                userServiceResponse = updateUser(requestInfo,user,userFromSearch);
            }
            else userServiceResponse = userDetailResponse.getUser().get(0);
        }
        else {
            userServiceResponse = createUser(requestInfo,tenantId,user);
        }

        // Enrich the accountId
        applicant.setId(userServiceResponse.getUuid());
    }


    private void enrichUser(VoterRegistrationApplication application, RequestInfo requestInfo){

        String accountId = application.getApplicant().getId();
        String tenantId = application.getApplicant().getTenantId();

        UserDetailResponse userDetailResponse = searchUser(userUtils.getStateLevelTenant(tenantId),accountId,null);

        if(userDetailResponse.getUser().isEmpty())
            throw new CustomException("INVALID_ACCOUNTID","No user exist for the given accountId");

        else application.getApplicant().setId(userDetailResponse.getUser().get(0).getUuid());

    }

    /**
     * Creates the user from the given userInfo by calling user service
     * @param requestInfo
     * @param tenantId
     * @param userInfo
     * @return
     */
    private User createUser(RequestInfo requestInfo,String tenantId, User userInfo) {

        userUtils.addUserDefaultFields(userInfo.getMobileNumber(),tenantId, userInfo);
        StringBuilder uri = new StringBuilder(config.getUserHost())
                .append(config.getUserContextPath())
                .append(config.getUserCreateEndpoint());


        UserDetailResponse userDetailResponse = userUtils.userCall(new CreateUserRequest(requestInfo, userInfo), uri);

        return userDetailResponse.getUser().get(0);

    }

    /**
     * Updates the given user by calling user service
     * @param requestInfo
     * @param user
     * @param userFromSearch
     * @return
     */
    private User updateUser(RequestInfo requestInfo,User user,User userFromSearch) {

        userFromSearch.setName(user.getName());
        userFromSearch.setActive(true);

        StringBuilder uri = new StringBuilder(config.getUserHost())
                .append(config.getUserContextPath())
                .append(config.getUserUpdateEndpoint());


        UserDetailResponse userDetailResponse = userUtils.userCall(new CreateUserRequest(requestInfo, userFromSearch), uri);

        return userDetailResponse.getUser().get(0);

    }

    /**
     * calls the user search API based on the given accountId and userName
     * @param stateLevelTenant
     * @param accountId
     * @param userName
     * @return
     */
    private UserDetailResponse searchUser(String stateLevelTenant, String accountId, String userName){

        UserSearchRequest userSearchRequest =new UserSearchRequest();
        userSearchRequest.setActive(true);
        userSearchRequest.setUserType("CITIZEN");
        userSearchRequest.setTenantId(stateLevelTenant);

        if(StringUtils.isEmpty(accountId) && StringUtils.isEmpty(userName))
            return null;

        if(!StringUtils.isEmpty(accountId))
            userSearchRequest.setUuid(Collections.singletonList(accountId));

        if(!StringUtils.isEmpty(userName))
            userSearchRequest.setUserName(userName);

        StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
        return userUtils.userCall(userSearchRequest,uri);

    }

    /**
     * calls the user search API based on the given list of user uuids
     * @param uuids
     * @return
     */
    private Map<String,User> searchBulkUser(List<String> uuids){

        UserSearchRequest userSearchRequest =new UserSearchRequest();
        userSearchRequest.setActive(true);
        userSearchRequest.setUserType("CITIZEN");


        if(!CollectionUtils.isEmpty(uuids))
            userSearchRequest.setUuid(uuids);


        StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
        UserDetailResponse userDetailResponse = userUtils.userCall(userSearchRequest,uri);
        List<User> users = userDetailResponse.getUser();

        if(CollectionUtils.isEmpty(users))
            throw new CustomException("USER_NOT_FOUND","No user found for the uuids");

        Map<String,User> idToUserMap = users.stream().collect(Collectors.toMap(User::getUuid, Function.identity()));

        return idToUserMap;
    }

}
