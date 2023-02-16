package org.egov.user.domain.service;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.user.domain.exception.*;
import org.egov.user.domain.model.*;
import org.egov.user.domain.model.enums.Gender;
import org.egov.user.domain.model.enums.UserType;
import org.egov.user.domain.service.utils.EncryptionDecryptionUtil;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.provider.token.TokenStore;

import javax.annotation.PostConstruct;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.spy;

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
    private EncryptionDecryptionUtil encryptionDecryptionUtil;
    private TokenStore tokenStore;

    private UserService userService;

    private final List<Long> ID = Arrays.asList(1L, 2L);
    private final String EMAIL = "email@gmail.com";
    private final String USER_NAME = "userName";
    private final String TENANT_ID = "tenantId";
    private final boolean isCitizenLoginOtpBased = false;
    private final boolean isEmployeeLoginOtpBased = false;
    private String pwdRegex = "((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%])(?=\\S+$))";
    private Integer pwdMaxLength = 15;
    private Integer pwdMinLength = 8;


    @Before
    public void before() {
        userService = new UserService(userRepository, otpRepository, fileRepository, passwordEncoder, encryptionDecryptionUtil,
                tokenStore, DEFAULT_PASSWORD_EXPIRY_IN_DAYS,
                isCitizenLoginOtpBased, isEmployeeLoginOtpBased, pwdRegex, pwdMaxLength, pwdMinLength);
    }


    @Test
    public void test_should_search_for_users() {
        UserSearchCriteria userSearch = mock(UserSearchCriteria.class);
        List<org.egov.user.domain.model.User> expectedListOfUsers = new ArrayList<org.egov.user.domain.model.User>();
        when(userRepository.findAll(userSearch)).thenReturn(expectedListOfUsers);
        when(encryptionDecryptionUtil.encryptObject(userSearch, "User", UserSearchCriteria.class)).thenReturn(userSearch);
        when(encryptionDecryptionUtil.decryptObject(expectedListOfUsers, null, User.class, getValidRequestInfo())).thenReturn(expectedListOfUsers);
        List<org.egov.user.domain.model.User> actualResult = userService.searchUsers(userSearch, true, getValidRequestInfo());

        assertThat(expectedListOfUsers).isEqualTo(actualResult);
    }

    @Test
    public void test_should_validate_search_critieria() {
        UserSearchCriteria userSearch = mock(UserSearchCriteria.class);
        List<org.egov.user.domain.model.User> expectedListOfUsers = new ArrayList<org.egov.user.domain.model.User>();
        when(userRepository.findAll(userSearch)).thenReturn(expectedListOfUsers);
        when(encryptionDecryptionUtil.decryptObject(expectedListOfUsers, null, User.class, getValidRequestInfo())).thenReturn(expectedListOfUsers);
        userService.searchUsers(userSearch, true, getValidRequestInfo());

        verify(userSearch).validate(true);
    }

    @Test
    public void test_should_save_a_valid_user() {
        org.egov.user.domain.model.User domainUser = validDomainUser(false);
        when(otpRepository.isOtpValidationComplete(getExpectedRequest())).thenReturn(true);
        final User expectedEntityUser = User.builder().build();
        when(userRepository.create(domainUser)).thenReturn(expectedEntityUser);

        when(encryptionDecryptionUtil.encryptObject(domainUser, "User", User.class)).thenReturn(domainUser);
        when(encryptionDecryptionUtil.decryptObject(expectedEntityUser, "UserSelf", User.class,
                getValidRequestInfo())).thenReturn(expectedEntityUser);
        User returnedUser = userService.createUser(domainUser, getValidRequestInfo());

        assertEquals(expectedEntityUser, returnedUser);
    }

    @Test
    public void test_should_set_pre_defined_expiry_on_creating_user() {
        org.egov.user.domain.model.User domainUser = mock(User.class);
        when(otpRepository.isOtpValidationComplete(getExpectedRequest())).thenReturn(true);
        final User expectedEntityUser = User.builder().build();
        when(userRepository.create(domainUser)).thenReturn(expectedEntityUser);
        when(encryptionDecryptionUtil.encryptObject(domainUser, "User", User.class)).thenReturn(domainUser);
        userService.createUser(domainUser, any());

        verify(domainUser).setDefaultPasswordExpiry(DEFAULT_PASSWORD_EXPIRY_IN_DAYS);
    }

    @Test
    public void test_should_create_a_valid_citizen() {
        org.egov.user.domain.model.User domainUser = mock(User.class);
        when((domainUser.getOtpValidationRequest())).thenReturn(getExpectedRequest());
        when(otpRepository.isOtpValidationComplete(getExpectedRequest())).thenReturn(true);
        final User expectedUser = User.builder().build();
        when(domainUser.getTenantId()).thenReturn("default");
        when(domainUser.getPassword()).thenReturn("P@assw0rd");
        when(userRepository.create(domainUser)).thenReturn(expectedUser);
        when(encryptionDecryptionUtil.encryptObject(domainUser, "User", User.class)).thenReturn(domainUser);
        when(encryptionDecryptionUtil.decryptObject(expectedUser, "UserSelf", User.class, getValidRequestInfo())).thenReturn(expectedUser);
        User returnedUser = userService.createCitizen(domainUser, getValidRequestInfo());

        assertEquals(expectedUser, returnedUser);
    }

    @Test(expected = UserNameNotValidException.class)
    public void test_should_not_create_citizenWithWrongUserName() {
        userService = new UserService(userRepository, otpRepository, fileRepository, passwordEncoder,
                encryptionDecryptionUtil, tokenStore, DEFAULT_PASSWORD_EXPIRY_IN_DAYS,
                true, false, pwdRegex, pwdMaxLength, pwdMinLength);
        org.egov.user.domain.model.User domainUser = User.builder().username("TestUser").name("Test").active(true)
                .tenantId("default").mobileNumber("123456789").type(UserType.CITIZEN).build();
        userService.createCitizen(domainUser, getValidRequestInfo());
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

        User returnedUser = userService.createCitizen(domainUser, any());

        assertEquals(expectedUser, returnedUser);
    }

    private org.egov.user.web.contract.OtpValidateRequest buildOtpValidationRequest() {
        // TODO Auto-generated method stub
        RequestInfo requestInfo = RequestInfo.builder().action("validate").ts(System.currentTimeMillis()).build();
        Otp otp = Otp.builder().build();
        org.egov.user.web.contract.OtpValidateRequest otpValidationRequest = org.egov.user.web.contract.OtpValidateRequest
                .builder().requestInfo(requestInfo).otp(otp).build();
        return otpValidationRequest;
    }

    @Test
    public void test_should_set_pre_defined_expiry_on_creating_citizen() {
        org.egov.user.domain.model.User domainUser = mock(User.class);
        when(domainUser.getTenantId()).thenReturn("default");
        when(domainUser.getPassword()).thenReturn("P@assw0rd");
        when((domainUser.getOtpValidationRequest())).thenReturn(getExpectedRequest());
        when(otpRepository.isOtpValidationComplete(getExpectedRequest())).thenReturn(true);
        final User expectedUser = User.builder().build();
        when(userRepository.create(domainUser)).thenReturn(expectedUser);

        when(encryptionDecryptionUtil.encryptObject(domainUser, "User", User.class)).thenReturn(domainUser);
        when(encryptionDecryptionUtil.decryptObject(expectedUser, "User", User.class, getValidRequestInfo())).thenReturn(expectedUser);
        userService.createCitizen(domainUser, getValidRequestInfo());

        verify(domainUser).setDefaultPasswordExpiry(DEFAULT_PASSWORD_EXPIRY_IN_DAYS);
    }

    @Test
    public void test_should_set_role_to_citizen_when_creating_a_citizen() {
        org.egov.user.domain.model.User domainUser = mock(User.class);
        when(domainUser.getTenantId()).thenReturn("default");
        when(domainUser.getPassword()).thenReturn("P@assw0rd");
        when(domainUser.getOtpValidationRequest()).thenReturn(getExpectedRequest());
        when(otpRepository.isOtpValidationComplete(getExpectedRequest())).thenReturn(true);
        final User expectedEntityUser = User.builder().build();
        when(userRepository.create(domainUser)).thenReturn(expectedEntityUser);
        when(encryptionDecryptionUtil.encryptObject(domainUser, "User", User.class)).thenReturn(domainUser);
        userService.createCitizen(domainUser, getValidRequestInfo());

        verify(domainUser).setRoleToCitizen();
    }

    @Test(expected = DuplicateUserNameException.class)
    public void test_should_raise_exception_when_duplicate_user_name_exists() throws Exception {
        org.egov.user.domain.model.User domainUser = validDomainUser(false);
        when(otpRepository.isOtpValidationComplete(getExpectedRequest())).thenReturn(true);
        when(userRepository.isUserPresent("supandi_rocks", "tenantId", UserType.CITIZEN)).thenReturn(true);
        when(encryptionDecryptionUtil.encryptObject(domainUser, "User", User.class)).thenReturn(domainUser);
        userService.createUser(domainUser, getValidRequestInfo());
    }

    @Test(expected = OtpValidationPendingException.class)
    public void test_exception_is_raised_when_otp_validation_fails() throws Exception {
        org.egov.user.domain.model.User domainUser = validDomainUser(false);
        domainUser.setOtpValidationMandatory(true);
        when(otpRepository.isOtpValidationComplete(getExpectedRequest())).thenReturn(false);

        userService.createUser(domainUser, any());
    }

    @Test
    public void test_otp_is_not_validated_when_validation_flag_is_false() throws Exception {
        org.egov.user.domain.model.User domainUser = validDomainUser(false);
        when(otpRepository.isOtpValidationComplete(getExpectedRequest())).thenReturn(false);
        when(encryptionDecryptionUtil.encryptObject(domainUser, "User", User.class)).thenReturn(domainUser);
        userService.createUser(domainUser, getValidRequestInfo());

        verify(otpRepository, never()).isOtpValidationComplete(getExpectedRequest());
    }

    @Test(expected = InvalidUserCreateException.class)
    public void test_should_raise_exception_when_user_is_invalid() throws Exception {
        org.egov.user.domain.model.User domainUser = org.egov.user.domain.model.User.builder().build();

        userService.createUser(domainUser, getValidRequestInfo());
        verify(userRepository, never()).create(any(org.egov.user.domain.model.User.class));
    }

    @Test
    @Ignore
    public void test_should_update_a_valid_user() {
        User domainUser = validDomainUser(false);
        User user = User.builder().build();
        final User expectedUser = User.builder().build();
        Mockito.doNothing().when(userRepository).update(any(org.egov.user.domain.model.User.class), any(User.class),any(Long.class), any(String.class) );
        when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(user));
        when(userService.getUniqueUser(anyString(), anyString(), any(UserType.class))).thenReturn
                (expectedUser);

        User returnedUser = userService.updateWithoutOtpValidation(domainUser, any());

        assertEquals(expectedUser, returnedUser);
    }

    @Test(expected = AtleastOneRoleCodeException.class)
    public void test_should_validate_user_on_update() {
        org.egov.user.domain.model.User domainUser = User.builder().uuid("xyz").build();
        User user = User.builder().build();
        Mockito.doNothing().when(userRepository).update(any(org.egov.user.domain.model.User.class), any(org.egov.user
                .domain
                .model.User
                .class),any(Long.class) , any(String.class));
        when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(user));
        userService.updateWithoutOtpValidation(domainUser, any());
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

        userService.updateWithoutOtpValidation(domainUser, getValidRequestInfo());
    }

    @Test(expected = UserNotFoundException.class)
    public void test_should_throw_exception_on_partial_update_when_id_is_not_present() {
        final User user = User.builder().uuid(null).build();
        when(encryptionDecryptionUtil.encryptObject(user, "User", User.class)).thenReturn(user);
        userService.partialUpdate(user, getValidRequestInfo());
    }

    @Ignore
    @Test
    public void test_should_nullify_fields_that_are_not_allowed_to_be_updated() {
        final User user = mock(User.class);

        userService.partialUpdate(user, any());

        verify(user).nullifySensitiveFields();
    }

    @Ignore
    @Test
    public void test_should_partially_update_user() {
        final User user = mock(User.class);
        final long userId = 123L;
        when(user.getId()).thenReturn(userId);

        userService.partialUpdate(user, any());

        verify(userRepository).update(user, user,user.getId() ,user.getUuid());
    }

    @Test(expected = UserProfileUpdateDeniedException.class)
    public void test_should_throw_exception_when_logged_in_user_is_different_from_user_being_updated() {
        final User user = User.builder().id(12L).username("xyz").uuid("zyz").type(UserType.CITIZEN).loggedInUserId(11L)
                .tenantId
                        ("default").build();
        when(encryptionDecryptionUtil.encryptObject(user, "User", User.class)).thenReturn(user);
        when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(user));
        when(encryptionDecryptionUtil.encryptObject(user, "User", User.class)).thenReturn(user);
        when(encryptionDecryptionUtil.decryptObject(user, "User", User.class, getValidRequestInfo())).thenReturn(user);
        userService.partialUpdate(user, getValidRequestInfo());
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
        userService = new UserService(userRepository, otpRepository, fileRepository, passwordEncoder,
                encryptionDecryptionUtil, tokenStore, DEFAULT_PASSWORD_EXPIRY_IN_DAYS,
                true, isEmployeeLoginOtpBased, pwdRegex, pwdMaxLength, pwdMinLength);
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
        userService = new UserService(userRepository, otpRepository, fileRepository, passwordEncoder,
                encryptionDecryptionUtil, tokenStore, DEFAULT_PASSWORD_EXPIRY_IN_DAYS,
                false, true, pwdRegex, pwdMaxLength, pwdMinLength);
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
                .newPassword("P@ssw0rd")
                .existingPassword("existingPassword")
                .build();
        Long id =(long) 123;
        User domainUser = User.builder().id(id).username("xyz").tenantId("default").type(UserType.CITIZEN).password("existingPasswordEncoded").build();
        when(passwordEncoder.matches("existingPassword", "existingPasswordEncoded")).thenReturn(true);
        when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(domainUser));

        userService.updatePasswordForLoggedInUser(updatePasswordRequest);

//		verify(domainUser).updatePassword(updatePasswordRequest.getNewPassword());
        verify(userRepository).update(domainUser, domainUser, domainUser.getId(), domainUser.getUuid() );
    }

    @Test
    public void test_should_validate_request_when_updating_password_for_non_logged_in_user() {
        final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
                .userName("xyz")
                .tenantId("default")
                .type(UserType.SYSTEM)
                .newPassword("P@ssw0rd")
                .otpReference("123456")
                .build();
        when(otpRepository.isOtpValidationComplete(any())).thenReturn(true);
        final User domainUser = User.builder().type(UserType.SYSTEM).build();
        when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(domainUser));
        when(encryptionDecryptionUtil.encryptObject(domainUser, "User", User.class)).thenReturn(domainUser);
        when(encryptionDecryptionUtil.decryptObject(domainUser, "User", User.class, getValidRequestInfo())).thenReturn(domainUser);
        userService.updatePasswordForNonLoggedInUser(request, getValidRequestInfo());

    }

    @Test(expected = UserNotFoundException.class)
    public void test_should_throw_exception_when_user_does_not_exist_when_updating_password_for_non_logged_in_user() {
        final NonLoggedInUserUpdatePasswordRequest request = mock(NonLoggedInUserUpdatePasswordRequest.class);
        when(otpRepository.isOtpValidationComplete(any())).thenReturn(true);
        when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.emptyList());

        userService.updatePasswordForNonLoggedInUser(request, getValidRequestInfo());
    }

    @Test
    public void test_should_update_existing_password_for_non_logged_in_user() throws Exception {
        final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
                .userName("xyz")
                .tenantId("default")
                .type(UserType.SYSTEM)
                .otpReference("123456")
                .newPassword("P@ssw0rd")
                .build();
        when(otpRepository.validateOtp(any())).thenReturn(true);
        final User domainUser = mock(User.class);
        when(domainUser.getPassword()).thenReturn("P@ssw0rd");
        when(domainUser.getType()).thenReturn(UserType.SYSTEM);
        when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(domainUser));
        when(encryptionDecryptionUtil.decryptObject(domainUser, "User", User.class, getValidRequestInfo())).thenReturn(domainUser);
        when(userService.encryptPwd(anyString())).thenReturn("P@ssw0rd");
        userService.updatePasswordForNonLoggedInUser(request, getValidRequestInfo());

        verify(domainUser).updatePassword("P@ssw0rd");
    }

    @SuppressWarnings("unchecked")
    @Test(expected = Exception.class)
    public void test_notshould_update_existing_password_for_non_logged_in_user() throws Exception {
        final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
                .userName("xyz")
                .tenantId("default")
                .type(UserType.SYSTEM)
                .otpReference("123456")
                .newPassword("nEwP@ssw0rd")
                .build();
        when(otpRepository.validateOtp(any())).thenThrow(Exception.class);
        final User domainUser = mock(User.class);
        when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(domainUser));

        userService.updatePasswordForNonLoggedInUser(request, any());

        verify(domainUser).updatePassword("newPassword");
    }

    @SuppressWarnings("unchecked")
    @Test(expected = InvalidUpdatePasswordRequestException.class)
    public void test_notshould_update_password_whenCitizenotpconfigured_istrue() throws Exception {
        userService = new UserService(userRepository, otpRepository, fileRepository, passwordEncoder,
                encryptionDecryptionUtil, tokenStore, DEFAULT_PASSWORD_EXPIRY_IN_DAYS,
                true, false, pwdRegex, pwdMaxLength, pwdMinLength);
        final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
                .otpReference("123456")
                .userName("xyz")
                .tenantId("default")
                .type(UserType.CITIZEN)
                .newPassword("nEwP@ssw0rd")
                .build();
        when(otpRepository.validateOtp(any())).thenThrow(Exception.class);
        final User domainUser = mock(User.class);
        when(domainUser.getType()).thenReturn(UserType.CITIZEN);
        when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(domainUser));
        userService.updatePasswordForNonLoggedInUser(request, getValidRequestInfo());
    }

    @SuppressWarnings("unchecked")
    @Test(expected = InvalidNonLoggedInUserUpdatePasswordRequestException.class)
    public void test_notshould_update_password_whenEmployeeotpconfigured_istrue() throws Exception {
        userService = new UserService(userRepository, otpRepository, fileRepository, passwordEncoder,
                encryptionDecryptionUtil, tokenStore, DEFAULT_PASSWORD_EXPIRY_IN_DAYS,
                false, true, pwdRegex, pwdMaxLength, pwdMinLength);
        final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
                .userName("xyz")
                .tenantId("default")
                .type(UserType.EMPLOYEE)
                .newPassword("nEwP@ssw0rd")
                .build();
        when(otpRepository.validateOtp(any())).thenThrow(Exception.class);
        final User domainUser = mock(User.class);
        when(domainUser.getType()).thenReturn(UserType.EMPLOYEE);
        when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(domainUser));
        userService.updatePasswordForNonLoggedInUser(request, getValidRequestInfo());
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

        User returnedUser = userService.createCitizen(domainUser, any());

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
                        ("nEwP@ssw0rd")
                .build();
        final OtpValidationRequest expectedRequest = OtpValidationRequest.builder().otpReference("otpReference")
                .mobileNumber("mobileNumber").tenantId("tenant").build();
        when(otpRepository.isOtpValidationComplete(expectedRequest)).thenReturn(true);
        final User domainUser = User.builder().type(UserType.SYSTEM).id((long)123).build();
        when(userRepository.findAll(any(UserSearchCriteria.class))).thenReturn(Collections.singletonList(domainUser));
        when(encryptionDecryptionUtil.decryptObject(domainUser, "User", User.class, getValidRequestInfo())).thenReturn(domainUser);
        when(encryptionDecryptionUtil.encryptObject(domainUser, "User", User.class)).thenReturn(domainUser);
        userService.updatePasswordForNonLoggedInUser(request, getValidRequestInfo());

        verify(userRepository).update(domainUser, domainUser,domainUser.getId(), domainUser.getUuid() );
    }

    private org.egov.user.domain.model.User validDomainUser(boolean otpValidationMandatory) {
        return User.builder().username("supandi_rocks").name("Supandi").gender(Gender.MALE).type(UserType.CITIZEN)
                .active(Boolean.TRUE).mobileNumber("9988776655").tenantId("tenantId").otpReference("12312")
                .password("P@ssw0rd").roles(Collections.singleton(Role.builder().code("roleCode1").build()))
                .accountLocked(false).otpValidationMandatory(otpValidationMandatory).build();
    }

    private OtpValidationRequest getExpectedRequest() {
        return OtpValidationRequest.builder().otpReference("12312").tenantId("tenantId").mobileNumber("9988776655")
                .build();
    }

    private RequestInfo getValidRequestInfo() {
        List<org.egov.common.contract.request.Role> roles = Collections.singletonList(org.egov.common.contract.request.Role.builder().code("roleCode1").build());
        org.egov.common.contract.request.User userInfo = org.egov.common.contract.request.User.builder().roles(roles).id((long)123).build();
        return RequestInfo.builder().userInfo(userInfo).build();
    }

    private User getUserObject() {
        return User.builder().id(ID.get(0)).emailId(EMAIL).username(USER_NAME).build();
    }
}