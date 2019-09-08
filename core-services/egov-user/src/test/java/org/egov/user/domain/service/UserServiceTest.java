package org.egov.user.domain.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.user.domain.exception.*;
import org.egov.user.domain.model.*;
import org.egov.user.domain.model.enums.Gender;
import org.egov.user.domain.model.enums.UserType;
import org.egov.user.persistence.repository.FileStoreRepository;
import org.egov.user.persistence.repository.OtpRepository;
import org.egov.user.persistence.repository.UserRepository;
import org.egov.user.web.contract.Otp;
import org.egov.user.web.contract.OtpValidateRequest;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.provider.token.TokenStore;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class UserServiceTest {

	private static final int DEFAULT_PASSWORD_EXPIRY_IN_DAYS = 90;
	@Mock
	private UserRepository userRepository;

	@Mock
	private OtpRepository otpRepository;
	
	@Mock
	private FileStoreRepository fileRepository;

	@Mock
	private PasswordEncoder passwordEncoder;

	@Mock
	private TokenStore tokenStore;

	private UserService userService;

	private final List<Long> ID = Arrays.asList(1L, 2L);
	private final String EMAIL = "email@gmail.com";
	private final String USER_NAME = "userName";
	private final String TENANT_ID = "tenantId";
	private final boolean isCitizenLoginOtpBased = false;
	private final boolean isEmployeeLoginOtpBased = false;

	@Before
	public void before() {
		userService = new UserService(userRepository, otpRepository,fileRepository, passwordEncoder, tokenStore ,
				DEFAULT_PASSWORD_EXPIRY_IN_DAYS,
				isCitizenLoginOtpBased,isEmployeeLoginOtpBased);
	}


	@Test
	public void test_should_search_for_users() {
		UserSearchCriteria userSearch = mock(UserSearchCriteria.class);
		List<org.egov.user.domain.model.User> expectedListOfUsers = new ArrayList<org.egov.user.domain.model.User>();
		when(userRepository.findAll(userSearch)).thenReturn(expectedListOfUsers);
		List<org.egov.user.domain.model.User> actualResult = userService.searchUsers(userSearch, true);

		assertThat(expectedListOfUsers).isEqualTo(actualResult);
	}

	@Test
	public void test_should_validate_search_critieria() {
		UserSearchCriteria userSearch = mock(UserSearchCriteria.class);
		List<org.egov.user.domain.model.User> expectedListOfUsers = new ArrayList<org.egov.user.domain.model.User>();
		when(userRepository.findAll(userSearch)).thenReturn(expectedListOfUsers);

		userService.searchUsers(userSearch, true);

		verify(userSearch).validate(true);
	}

	@Test
	public void test_should_save_a_valid_user() {
		org.egov.user.domain.model.User domainUser = validDomainUser(false);
		when(otpRepository.isOtpValidationComplete(getExpectedRequest())).thenReturn(true);
		final User expectedEntityUser = User.builder().build();
		when(userRepository.create(domainUser)).thenReturn(expectedEntityUser);

		User returnedUser = userService.createUser(domainUser);

		assertEquals(expectedEntityUser, returnedUser);
	}

	@Test
	public void test_should_set_pre_defined_expiry_on_creating_user() {
		org.egov.user.domain.model.User domainUser = mock(User.class);
		when(otpRepository.isOtpValidationComplete(getExpectedRequest())).thenReturn(true);
		final User expectedEntityUser = User.builder().build();
		when(userRepository.create(domainUser)).thenReturn(expectedEntityUser);

		userService.createUser(domainUser);

		verify(domainUser).setDefaultPasswordExpiry(DEFAULT_PASSWORD_EXPIRY_IN_DAYS);
	}

	@Test
	public void test_should_create_a_valid_citizen() {
		org.egov.user.domain.model.User domainUser = mock(User.class);
		when((domainUser.getOtpValidationRequest())).thenReturn(getExpectedRequest());
		when(otpRepository.isOtpValidationComplete(getExpectedRequest())).thenReturn(true);
		final User expectedUser = User.builder().build();
		when(domainUser.getTenantId()).thenReturn("default");
		when(domainUser.getPassword()).thenReturn("demo");
		when(userRepository.create(domainUser)).thenReturn(expectedUser);

		User returnedUser = userService.createCitizen(domainUser);

		assertEquals(expectedUser, returnedUser);
	}

	@Test(expected = UserNameNotValidException.class)
	public void test_should_not_create_citizenWithWrongUserName() {
		userService = new UserService(userRepository, otpRepository,fileRepository, passwordEncoder,
			tokenStore,	DEFAULT_PASSWORD_EXPIRY_IN_DAYS,
				true,false);
		org.egov.user.domain.model.User domainUser = User.builder().username("TestUser").name("Test").active(true)
				.tenantId("default").mobileNumber("123456789").type(UserType.CITIZEN).build();
		userService.createCitizen(domainUser);
	}

	
	@Ignore
	@Test
	public void test_should_create_a_valid_citizen_withotp() throws Exception {
		org.egov.user.domain.model.User domainUser = mock(User.class);
		when(domainUser.getTenantId()).thenReturn("default");
		when((domainUser.getOtpValidationRequest())).thenReturn(getExpectedRequest());
		when(otpRepository.validateOtp(buildOtpValidationRequest())).thenReturn(true);
		final User expectedUser = User.builder().build();
		when(userRepository.create(domainUser)).thenReturn(expectedUser);

		User returnedUser = userService.createCitizen(domainUser);

		assertEquals(expectedUser, returnedUser);
	}

	private org.egov.user.web.contract.OtpValidateRequest buildOtpValidationRequest() {
		// TODO Auto-generated method stub
		RequestInfo requestInfo = RequestInfo.builder().action("validate").ts(new Date()).build();
		Otp otp = Otp.builder().build();
		org.egov.user.web.contract.OtpValidateRequest otpValidationRequest = org.egov.user.web.contract.OtpValidateRequest
				.builder().requestInfo(requestInfo).otp(otp).build();
		return otpValidationRequest;
	}

	@Test
	public void test_should_set_pre_defined_expiry_on_creating_citizen() {
		org.egov.user.domain.model.User domainUser = mock(User.class);
		when(domainUser.getTenantId()).thenReturn("default");
		when(domainUser.getPassword()).thenReturn("demo");
		when((domainUser.getOtpValidationRequest())).thenReturn(getExpectedRequest());
		when(otpRepository.isOtpValidationComplete(getExpectedRequest())).thenReturn(true);
		final User expectedUser = User.builder().build();
		when(userRepository.create(domainUser)).thenReturn(expectedUser);

		userService.createCitizen(domainUser);

		verify(domainUser).setDefaultPasswordExpiry(DEFAULT_PASSWORD_EXPIRY_IN_DAYS);
	}

	@Test
	public void test_should_set_role_to_citizen_when_creating_a_citizen() {
		org.egov.user.domain.model.User domainUser = mock(User.class);
		when(domainUser.getTenantId()).thenReturn("default");
		when(domainUser.getPassword()).thenReturn("demo");
		when(domainUser.getOtpValidationRequest()).thenReturn(getExpectedRequest());
		when(otpRepository.isOtpValidationComplete(getExpectedRequest())).thenReturn(true);
		final User expectedEntityUser = User.builder().build();
		when(userRepository.create(domainUser)).thenReturn(expectedEntityUser);

		userService.createCitizen(domainUser);

		verify(domainUser).setRoleToCitizen();
	}

	@Test(expected = DuplicateUserNameException.class)
	public void test_should_raise_exception_when_duplicate_user_name_exists() throws Exception {
		org.egov.user.domain.model.User domainUser = validDomainUser(false);
		when(otpRepository.isOtpValidationComplete(getExpectedRequest())).thenReturn(true);
		when(userRepository.isUserPresent("supandi_rocks", "tenantId", UserType.CITIZEN)).thenReturn(true);

		userService.createUser(domainUser);
	}

	@Test(expected = OtpValidationPendingException.class)
	public void test_exception_is_raised_when_otp_validation_fails() throws Exception {
		org.egov.user.domain.model.User domainUser = validDomainUser(false);
		domainUser.setOtpValidationMandatory(true);
		when(otpRepository.isOtpValidationComplete(getExpectedRequest())).thenReturn(false);

		userService.createUser(domainUser);
	}

	@Test
	public void test_otp_is_not_validated_when_validation_flag_is_false() throws Exception {
		org.egov.user.domain.model.User domainUser = validDomainUser(false);
		when(otpRepository.isOtpValidationComplete(getExpectedRequest())).thenReturn(false);

		userService.createUser(domainUser);

		verify(otpRepository, never()).isOtpValidationComplete(getExpectedRequest());
	}

	@Test(expected = InvalidUserCreateException.class)
	public void test_should_raise_exception_when_user_is_invalid() throws Exception {
		org.egov.user.domain.model.User domainUser = org.egov.user.domain.model.User.builder().build();

		userService.createUser(domainUser);
		verify(userRepository, never()).create(any(org.egov.user.domain.model.User.class));
	}

	@Test
    @Ignore
	public void test_should_update_a_valid_user() {
		User domainUser = validDomainUser(false);
		User user = User.builder().build();
		final User expectedUser = User.builder().build();
		Mockito.doNothing().when(userRepository).update(any(org.egov.user.domain.model.User.class), any(User.class));
		when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(user));
		when(userService.getUniqueUser(anyString(), anyString(), any(UserType.class))).thenReturn
                (expectedUser);

		User returnedUser = userService.updateWithoutOtpValidation(domainUser);

		assertEquals(expectedUser, returnedUser);
	}

	@Test(expected = AtleastOneRoleCodeException.class)
	public void test_should_validate_user_on_update() {
        org.egov.user.domain.model.User domainUser = User.builder().uuid("xyz").build();
		User user = User.builder().build();
		Mockito.doNothing().when(userRepository).update(any(org.egov.user.domain.model.User.class), any(org.egov.user
				.domain
				.model.User
				.class));
		when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(user));
		userService.updateWithoutOtpValidation( domainUser);
		verify(domainUser).validateUserModification();
	}

//	@Ignore
////	@Test(expected = DuplicateUserNameException.class)
////	public void test_should_throw_error_when_username_exists_while_updating() throws Exception {
////		User domainUser = validDomainUser(false);
////		when(userRepository.isUserPresent(any(String.class), any(String.class))).thenReturn(true);
////
////		userService.updateWithoutOtpValidation(1L, domainUser);
////	}

	@Test(expected = UserNotFoundException.class)
	public void test_should_throw_error_when_user_not_exists_while_updating() throws Exception {
		User domainUser = validDomainUser(false);
		when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.emptyList());

		userService.updateWithoutOtpValidation( domainUser);
	}

	@Test(expected = UserNotFoundException.class)
	public void test_should_throw_exception_on_partial_update_when_id_is_not_present() {
		final User user = User.builder().uuid(null).build();

		userService.partialUpdate(user);
	}

	@Ignore
	@Test
	public void test_should_nullify_fields_that_are_not_allowed_to_be_updated() {
		final User user = mock(User.class);

		userService.partialUpdate(user);

		verify(user).nullifySensitiveFields();
	}

	@Ignore
	@Test
	public void test_should_partially_update_user() {
		final User user = mock(User.class);
		final long userId = 123L;
		when(user.getId()).thenReturn(userId);

		userService.partialUpdate(user);

		verify(userRepository).update(user, user);
	}

	@Test(expected = UserProfileUpdateDeniedException.class)
	public void test_should_throw_exception_when_logged_in_user_is_different_from_user_being_updated() {
		final User user = User.builder().id(12L).username("xyz").uuid("zyz").type(UserType.CITIZEN).loggedInUserId(11L)
                .tenantId
                ("default").build();
        when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(user));

		userService.partialUpdate(user);
	}

	@Test
    @Ignore
	public void test_should_validate_update_password_request() {
		final LoggedInUserUpdatePasswordRequest updatePasswordRequest = LoggedInUserUpdatePasswordRequest.builder()
                .userName("xyz")
                .tenantId("default")
                .type(UserType.CITIZEN)
                .newPassword("newPassword")
                .existingPassword("existingPassword")
                .build();
        User user = User.builder().username("xyz").tenantId("default").type(UserType.CITIZEN).build();
		when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(user));
		when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

		userService.updatePasswordForLoggedInUser(updatePasswordRequest);

		verify(updatePasswordRequest).validate();
	}
	
	@Test(expected = InvalidUpdatePasswordRequestException.class)
	public void test_should_throwexception_incaseofloginotpenabledastrue_forcitizen_update_password_request() {
		userService = new UserService(userRepository, otpRepository,fileRepository, passwordEncoder,
			tokenStore,	DEFAULT_PASSWORD_EXPIRY_IN_DAYS,
				true,isEmployeeLoginOtpBased);
		User user = User.builder().username("xyz").tenantId("default").type(UserType.CITIZEN).build();
		when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(user));
        final LoggedInUserUpdatePasswordRequest updatePasswordRequest = LoggedInUserUpdatePasswordRequest.builder()
                .userName("xyz")
                .tenantId("default")
                .type(UserType.CITIZEN)
                .newPassword("newPassword")
                .existingPassword("existingPassword")
                .build();

		userService.updatePasswordForLoggedInUser(updatePasswordRequest);
	}
	
	@Test(expected = InvalidUpdatePasswordRequestException.class)
	public void test_should_throwexception_incaseofloginotpenabledastrue_foremployee_update_password_request() {
		userService = new UserService(userRepository, otpRepository,fileRepository, passwordEncoder,
			tokenStore,	DEFAULT_PASSWORD_EXPIRY_IN_DAYS,
				false,true);
        User user = User.builder().username("xyz").tenantId("default").type(UserType.EMPLOYEE).build();
		when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(user));
        final LoggedInUserUpdatePasswordRequest updatePasswordRequest = LoggedInUserUpdatePasswordRequest.builder()
                .userName("xyz")
                .tenantId("default")
                .type(UserType.CITIZEN)
                .newPassword("newPassword")
                .existingPassword("existingPassword")
                .build();
		userService.updatePasswordForLoggedInUser(updatePasswordRequest);
	}

	@Test(expected = UserNotFoundException.class)
	public void test_should_throw_exception_when_attempting_to_update_password_for_a_user_that_does_not_exist() {
		final LoggedInUserUpdatePasswordRequest updatePasswordRequest = mock(LoggedInUserUpdatePasswordRequest.class);
		when(updatePasswordRequest.getUserName()).thenReturn("abcd");
		when(updatePasswordRequest.getTenantId()).thenReturn("tenantId");
		when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.emptyList());

		userService.updatePasswordForLoggedInUser(updatePasswordRequest);
	}

	@Test(expected = PasswordMismatchException.class)
	public void test_should_throw_exception_when_existing_password_does_not_match_on_attempting_to_update_user() {
        final LoggedInUserUpdatePasswordRequest updatePasswordRequest = LoggedInUserUpdatePasswordRequest.builder()
                .userName("xyz")
                .tenantId("default")
                .type(UserType.CITIZEN)
                .newPassword("newPassword")
                .existingPassword("existingPassword")
                .build();
        User user = User.builder().username("xyz").tenantId("default").type(UserType.CITIZEN).password("existingPasswordEncoded").build();
		when(passwordEncoder.matches("wrongPassword", "existingPasswordEncoded")).thenReturn(false);
		when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(user));

		userService.updatePasswordForLoggedInUser(updatePasswordRequest);
	}

	@Test
	public void test_should_update_password_for_logged_in_user() {
        final LoggedInUserUpdatePasswordRequest updatePasswordRequest = LoggedInUserUpdatePasswordRequest.builder()
                .userName("xyz")
                .tenantId("default")
                .type(UserType.CITIZEN)
                .newPassword("newPassword")
                .existingPassword("existingPassword")
                .build();
        User domainUser = User.builder().username("xyz").tenantId("default").type(UserType.CITIZEN).password("existingPasswordEncoded").build();
		when(passwordEncoder.matches("existingPassword", "existingPasswordEncoded")).thenReturn(true);
		when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(domainUser));

		userService.updatePasswordForLoggedInUser(updatePasswordRequest);

//		verify(domainUser).updatePassword(updatePasswordRequest.getNewPassword());
		verify(userRepository).update(domainUser, domainUser);
	}

	@Test
	public void test_should_validate_request_when_updating_password_for_non_logged_in_user() {
		final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
                .userName("xyz")
                .tenantId("default")
                .type(UserType.SYSTEM)
                .newPassword("newPassword")
                .otpReference("123456")
                .build();
		when(otpRepository.isOtpValidationComplete(any())).thenReturn(true);
		final User domainUser = User.builder().type(UserType.SYSTEM).build();
		when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(domainUser));

		userService.updatePasswordForNonLoggedInUser(request);

	}

	@Test(expected = UserNotFoundException.class)
	public void test_should_throw_exception_when_user_does_not_exist_when_updating_password_for_non_logged_in_user() {
		final NonLoggedInUserUpdatePasswordRequest request = mock(NonLoggedInUserUpdatePasswordRequest.class);
		when(otpRepository.isOtpValidationComplete(any())).thenReturn(true);
		when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.emptyList());

		userService.updatePasswordForNonLoggedInUser(request);
	}

	@Test
	public void test_should_update_existing_password_for_non_logged_in_user() throws Exception {
        final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
                .userName("xyz")
                .tenantId("default")
                .type(UserType.SYSTEM)
                .otpReference("123456")
                .newPassword("newPassword")
                .build();
		when(otpRepository.validateOtp(any())).thenReturn(true);
		final User domainUser = mock(User.class);
		when(domainUser.getPassword()).thenReturn("newPassword");
		when(domainUser.getType()).thenReturn(UserType.SYSTEM);
		when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(domainUser));
        when(userService.encryptPwd(anyString())).thenReturn("newPassword");
		userService.updatePasswordForNonLoggedInUser(request);

		verify(domainUser).updatePassword("newPassword");
	}

	@SuppressWarnings("unchecked")
	@Test(expected = Exception.class)
	public void test_notshould_update_existing_password_for_non_logged_in_user() throws Exception {
        final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
                .userName("xyz")
                .tenantId("default")
                .type(UserType.SYSTEM)
                .otpReference("123456")
                .newPassword("newPassword")
                .build();
		when(otpRepository.validateOtp(any())).thenThrow(Exception.class);
		final User domainUser = mock(User.class);
		when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(domainUser));

		userService.updatePasswordForNonLoggedInUser(request);

		verify(domainUser).updatePassword("newPassword");
	}

	@SuppressWarnings("unchecked")
	@Test(expected = InvalidUpdatePasswordRequestException.class)
	public void test_notshould_update_password_whenCitizenotpconfigured_istrue() throws Exception {
		userService = new UserService(userRepository, otpRepository,fileRepository, passwordEncoder,
			tokenStore,	DEFAULT_PASSWORD_EXPIRY_IN_DAYS,
				true,false);
        final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
                .otpReference("123456")
                .userName("xyz")
                .tenantId("default")
                .type(UserType.CITIZEN)
                .newPassword("newPassword")
                .build();
		when(otpRepository.validateOtp(any())).thenThrow(Exception.class);
		final User domainUser = mock(User.class);
		when(domainUser.getType()).thenReturn(UserType.CITIZEN);
		when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(domainUser));
		userService.updatePasswordForNonLoggedInUser(request);
	}
	
	@SuppressWarnings("unchecked")
	@Test(expected = InvalidNonLoggedInUserUpdatePasswordRequestException.class)
	public void test_notshould_update_password_whenEmployeeotpconfigured_istrue() throws Exception {
		userService = new UserService(userRepository, otpRepository,fileRepository, passwordEncoder,
			tokenStore,	DEFAULT_PASSWORD_EXPIRY_IN_DAYS,
				false,true);
        final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
                .userName("xyz")
                .tenantId("default")
                .type(UserType.EMPLOYEE)
                .newPassword("newPassword")
                .build();
		when(otpRepository.validateOtp(any())).thenThrow(Exception.class);
		final User domainUser = mock(User.class);
		when(domainUser.getType()).thenReturn(UserType.EMPLOYEE);
		when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(domainUser));
		userService.updatePasswordForNonLoggedInUser(request);
	}
	
	@Ignore
	@Test
	public void test_should_create_a_valid_citizen_WithOtp() throws Exception {
		org.egov.user.domain.model.User domainUser = mock(User.class);
		when((domainUser.getOtpValidationRequest())).thenReturn(getExpectedRequest());
		// when(otpRepository.isOtpValidationComplete(getExpectedRequest())).thenReturn(true);
		when(otpRepository.validateOtp((getOtpValidationRequest()))).thenReturn(true);
		final User expectedUser = User.builder().build();
		when(userRepository.create(domainUser)).thenReturn(expectedUser);

		User returnedUser = userService.createCitizen(domainUser);

		assertEquals(expectedUser, returnedUser);
	}
	
	private OtpValidateRequest getOtpValidationRequest() {

		RequestInfo requestInfo = RequestInfo.builder().build();

		Otp otp = Otp.builder().identity("12121212").otp("23456").tenantId("default").build();

		return OtpValidateRequest.builder().requestInfo(requestInfo).otp(otp).build();

	}

	@Test
	public void test_should_persist_changes_on_updating_password_for_non_logged_in_user() {
		final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
				.userName("mobileNumber").tenantId("tenant").type(UserType.CITIZEN).otpReference("otpReference")
                .newPassword
						("newPassword")
				.build();
		final OtpValidationRequest expectedRequest = OtpValidationRequest.builder().otpReference("otpReference")
				.mobileNumber("mobileNumber").tenantId("tenant").build();
		when(otpRepository.isOtpValidationComplete(expectedRequest)).thenReturn(true);
		final User domainUser =User.builder().type(UserType.SYSTEM).build();
		when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(domainUser));

		userService.updatePasswordForNonLoggedInUser(request);

		verify(userRepository).update(domainUser, domainUser);
	}

	private org.egov.user.domain.model.User validDomainUser(boolean otpValidationMandatory) {
		return User.builder().username("supandi_rocks").name("Supandi").gender(Gender.MALE).type(UserType.CITIZEN)
				.active(Boolean.TRUE).mobileNumber("9988776655").tenantId("tenantId").otpReference("12312")
				.password("password").roles(Collections.singleton(Role.builder().code("roleCode1").build()))
				.accountLocked(false).otpValidationMandatory(otpValidationMandatory).build();
	}

	private OtpValidationRequest getExpectedRequest() {
		return OtpValidationRequest.builder().otpReference("12312").tenantId("tenantId").mobileNumber("9988776655")
				.build();
	}

	private User getUserObject() {
		return User.builder().id(ID.get(0)).emailId(EMAIL).username(USER_NAME).build();
	}
}