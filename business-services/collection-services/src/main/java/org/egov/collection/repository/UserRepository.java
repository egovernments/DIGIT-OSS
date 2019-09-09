package org.egov.collection.repository;

import org.egov.collection.web.contract.GetUserByIdRequest;
import org.egov.collection.web.contract.UserResponse;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class UserRepository {

	public static final Logger LOGGER = LoggerFactory.getLogger(UserRepository.class);

	
    @Autowired
    private RestTemplate restTemplate;

    private String url;

    public UserRepository(RestTemplate restTemplate, @Value("${user.service.host}") String userServiceHost, @Value("${egov.services.user_by_id}") String url) {
        this.restTemplate = restTemplate;
        this.url = userServiceHost + url;
    }

    List<User> getUsersById(List<Long> userIds, final RequestInfo requestInfo, final String tenantId) {
        GetUserByIdRequest userRequest = GetUserByIdRequest.builder().requestInfo(requestInfo)
                .id(userIds).tenantId(tenantId).build();
        LOGGER.info("URI: "+url);
        LOGGER.info("tenantid: "+tenantId);
        LOGGER.info("Request: "+userRequest.toString());
        return restTemplate.postForObject(url, userRequest, UserResponse.class).getReceiptCreators();
    }
}
