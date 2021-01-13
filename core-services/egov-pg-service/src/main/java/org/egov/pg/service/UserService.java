package org.egov.pg.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pg.config.AppProperties;
import org.egov.pg.models.Transaction;
import org.egov.pg.web.models.TransactionRequest;
import org.egov.pg.web.models.User;
import org.egov.pg.web.models.UserResponse;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import java.util.*;

import static java.util.Objects.isNull;
import static org.springframework.util.StringUtils.isEmpty;

@Service
@Slf4j
public class UserService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private AppProperties appProperties;


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
