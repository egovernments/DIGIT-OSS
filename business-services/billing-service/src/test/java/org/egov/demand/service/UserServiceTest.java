package org.egov.demand.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.Demand;
import org.egov.demand.model.Owner;
import org.egov.demand.web.contract.User;
import org.egov.demand.web.contract.UserResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@SpringBootTest
public class UserServiceTest {

    @MockBean
    private RestTemplate restTemplate;

    @Autowired
    private UserService userService;


    @Test
    @DisplayName("Should return the user when the user exists")
    public void testGetUserWhenUserExists() {

        UserResponse userResponse = new UserResponse();
        userResponse.setUser(Collections.singletonList(new User()));
        when(restTemplate.postForObject(anyString(), any(), eq(UserResponse.class))).thenReturn(userResponse);
        Map<String, String> response = userService.getUser(new RequestInfo(), "1234567890", "test", "default");
        assertTrue(response.containsKey("id"));
    }

    @Test
    @DisplayName("Should return empty map when the user does not exist")
    public void testGetUserWhenUserDoesNotExist() {

        RequestInfo requestInfo = new RequestInfo();
        String phoneNo = "1234567890";
        String name = "test";
        String tenantId = "default";

        UserResponse userResponse = new UserResponse();
        userResponse.setUser(Collections.emptyList());

        when(restTemplate.postForObject(anyString(), any(), eq(UserResponse.class))).thenReturn(userResponse);

        Map<String, String> response = userService.getUser(requestInfo, phoneNo, name, tenantId);

        assertTrue(response.isEmpty());
    }
}

