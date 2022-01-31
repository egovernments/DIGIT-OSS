package org.egov.persistence.repository;

import java.util.List;
import java.util.Map;

import org.egov.domain.model.User;
import org.egov.persistence.contract.UserSearchRequest;
import org.egov.persistence.contract.UserSearchResponseContent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class UserRepository {
	
	 public static final String REQUEST_TENANT_ID_KEY = "tenantId";

    @Value("${user.host}")
    private String HOST;

    @Value("${search.user.url}")
    private String SEARCH_USER_URL;

    @Autowired
    private RestTemplate restTemplate;

    public User fetchUser(String mobileNumber, String tenantId, String userType) {
    	
    	/*
    	 * #central-instance
    	 * tenantId for header will be  when citizen is being fetched in OTP
    	 * directly taking 0th index since citizen will be saved with highest parent of tenant hierarchy
    	 */
    	String tenantIdForHeader = tenantId;
        UserSearchRequest request = null;
        if (userType !=null && userType.equals("EMPLOYEE")) {
            request = new UserSearchRequest(null, tenantId, userType, mobileNumber);
        } else {
        	tenantIdForHeader = tenantId.split("\\.")[0];
            request = new UserSearchRequest(mobileNumber, tenantIdForHeader, userType, null);
        }
        
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        
        final HttpHeaders headers = new HttpHeaders();
        headers.add(REQUEST_TENANT_ID_KEY, tenantIdForHeader);
        final HttpEntity<Object> httpEntity = new HttpEntity<>(request, headers);

        try {
            Map<String, Object> response = restTemplate.postForObject(HOST + SEARCH_USER_URL, httpEntity, Map.class);
            List<UserSearchResponseContent> users = (List<UserSearchResponseContent>) response.get("user");
            if (!users.isEmpty()) {
                UserSearchResponseContent user = mapper.convertValue(users.get(0), UserSearchResponseContent.class);
                return new User(user.getId(), user.getEmailId(), user.getMobileNumber());
            } else {
                return null;
            }
        } catch (Exception e) {
            log.error("Exception WhileFetching User from user : " + e.getMessage());
        }

        return null;
    }
}
