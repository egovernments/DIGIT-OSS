package org.egov.chat.pre.authorization;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.chat.config.ApplicationProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class LoginService {

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    @Value("${user.login.authorization.header}")
    private String userAuthHeader;

    public JsonNode getLoggedInUser(String mobileNumber, String tenantId) {
        HttpHeaders headers = getDefaultHttpHeaders();

        MultiValueMap<String, String> formData = getDefaultFormData();
        formData.add("tenantId", tenantId);
        formData.add("username", mobileNumber);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

        ResponseEntity<JsonNode> loginResponse = restTemplate.postForEntity(applicationProperties.getUserServiceHost()
                + applicationProperties.getUserServiceOAuthPath(), request, JsonNode.class);

        ObjectNode loginObjectNode = objectMapper.createObjectNode();

        if (loginResponse.getStatusCode().is2xxSuccessful()) {
            JsonNode loginObject = loginResponse.getBody();

            loginObjectNode.set("authToken", loginObject.get("access_token"));
            loginObjectNode.set("refreshToken", loginObject.get("refresh_token"));
            loginObjectNode.set("userInfo", loginObject.get("UserRequest"));
            loginObjectNode.set("expiresIn", loginObject.get("expires_in"));
        }

        return loginObjectNode;
    }

    HttpHeaders getDefaultHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", userAuthHeader);
        return headers;
    }

    MultiValueMap<String, String> getDefaultFormData() {
        MultiValueMap<String, String> defaultFormData = new LinkedMultiValueMap<>();

        defaultFormData.add("grant_type", "password");
        defaultFormData.add("password", applicationProperties.getHardcodedPassword());
        defaultFormData.add("userType", "CITIZEN");

        return defaultFormData;
    }

}
