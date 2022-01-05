package org.egov.persistence.repository;

import org.egov.domain.model.User;
import org.egov.persistence.contract.UserSearchRequest;
import org.egov.persistence.contract.UserSearchResponseContent;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class UserRepositoryTest {

    private static final String SEARCH_CONTENT_TEST_EMAIL = "test@gmail.com";
    private static final String SEARCH_CONTENT_MOBILE_NUMBER = "123456789";
    private static final String FETCH_USER_TENANT_ID = "tenantId";
    private static final String FETCH_USER_CITIZEN = "CITIZEN";

    @InjectMocks
    private UserRepository userRepository;

    @Mock
    private RestTemplate restTemplate;

    @Before
    public void before() {

        ReflectionTestUtils.setField(userRepository, "SEARCH_USER_URL", "user/_search");
        ReflectionTestUtils.setField(userRepository, "HOST", "http://localhost:8081/");
    }

    @Test
    public void test_should_create_user() {
        List<UserSearchResponseContent> list = new ArrayList<UserSearchResponseContent>();
        UserSearchResponseContent searchContent = new UserSearchResponseContent(1l, SEARCH_CONTENT_TEST_EMAIL, SEARCH_CONTENT_MOBILE_NUMBER);
        list.add(searchContent);
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("user", list);

        when(restTemplate.postForObject(any(String.class), any(UserSearchRequest.class), eq(Map.class)))
                .thenReturn(map);
        User actualUser = userRepository.fetchUser(SEARCH_CONTENT_MOBILE_NUMBER, FETCH_USER_TENANT_ID, FETCH_USER_CITIZEN);

        final User expectedUser = new User(1L, SEARCH_CONTENT_TEST_EMAIL, SEARCH_CONTENT_MOBILE_NUMBER);

        assertEquals(expectedUser, actualUser);
    }

    @Test
    public void test_should_notcreateuser_whenresponse_isnull() {
        List<UserSearchResponseContent> list = new ArrayList<UserSearchResponseContent>();
        UserSearchResponseContent searchContent = new UserSearchResponseContent(1l, SEARCH_CONTENT_TEST_EMAIL, SEARCH_CONTENT_MOBILE_NUMBER);
        list.add(searchContent);
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("user", list);

        when(restTemplate.postForObject(any(String.class), any(UserSearchRequest.class), eq(Map.class)))
                .thenReturn(null);
        User actualUser = userRepository.fetchUser(SEARCH_CONTENT_MOBILE_NUMBER, FETCH_USER_TENANT_ID, FETCH_USER_CITIZEN);
        assertEquals(actualUser, null);
    }

    @Test
    public void test_should_throw_exception_when_userIsNotFound() {
        List<UserSearchResponseContent> list = new ArrayList<UserSearchResponseContent>();
        UserSearchResponseContent searchContent = new UserSearchResponseContent(1l, SEARCH_CONTENT_TEST_EMAIL, SEARCH_CONTENT_MOBILE_NUMBER);
        list.add(searchContent);
        Map<String, Object> map = new HashMap<String, Object>();

        when(restTemplate.postForObject(any(String.class), any(UserSearchRequest.class), eq(Map.class)))
                .thenReturn(map);
        User actualUser = userRepository.fetchUser(SEARCH_CONTENT_MOBILE_NUMBER, FETCH_USER_TENANT_ID, FETCH_USER_CITIZEN);
        assertEquals(actualUser, null);
    }

    @Test
    public void test_should_notmatch_create_user_And_expecteduser() {
        List<UserSearchResponseContent> list = new ArrayList<UserSearchResponseContent>();
        UserSearchResponseContent searchContent = new UserSearchResponseContent(1l, SEARCH_CONTENT_TEST_EMAIL, SEARCH_CONTENT_MOBILE_NUMBER);
        list.add(searchContent);
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("user", list);

        when(restTemplate.postForObject(any(String.class), any(UserSearchRequest.class), eq(Map.class)))
                .thenReturn(map);
        User actualUser = userRepository.fetchUser(SEARCH_CONTENT_MOBILE_NUMBER, FETCH_USER_TENANT_ID, FETCH_USER_CITIZEN);

        final User expectedUser = new User(2L, "test123@gmail.com", SEARCH_CONTENT_MOBILE_NUMBER);

        assertNotEquals(expectedUser, actualUser);
    }

}