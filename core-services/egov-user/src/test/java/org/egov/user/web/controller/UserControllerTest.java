package org.egov.user.web.controller;

import org.apache.commons.io.IOUtils;
import org.egov.user.TestConfiguration;
import org.egov.user.domain.exception.InvalidUserSearchCriteriaException;
import org.egov.user.domain.model.*;
import org.egov.user.domain.model.enums.*;
import org.egov.user.domain.service.TokenService;
import org.egov.user.domain.service.UserService;
import org.egov.user.security.CustomAuthenticationKeyGenerator;
import org.egov.user.web.contract.auth.Role;
import org.egov.user.web.contract.auth.User;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.ArgumentMatcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;

import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;
import static org.apache.commons.lang3.ArrayUtils.isEquals;
import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(UserController.class)
@Import(TestConfiguration.class)
public class UserControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private UserService userService;

	@MockBean
	private TokenService tokenService;
	
	@MockBean
    private CustomAuthenticationKeyGenerator authenticationKeyGenerator;

	@Test
	@WithMockUser
	public void test_should_search_users() throws Exception {
		when(userService.searchUsers(argThat(new UserSearchMatcher(getUserSearch())), anyBoolean())).thenReturn(getUserModels());

		mockMvc.perform(post("/_search/").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("getUserByIdRequest.json"))).andExpect(status().isOk())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("userSearchResponse.json")));
	}

	@Test
	@WithMockUser
	public void test_should_search_for_active_users() throws Exception {
		final UserSearchCriteria expectedSearchCriteria = UserSearchCriteria.builder()
				.active(true)
				.build();
		when(userService.searchUsers(argThat(new UserSearchActiveFlagMatcher(expectedSearchCriteria)), anyBoolean()))
				.thenReturn(getUserModels());

		mockMvc.perform(post("/_search/").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("getAllActiveUsersForGivenTenant.json"))).andExpect(status().isOk())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("userSearchResponse.json")));
	}

	@Test
	@WithMockUser
	public void test_should_search_for_in_active_users() throws Exception {
		final UserSearchCriteria expectedSearchCriteria = UserSearchCriteria.builder()
				.active(false)
				.build();
		when(userService.searchUsers(argThat(new UserSearchActiveFlagMatcher(expectedSearchCriteria)), anyBoolean()))
				.thenReturn(getUserModels());

		mockMvc.perform(post("/_search/").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("getAllInActiveUsersForGivenTenant.json")))
				.andExpect(status().isOk())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("userSearchResponse.json")));
	}

	@Test
	@WithMockUser
	public void test_should_search_for_active_and_in_active_users_via_v1_endpoint() throws Exception {
		final UserSearchCriteria expectedSearchCriteria = UserSearchCriteria.builder()
				.active(null)
				.build();
		when(userService.searchUsers(argThat(new UserSearchActiveFlagMatcher(expectedSearchCriteria)), anyBoolean()))
				.thenReturn(getUserModels());

		mockMvc.perform(post("/v1/_search/").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("getAllActiveAndInActiveUsersForGivenTenantV1.json")))
				.andExpect(status().isOk())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("userSearchResponse.json")));
	}

	@Test
	@WithMockUser
	public void test_should_search_for_in_active_users_via_v1_endpoint() throws Exception {
		final UserSearchCriteria expectedSearchCriteria = UserSearchCriteria.builder()
				.active(false)
				.build();
		when(userService.searchUsers(argThat(new UserSearchActiveFlagMatcher(expectedSearchCriteria)), anyBoolean()))
				.thenReturn(getUserModels());

		mockMvc.perform(post("/v1/_search/").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("getAllInActiveUsersForGivenTenantV1.json")))
				.andExpect(status().isOk())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("userSearchResponse.json")));
	}

	@Test
	@WithMockUser
	public void test_should_search_for_active_users_via_v1_endpoint() throws Exception {
		final UserSearchCriteria expectedSearchCriteria = UserSearchCriteria.builder()
				.active(true)
				.build();
		when(userService.searchUsers(argThat(new UserSearchActiveFlagMatcher(expectedSearchCriteria)), anyBoolean()))
				.thenReturn(getUserModels());

		mockMvc.perform(post("/v1/_search/").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("getAllActiveUsersForGivenTenantV1.json")))
				.andExpect(status().isOk())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("userSearchResponse.json")));
	}


	@Test
	@WithMockUser
	@Ignore
	public void test_should_return_error_response_when_user_search_is_invalid() throws Exception {
		final UserSearchCriteria invalidSearchCriteria = UserSearchCriteria.builder().build();
		when(userService.searchUsers(any(), true)).thenThrow(new InvalidUserSearchCriteriaException(invalidSearchCriteria));

		ResultActions test = mockMvc.perform(post("/_search").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("getUserByIdRequest.json")));//				.andExpect(status().isBadRequest())
				;
		test.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("userSearchErrorResponse.json")));
	}

	@Test
	@WithMockUser
	@Ignore
	public void test_should_update_user_profile() throws Exception {
		when(userService.partialUpdate(any())).thenReturn(org.egov.user.domain.model.User.builder().build());

		mockMvc.perform(post("/profile/_update")
				.contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("userProfileUpdateRequest.json")))
				.andExpect(status().isOk())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("userProfileUpdateResponse.json")));
	}
	
	@Test
	@WithMockUser
	@Ignore
	public void test_should_update_user_details() throws Exception {

		org.egov.user.domain.model.User userRequest = org.egov.user.domain.model.User.builder().name("foo").username("userName").dob(new Date("04/08/1986")).guardian("name of relative").build();
		when(userService.updateWithoutOtpValidation(any(org.egov.user.domain.model.User.class))).thenReturn
				(userRequest);
		mockMvc.perform(post("/users/112/_updatenovalidate")
				.contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("userCreateRequest.json")))
				.andExpect(status().isOk())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("userCreateSuccessResponse.json")));
	}

	@Ignore
	@Test
	@WithMockUser
	public void test_should_create_citizen() throws Exception {
		final Date expectedDate = toDate(LocalDateTime.of(1986, 8, 4, 5, 30));
		final org.egov.user.domain.model.User user = org.egov.user.domain.model.User.builder()
				.username("userName")
				.name("foo")
				.dob(expectedDate)
				.guardian("name of relative")
				.build();
		when(userService.createCitizen(any())).thenReturn(user);

		mockMvc.perform(post("/citizen/_create")
				.contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("userCreateRequest.json")))
				.andExpect(status().isOk())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("userCreateSuccessResponse.json")));
	}

	@Test
	@WithMockUser
	public void test_should_create_user_without_otp_validation() throws Exception {
		final Date expectedDate = toDate(LocalDateTime.of(1986, 8, 4, 0, 0));
		final org.egov.user.domain.model.User expectedUser = org.egov.user.domain.model.User.builder()
				.username("userName")
				.name("foo")
				.dob(expectedDate)
				.guardian("name of relative")
				.build();
		final ArgumentCaptor<org.egov.user.domain.model.User> argumentCaptor =
				ArgumentCaptor.forClass(org.egov.user.domain.model.User.class);
		when(userService.createUser(argumentCaptor.capture())).thenReturn(expectedUser);

		mockMvc.perform(post("/users/_createnovalidate")
				.contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("userCreateRequest.json")))
				.andExpect(status().isOk())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("userCreateSuccessResponse.json")));

		final org.egov.user.domain.model.User actualUser = argumentCaptor.getValue();
		assertEquals("foo", actualUser.getName());
		assertEquals("userName", actualUser.getUsername());
		assertEquals("name of relative", actualUser.getGuardian());
	}

	@Test
	@WithMockUser
	public void testUserDetails() throws Exception {
		OAuth2Authentication oAuth2Authentication = mock(OAuth2Authentication.class);
		SecureUser secureUser = new SecureUser(getUser());
		when(oAuth2Authentication.getPrincipal()).thenReturn(secureUser);
		when(tokenService.getUser("c80e0ade-f48d-4077-b0d2-4e58526a6bfd"))
				.thenReturn(getCustomUserDetails());

		mockMvc.perform(post("/_details?access_token=c80e0ade-f48d-4077-b0d2-4e58526a6bfd"))
				.andExpect(status().isOk())
				.andExpect(content().json(getFileContents("userDetailsResponse.json")));
	}

	private UserSearchCriteria getUserSearch() {
		return UserSearchCriteria.builder()
				.id(asList(1L, 2L))
				.userName("userName")
				.name("name")
				.mobileNumber("mobileNumber")
//				.aadhaarNumber("aadhaarNumber")
//				.pan("pan")
				.emailId("emailId")
				.fuzzyLogic(true)
				.active(true)
				.limit(0)
				.offset(0)
				.sort(singletonList("name"))
				.type(UserType.CITIZEN)
				.roleCodes(Arrays.asList("roleCode1", "roleCode2"))
				.build();
	}

	private List<org.egov.user.domain.model.User> getUserModels() {
		Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("IST"));
		calendar.set(1990, Calendar.JULY, 1, 16, 41, 11);
		Date date = calendar.getTime();
		Date expectedDOB = toDate(LocalDateTime.of(1986, 8, 4, 5 ,30));

		org.egov.user.domain.model.User user = org.egov.user.domain.model.User.builder()
				.id(1L)
				.tenantId("")
				.username("userName")
				.title("title")
				.password("password")
				.salutation("salutation")
				.guardian("name of relative")
				.guardianRelation(GuardianRelation.Father)
				.name("name")
				.gender(Gender.FEMALE)
				.mobileNumber("mobileNumber1")
				.emailId("email")
				.altContactNumber("mobileNumber2")
				.pan("pan")
				.aadhaarNumber("aadhaarNumber")
				.permanentAddress(getPermanentAddress())
				.correspondenceAddress(getCorrespondenceAddress())
				.active(true)
				.roles(getListOfRoles())
				.dob(expectedDOB)
				.passwordExpiryDate(date)
				.locale("en_IN")
				.type(UserType.CITIZEN)
				.bloodGroup(BloodGroup.A_POSITIVE)
				.identificationMark("identification mark")
				.signature("7a9d7f12-bdcb-4487-9d43-709838a0ad39")
				.photo("3b26fb49-e43d-401b-899a-f8f0a1572de0")
				.accountLocked(false)
				.createdDate(date)
				.lastModifiedDate(date)
				.createdBy(1L)
				.lastModifiedBy(1L).build();

		return Collections.singletonList(user);
	}

	private Address getPermanentAddress() {
		return Address.builder()
				.type(AddressType.PERMANENT)
				.city("city1")
				.address("post office")
				.pinCode("pincode 1")
				.build();
	}

	private Address getCorrespondenceAddress() {
		return Address.builder()
				.type(AddressType.CORRESPONDENCE)
				.city("city2")
				.address("sub district")
				.pinCode("pincode 2")
				.build();
	}

	private Set<org.egov.user.domain.model.Role> getListOfRoles() {
		Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("IST"));
		calendar.set(1990, Calendar.JULY, 1, 16, 41, 11);

		org.egov.user.domain.model.Role role1 = org.egov.user.domain.model.Role.builder()
				.name("name of the role 1")
				.code("roleCode")
				.description("description")
				.createdBy(0L)
				.lastModifiedBy(0L)
				.createdDate(calendar.getTime())
				.lastModifiedDate(calendar.getTime())
				.build();

		return Collections.singleton(role1);
	}

	private String getFileContents(String fileName) {
		try {
			return IOUtils.toString(this.getClass().getClassLoader().getResourceAsStream(fileName), "UTF-8");
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	class UserSearchMatcher extends ArgumentMatcher<UserSearchCriteria> {

		private UserSearchCriteria expectedUserSearch;

		public UserSearchMatcher(UserSearchCriteria expectedUserSearch) {
			this.expectedUserSearch = expectedUserSearch;
		}

		@Override
		public boolean matches(Object o) {
			UserSearchCriteria userSearch = (UserSearchCriteria) o;
			return userSearch.getId().equals(expectedUserSearch.getId()) &&
					userSearch.getUserName().equals(expectedUserSearch.getUserName()) &&
					userSearch.getName().equals(expectedUserSearch.getName()) &&
					userSearch.getMobileNumber().equals(expectedUserSearch.getMobileNumber()) &&
//					userSearch.getAadhaarNumber().equals(expectedUserSearch.getAadhaarNumber()) &&
//					userSearch.getPan().equals(expectedUserSearch.getPan()) &&
					userSearch.getEmailId().equals(expectedUserSearch.getEmailId()) &&
					userSearch.isFuzzyLogic() == expectedUserSearch.isFuzzyLogic() &&
					userSearch.getActive() == expectedUserSearch.getActive() &&
					isEquals(userSearch.getRoleCodes(), expectedUserSearch.getRoleCodes()) &&
					userSearch.getLimit().equals(expectedUserSearch.getLimit()) &&
					userSearch.getOffset().equals(expectedUserSearch.getOffset()) &&
					userSearch.getSort().equals(expectedUserSearch.getSort()) &&
					userSearch.getType().equals(expectedUserSearch.getType());
		}
	}

	class UserSearchActiveFlagMatcher extends ArgumentMatcher<UserSearchCriteria> {

		private UserSearchCriteria expectedUserSearch;

		public UserSearchActiveFlagMatcher(UserSearchCriteria expectedUserSearch) {
			this.expectedUserSearch = expectedUserSearch;
		}

		@Override
		public boolean matches(Object o) {
			UserSearchCriteria userSearch = (UserSearchCriteria) o;
			return userSearch.getActive() == expectedUserSearch.getActive();
		}
	}

	private User getUser() {
		return User.builder()
				.id(18L)
				.userName("narasappa")
				.name("narasappa")
				.mobileNumber("123456789")
				.emailId("abc@gmail.com")
				.locale("en_IN")
				.type("EMPLOYEE")
				.active(Boolean.TRUE)
				.roles(getRoles())
				.tenantId("default")
				.build();
	}

	private Set<Role> getRoles() {
		Set<Role> roles = new HashSet<>();
		org.egov.user.domain.model.Role roleModel = org.egov.user.domain.model.Role.builder()
				.name("Employee")
				.code("EMPLOYEE")
				.build();

		Role role = new Role(roleModel);
		roles.add(role);

		return roles;
	}

	private UserDetail getCustomUserDetails() {
		SecureUser secureUser = new SecureUser(getUser());
		List<Action> actions = new ArrayList<Action>();
		Action action = Action.builder()
				.url("/pgr/receivingmode")
				.name("ReceivingMode")
				.displayName("ReceivingMode")
				.orderNumber(0)
				.queryParams("tenantId=")
				.parentModule("1")
				.serviceCode("PGR")
				.build();
		actions.add(action);

		return new UserDetail(secureUser, actions);
	}

	private Date toDate(LocalDateTime localDateTime) {
		final ZonedDateTime expectedDateTime = ZonedDateTime.of(localDateTime, ZoneId.of("Asia/Calcutta"));
		return Date.from(expectedDateTime.toInstant());
	}

}