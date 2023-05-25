package org.egov.chat.pre.authorization;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.chat.config.ApplicationProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class CreateNewUserService {

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    public JsonNode createNewUser(String mobileNumber, String tenantId) throws Exception {

        ObjectNode userCreateRequest = objectMapper.createObjectNode();

        userCreateRequest.set("RequestInfo", objectMapper.createObjectNode());

        ObjectNode user = objectMapper.createObjectNode();

        user.put("otpReference", applicationProperties.getHardcodedPassword());
        user.put("permanentCity", tenantId);
        user.put("tenantId", tenantId);
        user.put("username", mobileNumber);

        userCreateRequest.set("User", user);

        ResponseEntity<JsonNode> createResponse =
                restTemplate.postForEntity(applicationProperties.getUserServiceHost() + applicationProperties.getCitizenCreatePath(),
                        userCreateRequest, JsonNode.class);

        if (createResponse.getStatusCode().is2xxSuccessful()) {
            return createResponse.getBody();
        } else {
            throw new Exception("User Create Error");
        }
    }

}
