package org.egov.persistence.repository;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.extern.slf4j.Slf4j;
import org.egov.domain.model.User;
import org.egov.persistence.contract.UserSearchRequest;
import org.egov.persistence.contract.UserSearchResponseContent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Repository
@Slf4j
public class UserRepository {

	@Value("${user.host}")
	private String HOST;

	@Value("${search.user.url}")
	private String SEARCH_USER_URL;

	@Autowired
	private RestTemplate restTemplate;

	public User fetchUser(String mobileNumber, String tenantId, String userType) {
		final UserSearchRequest request = new UserSearchRequest(mobileNumber, tenantId, userType);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		try {
			Map<String, Object> response = restTemplate.postForObject(HOST + SEARCH_USER_URL, request, Map.class);
			
			List<UserSearchResponseContent> users = (List<UserSearchResponseContent>) response.get("user");
			
			if (!users.isEmpty()) {
				UserSearchResponseContent user = mapper.convertValue(users.get(0), UserSearchResponseContent.class);
				return new User(user.getId(), user.getEmailId(), user.getMobileNumber());
			} else {
				return null;
			}
		} catch (Exception e) {
			log.info("Excpetion WhileFetching User from user : " + e.getMessage());
		}

		return null;
	}
}
