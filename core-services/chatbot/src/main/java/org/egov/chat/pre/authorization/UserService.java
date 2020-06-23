package org.egov.chat.pre.authorization;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.chat.models.EgovChat;
import org.egov.chat.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class UserService {

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private LoginService loginService;
    @Autowired
    private CreateNewUserService createNewUserService;

    public EgovChat addLoggedInUser(EgovChat chatNode) throws Exception {
        String tenantId = chatNode.getTenantId();
        String mobileNumber = chatNode.getUser().getMobileNumber();

        User user = getUser(mobileNumber, tenantId);

        chatNode.setUser(user);
        return chatNode;
    }

    User getUser(String mobileNumber, String tenantId) throws Exception {
        User user = loginOrCreateUser(mobileNumber, tenantId);

        return user;
    }

    User loginOrCreateUser(String mobileNumber, String tenantId) throws Exception {
        User user = User.builder().mobileNumber(mobileNumber).build();
        try {
            JsonNode loginUserObject = loginUser(mobileNumber, tenantId);
            user = updateUserDetailsFromLogin(user, loginUserObject);
        } catch (HttpClientErrorException.BadRequest badRequest) {                  // User doesn't exist in mSeva system
            createUserForSystem(mobileNumber, tenantId);
            JsonNode loginUserObject = loginUser(mobileNumber, tenantId);
            user = updateUserDetailsFromLogin(user, loginUserObject);
        }
        return user;
    }

    User updateUserDetailsFromLogin(User user, JsonNode loginUserObject) {
        user.setAuthToken(loginUserObject.get("authToken").asText());
        user.setRefreshToken(loginUserObject.get("refreshToken").asText());
        user.setUserInfo(loginUserObject.get("userInfo").toString());
        user.setUserId(loginUserObject.get("userInfo").get("uuid").asText());
        user.setExpiresAt(getExpiryTimestamp(loginUserObject));
        return user;
    }

    Long getExpiryTimestamp(JsonNode loginUserObject) {
        return System.currentTimeMillis() + loginUserObject.get("expiresIn").asLong() * 1000;
    }

    JsonNode loginUser(String mobileNumber, String tenantId) {
        return loginService.getLoggedInUser(mobileNumber, tenantId);
    }

    JsonNode createUserForSystem(String mobileNumber, String tenantId) throws Exception {
        return createNewUserService.createNewUser(mobileNumber, tenantId);
    }

}
