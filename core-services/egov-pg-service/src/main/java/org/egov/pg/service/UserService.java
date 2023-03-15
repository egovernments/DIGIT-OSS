package org.egov.pg.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.pg.config.AppProperties;
import org.egov.pg.models.Transaction;
import org.egov.pg.repository.ServiceCallRepository;
import org.egov.pg.web.models.TransactionRequest;
import org.egov.pg.web.models.User;
import org.egov.pg.web.models.UserResponse;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.util.*;

import static java.util.Objects.isNull;
import static org.egov.pg.constants.PgConstants.*;
import static org.springframework.util.StringUtils.isEmpty;

@Service
@Slf4j
public class UserService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private AppProperties appProperties;


    @Autowired
    private MultiStateInstanceUtil centralInstanceUtil;


    private String internalMicroserviceRoleUuid = null;

    private Long internalMicroserviceRoleUserid = null;


    @PostConstruct
    void initalizeSystemuser(){
        RequestInfo requestInfo = new RequestInfo();
        StringBuilder uri = new StringBuilder();
        UserResponse userResponse = null;
        uri.append(appProperties.getUserServiceHost()).append(appProperties.getUserServiceSearchPath()); // URL for user search call
        Map<String, Object> userSearchRequest = new HashMap<>();
        userSearchRequest.put("RequestInfo", requestInfo);
        userSearchRequest.put("tenantId", appProperties.getStateLevelTenantId());
        userSearchRequest.put("roleCodes", Collections.singletonList(appProperties.getInternalMicroserviceRoleCode()));
        try {
            userResponse = restTemplate.postForObject(uri.toString(), userSearchRequest, UserResponse.class);
            if(userResponse != null && userResponse.getUser().size() == 0)
                createInternalMicroserviceUser(requestInfo);
            else{
                internalMicroserviceRoleUuid = userResponse.getUser().get(0).getUuid();
                internalMicroserviceRoleUserid = userResponse.getUser().get(0).getId();
            }

        }catch (Exception e) {
            throw new CustomException("EG_USER_SEARCH_ERROR", "Service returned null while fetching user");
        }

    }

    private void createInternalMicroserviceUser(RequestInfo requestInfo){
        Map<String, Object> userCreateRequest = new HashMap<>();
        UserResponse userResponse = null;
        //Creating role with INTERNAL_MICROSERVICE_ROLE
        Role role = Role.builder()
                .name(appProperties.getInternalMicroserviceRoleName()).code(appProperties.getInternalMicroserviceRoleCode())
                .tenantId(appProperties.getStateLevelTenantId()).build();
        org.egov.common.contract.request.User user = org.egov.common.contract.request.User.builder().userName(appProperties.getInternalMicroserviceUserUsername())
                .name(appProperties.getInternalMicroserviceUserName()).mobileNumber(appProperties.getInternalMicroserviceUserMobilenumber())
                .type(appProperties.getInternalMicroserviceUserType()).tenantId(appProperties.getStateLevelTenantId())
                .roles(Collections.singletonList(role)).build();

        userCreateRequest.put("RequestInfo", requestInfo);
        userCreateRequest.put("user", user);

        StringBuilder uri = new StringBuilder();
        uri.append(appProperties.getUserServiceHost()).append(appProperties.getUserServiceCreatePath()); // URL for user create call

        try {
            userResponse = restTemplate.postForObject(uri.toString(), userCreateRequest, UserResponse.class);
        }catch (Exception e) {
            throw new CustomException("EG_USER_CREATE_ERROR", "Service throws error while creating user");
        }

        if(userResponse != null && userResponse.getUser().size() > 0){
            internalMicroserviceRoleUuid = userResponse.getUser().get(0).getUuid();
            internalMicroserviceRoleUserid = userResponse.getUser().get(0).getId();
        }
        else
            throw new CustomException("EG_USER_CREATE_ERROR", "Service throws error while creating user");

    }


    public User createOrSearchUser(TransactionRequest transactionRequest) {
        List<User> userList = new ArrayList<>();
        Transaction transaction = transactionRequest.getTransaction();
        userList = getUser(transactionRequest.getRequestInfo(), transaction.getUser().getMobileNumber(),
                transaction.getUser().getTenantId(), transaction.getUser().getName());
        if(CollectionUtils.isEmpty(userList) && appProperties.getIsUserCreationEnable())
            userList = createUser(transactionRequest);

        User user = userList.get(0);
        if (isNull(user) || isNull(user.getUuid()) || isEmpty(user.getName()) || isNull(user.getUserName()) ||
                isNull(user.getTenantId()) || isNull(user.getMobileNumber()))
            throw new CustomException("INVALID_USER_DETAILS", "User UUID, Name, Username, Mobile Number and Tenant Id are " +
                    "mandatory");

        return user;
    }


    /**
     * Fetched user based on phone number and name.
     * Note: Currently all CITIZEN are state-level and hence the phone no (which is set as username) is unique across state.
     *
     * @param requestInfo
     * @param phoneNo
     * @param tenantId
     * @param name
     * @return
     */
    public List<User> getUser(RequestInfo requestInfo, String phoneNo, String tenantId, String name){
        Map<String, Object> request = new HashMap<>();
        org.egov.common.contract.request.User userInfoCopy = requestInfo.getUserInfo();

        //Creating role with INTERNAL_MICROSERVICE_ROLE
        Role role = Role.builder()
                .name(appProperties.getInternalMicroserviceRoleName()).code(appProperties.getInternalMicroserviceRoleCode())
                .tenantId(centralInstanceUtil.getStateLevelTenant(tenantId)).build();

        //Creating userinfo with uuid and role of internal micro service role
        org.egov.common.contract.request.User userInfo = org.egov.common.contract.request.User.builder()
                .uuid(internalMicroserviceRoleUuid)
                .type(appProperties.getInternalMicroserviceUserType())
                .roles(Collections.singletonList(role)).id(internalMicroserviceRoleUserid).build();

        requestInfo.setUserInfo(userInfo);

        UserResponse userResponse = null;
        request.put("RequestInfo", requestInfo);
        request.put("name", name);
        request.put("mobileNumber", phoneNo);
        request.put("type", "CITIZEN");
        request.put("tenantid", tenantId.split("\\.")[0]);
        StringBuilder url = new StringBuilder();
        url.append(appProperties.getUserServiceHost()).append(appProperties.getUserServiceSearchPath());
        try {
            userResponse = restTemplate.postForObject(url.toString(), request, UserResponse.class);
        }catch(Exception e) {
            log.error("Exception while fetching user: ", e);
        }

        requestInfo.setUserInfo(userInfoCopy);
        return userResponse.getUser();

    }

    /**
	 * Creates user using the payer information given in transaction, if user is not exist in the system
	 *
	 * @param transactionRequest
	 * @return
	 */

    public List<User> createUser(TransactionRequest transactionRequest){
        RequestInfo requestInfo = transactionRequest.getRequestInfo();
        Transaction transaction = transactionRequest.getTransaction();
        Map<String, Object> request = new HashMap<>();
        Map<String, Object> user = new HashMap<>();
        Map<String, Object> role = new HashMap<>();
        List<Map> roles = new ArrayList<>();
        role.put("code", "CITIZEN");
        role.put("name", "Citizen");
        role.put("tenantId", transaction.getTenantId().split("\\.")[0]);
        roles.add(role);

        user.put("name", transaction.getUser().getName());
        user.put("mobileNumber", transaction.getUser().getMobileNumber());
        user.put("userName", transaction.getUser().getName());
        user.put("active", true);
        user.put("type", "CITIZEN");
        user.put("tenantId", transaction.getTenantId().split("\\.")[0]);
        user.put("roles", roles);

        request.put("RequestInfo", requestInfo);
        request.put("user", user);

        UserResponse response = null;
        StringBuilder url = new StringBuilder();
        url.append(appProperties.getUserServiceHost()).append(appProperties.getUserServiceCreatePath());
        try {
            response = restTemplate.postForObject(url.toString(), request, UserResponse.class);
        }catch(Exception e) {
            log.error("Exception while creating user: ", e);
            return null;
        }

        return response.getUser();
    }
}
