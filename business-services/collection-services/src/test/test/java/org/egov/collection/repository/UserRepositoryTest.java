package org.egov.collection.repository;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.collection.web.contract.UserResponse;
import org.egov.common.contract.request.RequestInfo;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@ContextConfiguration(classes = {UserRepository.class, String.class})
@ExtendWith(SpringExtension.class)
class UserRepositoryTest {
    @MockBean
    private RestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testGetUsersById() throws RestClientException {
        when(this.restTemplate.postForObject((String) any(), (Object) any(), (Class<UserResponse>) any(), (Object[]) any()))
                .thenReturn(new UserResponse());
        ArrayList<Long> userIds = new ArrayList<>();
        assertTrue(this.userRepository.getUsersById(userIds, new RequestInfo(), "42").isEmpty());
        verify(this.restTemplate).postForObject((String) any(), (Object) any(), (Class<UserResponse>) any(),
                (Object[]) any());
    }
}

