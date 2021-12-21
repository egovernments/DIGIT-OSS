package org.egov.user.domain.model;

import org.egov.user.domain.exception.InvalidNonLoggedInUserUpdatePasswordRequestException;
import org.egov.user.domain.model.enums.UserType;
import org.junit.Test;

import static org.junit.Assert.*;

public class NonLoggedInUserUpdatePasswordRequestTest {

    private static final String NEW_PASSWORD_KEY = "newPassword";
    private static final String USER_NAME_KEY = "userName";
    private static final String OPT_REFERENCE_KEY = "otpReference";
    private static final String TENANT_ID_KEY = "tenantId";

    @Test
    public void test_should_not_throw_exception_when_all_mandatory_fields_are_present() {
        final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
                .tenantId("tenant")
                .newPassword(NEW_PASSWORD_KEY)
                .userName(USER_NAME_KEY)
                .tenantId("ap.public")
                .type(UserType.CITIZEN)
                .otpReference(OPT_REFERENCE_KEY)
                .build();

        request.validate();

        assertFalse(request.isTenantIdAbsent());
        assertFalse(request.isUsernameAbsent());
        assertFalse(request.isNewPasswordAbsent());
        assertFalse(request.isOtpReferenceAbsent());
    }

    @Test(expected = InvalidNonLoggedInUserUpdatePasswordRequestException.class)
    public void test_should_throw_exception_when_tenant_id_is_not_present() {
        final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
                .tenantId(null)
                .newPassword(NEW_PASSWORD_KEY)
                .userName(USER_NAME_KEY)
                .otpReference(OPT_REFERENCE_KEY)
                .build();

        request.validate();
    }

    @Test
    public void test_should_return_true_when_tenant_is_not_present() {
        final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
                .tenantId(null)
                .newPassword(NEW_PASSWORD_KEY)
                .userName(USER_NAME_KEY)
                .otpReference(OPT_REFERENCE_KEY)
                .build();

        assertTrue(request.isTenantIdAbsent());
    }

    @Test(expected = InvalidNonLoggedInUserUpdatePasswordRequestException.class)
    public void test_should_throw_exception_when_new_password_is_not_present() {
        final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
                .tenantId(TENANT_ID_KEY)
                .newPassword(null)
                .userName(USER_NAME_KEY)
                .otpReference(OPT_REFERENCE_KEY)
                .build();

        request.validate();
    }

    @Test
    public void test_should_return_true_when_new_password_is_not_present() {
        final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
                .tenantId(TENANT_ID_KEY)
                .newPassword(null)
                .userName(USER_NAME_KEY)
                .otpReference(OPT_REFERENCE_KEY)
                .build();

        assertTrue(request.isNewPasswordAbsent());
    }

    @Test(expected = InvalidNonLoggedInUserUpdatePasswordRequestException.class)
    public void test_should_throw_exception_when_mobile_number_is_not_present() {
        final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
                .tenantId(TENANT_ID_KEY)
                .newPassword(NEW_PASSWORD_KEY)
                .userName(null)
                .otpReference(OPT_REFERENCE_KEY)
                .build();

        request.validate();
    }

    @Test
    public void test_should_return_true_when_mobile_number_is_not_present() {
        final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
                .tenantId(TENANT_ID_KEY)
                .newPassword(NEW_PASSWORD_KEY)
                .userName(null)
                .otpReference(OPT_REFERENCE_KEY)
                .build();

        assertTrue(request.isUsernameAbsent());
    }

    @Test(expected = InvalidNonLoggedInUserUpdatePasswordRequestException.class)
    public void test_should_throw_exception_when_otp_reference_is_not_present() {
        final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
                .tenantId(TENANT_ID_KEY)
                .newPassword(NEW_PASSWORD_KEY)
                .userName(USER_NAME_KEY)
                .otpReference(null)
                .build();

        request.validate();
    }

    @Test
    public void test_should_return_true_when_otp_reference_is_not_present() {
        final NonLoggedInUserUpdatePasswordRequest request = NonLoggedInUserUpdatePasswordRequest.builder()
                .tenantId(TENANT_ID_KEY)
                .newPassword(NEW_PASSWORD_KEY)
                .userName(USER_NAME_KEY)
                .otpReference(null)
                .build();

        assertTrue(request.isOtpReferenceAbsent());
    }

    @Test
    public void test_equality_should_return_true_when_both_instances_have_same_field_values() {
        final NonLoggedInUserUpdatePasswordRequest request1 = NonLoggedInUserUpdatePasswordRequest.builder()
                .tenantId(TENANT_ID_KEY)
                .newPassword(NEW_PASSWORD_KEY)
                .userName(USER_NAME_KEY)
                .otpReference(OPT_REFERENCE_KEY)
                .build();

        final NonLoggedInUserUpdatePasswordRequest request2 = NonLoggedInUserUpdatePasswordRequest.builder()
                .tenantId(TENANT_ID_KEY)
                .newPassword(NEW_PASSWORD_KEY)
                .userName(USER_NAME_KEY)
                .otpReference(OPT_REFERENCE_KEY)
                .build();

        assertTrue(request1.equals(request2));
    }

    @Test
    public void test_hash_code_should_be_same_when_both_instances_have_same_field_values() {
        final NonLoggedInUserUpdatePasswordRequest request1 = NonLoggedInUserUpdatePasswordRequest.builder()
                .tenantId(TENANT_ID_KEY)
                .newPassword(NEW_PASSWORD_KEY)
                .userName(USER_NAME_KEY)
                .otpReference(OPT_REFERENCE_KEY)
                .build();

        final NonLoggedInUserUpdatePasswordRequest request2 = NonLoggedInUserUpdatePasswordRequest.builder()
                .tenantId(TENANT_ID_KEY)
                .newPassword(NEW_PASSWORD_KEY)
                .userName(USER_NAME_KEY)
                .otpReference(OPT_REFERENCE_KEY)
                .build();

        assertEquals(request1.hashCode(), request2.hashCode());
    }

    @Test
    public void test_equality_should_return_false_when_both_instances_have_different_field_values() {
        final NonLoggedInUserUpdatePasswordRequest request1 = NonLoggedInUserUpdatePasswordRequest.builder()
                .tenantId("tenantId1")
                .newPassword("newPassword1")
                .userName("userName1")
                .otpReference("otpReference1")
                .build();

        final NonLoggedInUserUpdatePasswordRequest request2 = NonLoggedInUserUpdatePasswordRequest.builder()
                .tenantId("tenantId2")
                .newPassword("newPassword2")
                .userName("userName2")
                .otpReference("otpReference2")
                .build();

        assertFalse(request1.equals(request2));
    }

    @Test
    public void test_hash_code_should_be_different_when_both_instances_have_different_field_values() {
        final NonLoggedInUserUpdatePasswordRequest request1 = NonLoggedInUserUpdatePasswordRequest.builder()
                .tenantId("tenantId1")
                .newPassword("newPassword1")
                .userName("userName1")
                .otpReference("otpReference1")
                .build();

        final NonLoggedInUserUpdatePasswordRequest request2 = NonLoggedInUserUpdatePasswordRequest.builder()
                .tenantId("tenantId2")
                .newPassword("newPassword2")
                .userName("userName2")
                .otpReference("otpReference2")
                .build();

        assertNotEquals(request1.hashCode(), request2.hashCode());
    }

}