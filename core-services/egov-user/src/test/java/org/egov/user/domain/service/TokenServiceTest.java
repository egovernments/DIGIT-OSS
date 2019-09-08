package org.egov.user.domain.service;

import org.egov.user.domain.exception.InvalidAccessTokenException;
import org.egov.user.domain.model.Action;
import org.egov.user.domain.model.SecureUser;
import org.egov.user.domain.model.UserDetail;
import org.egov.user.persistence.repository.ActionRestRepository;
import org.egov.user.web.contract.auth.Role;
import org.egov.user.web.contract.auth.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.TokenStore;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class TokenServiceTest {

	@InjectMocks
	private TokenService tokenService;

	@Mock
	private TokenStore tokenStore;

	@Mock
	private ActionRestRepository actionRestRepository;

	@Test
	public void test_should_get_user_details_for_given_token() {
		OAuth2Authentication oAuth2Authentication = mock(OAuth2Authentication.class);
		final String accessToken = "c80e0ade-f48d-4077-b0d2-4e58526a6bfd";
		when(tokenStore.readAuthentication(accessToken)).thenReturn(oAuth2Authentication);
		SecureUser secureUser = new SecureUser(getUser());
		when(oAuth2Authentication.getPrincipal()).thenReturn(secureUser);
		final List<Action> expectedActions = getActions();
		when(actionRestRepository.getActionByRoleCodes(getRoleCodes(), "default")).thenReturn(expectedActions);
		UserDetail actualUserDetails = tokenService.getUser(accessToken);

		assertEquals(secureUser, actualUserDetails.getSecureUser());
//		assertEquals(expectedActions, actualUserDetails.getActions());
	}

	@Test(expected = InvalidAccessTokenException.class)
	public void test_should_throw_exception_when_access_token_is_not_specified() {
		tokenService.getUser("");
	}

	@Test(expected = InvalidAccessTokenException.class)
	public void test_should_throw_exception_when_access_token_is_not_present_in_token_store() {
		when(tokenStore.readAuthentication("accessToken")).thenReturn(null);

		tokenService.getUser("accessToken");
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
		org.egov.user.domain.model.Role roleModel = org.egov.user.domain.model.Role.builder()
				.name("Employee")
				.code("Employee")
				.tenantId("default")
				.build();

		return Collections.singleton(new Role(roleModel));
	}

	private List<Action> getActions() {
		List<Action> actions = new ArrayList<>();
		Action action = Action.builder()
				.url("/pgr/receivingmode")
				.name("Get all ReceivingMode")
				.displayName("Get all ReceivingMode")
				.orderNumber(0)
				.queryParams("tenantId=")
				.parentModule("1")
				.serviceCode("PGR")
				.build();
		actions.add(action);

		return actions;
	}

	private List<String> getRoleCodes() {
		return getUser().getRoles().stream().map(Role::getCode).collect(Collectors.toList());
	}

}