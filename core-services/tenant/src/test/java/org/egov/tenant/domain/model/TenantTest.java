package org.egov.tenant.domain.model;

import org.apache.commons.lang3.RandomStringUtils;
import org.egov.tenant.domain.exception.InvalidTenantDetailsException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class TenantTest {

    private static final String TENANT_CODE = "tenantcode";
    private static final String TENANT_DESCRIPTION = "description";
    private static final String TENANT_LOGO_ID = "logoId";
    private static final String TENANT_IMAGE_ID = "imageId";
    private static final String TENANT_DOMAIN_URL = "domainUrl";
    private static final String TENANT_TWITTER_URL = "twitterUrl";
    private static final String TENANT_FACEBOOK_URL = "faceBookUrl";
    private static final String TENANT_EMAIL_ID = "email";
    private static final String TENANT_ADDRESS = "address";
    private static final String TENANT_CONTACT_NUMBER = "contactNumber";
    private static final String TENANT_HELPLINE_NUMBER = "helpLineNumber";
    private static final String TENANT_OTHER_LOGO_ID = "logoid";

    @Mock
    City city;

    @Before
    public void setUp() {
        when(city.isValid()).thenReturn(true);
    }

    @Test(expected = InvalidTenantDetailsException.class)
    public void test_should_throw_exception_when_city_is_not_valid() {
        when(city.isValid()).thenReturn(false);

        Tenant tenant = Tenant.builder()
            .code(TENANT_CODE)
            .name("name")
            .description(TENANT_DESCRIPTION)
            .logoId(TENANT_LOGO_ID)
            .imageId(TENANT_IMAGE_ID)
            .domainUrl(TENANT_DOMAIN_URL)
            .type("CITY")
            .city(city)
            .twitterUrl(TENANT_TWITTER_URL)
            .facebookUrl(TENANT_FACEBOOK_URL)
            .emailId(TENANT_EMAIL_ID)
            .address(TENANT_ADDRESS)
            .contactNumber(TENANT_CONTACT_NUMBER)
            .helpLineNumber(TENANT_HELPLINE_NUMBER)
            .build();
        assertThat(tenant.isCityAbsent()).isFalse();
        tenant.validate();
    }

    @Test(expected = InvalidTenantDetailsException.class)
    public void test_should_throw_exception_when_city_is_not_present() {
        Tenant tenant = Tenant.builder()
            .code(TENANT_CODE)
            .name("name")
            .description(TENANT_DESCRIPTION)
            .logoId(TENANT_LOGO_ID)
            .imageId(TENANT_IMAGE_ID)
            .domainUrl(TENANT_DOMAIN_URL)
            .type("CITY")
            .twitterUrl(TENANT_TWITTER_URL)
            .facebookUrl(TENANT_FACEBOOK_URL)
            .address(TENANT_ADDRESS)
            .contactNumber(TENANT_CONTACT_NUMBER)
            .helpLineNumber(TENANT_HELPLINE_NUMBER)
            .emailId(TENANT_EMAIL_ID)
            .city(null)
            .build();

        assertThat(tenant.isCityAbsent()).isTrue();
        tenant.validate();
    }

    @Test(expected = InvalidTenantDetailsException.class)
    public void test_should_throw_exception_when_code_is_not_present() {
        Tenant tenant = Tenant.builder()
            .code(null)
            .name("name")
            .description(TENANT_DESCRIPTION)
            .logoId(TENANT_LOGO_ID)
            .imageId(TENANT_IMAGE_ID)
            .domainUrl(TENANT_DOMAIN_URL)
            .type("CITY")
            .city(city)
            .twitterUrl(TENANT_TWITTER_URL)
            .facebookUrl(TENANT_FACEBOOK_URL)
            .address(TENANT_ADDRESS)
            .contactNumber(TENANT_CONTACT_NUMBER)
            .helpLineNumber(TENANT_HELPLINE_NUMBER)
            .emailId(TENANT_EMAIL_ID)
            .build();

        assertThat(tenant.isCodeAbsent()).isTrue();
        tenant.validate();
    }

    @Test(expected = InvalidTenantDetailsException.class)
    public void test_should_throw_exception_when_code_is_empty() {
        Tenant tenant = Tenant.builder()
            .code("")
            .name("name")
            .description(TENANT_DESCRIPTION)
            .logoId(TENANT_LOGO_ID)
            .imageId(TENANT_IMAGE_ID)
            .domainUrl(TENANT_DOMAIN_URL)
            .type("CITY")
            .city(city)
            .twitterUrl(TENANT_TWITTER_URL)
            .facebookUrl(TENANT_FACEBOOK_URL)
            .address(TENANT_ADDRESS)
            .contactNumber(TENANT_CONTACT_NUMBER)
            .helpLineNumber(TENANT_HELPLINE_NUMBER)
            .emailId(TENANT_EMAIL_ID)
            .build();

        assertThat(tenant.isCodeAbsent()).isTrue();
        tenant.validate();
    }

    @Test(expected = InvalidTenantDetailsException.class)
    public void test_should_throw_exception_when_code_is_more_than_256_characters() {
        String code = RandomStringUtils.random(257);

        Tenant tenant = Tenant.builder()
            .code(code)
            .name("name")
            .description(TENANT_DESCRIPTION)
            .logoId(TENANT_LOGO_ID)
            .imageId(TENANT_IMAGE_ID)
            .domainUrl(TENANT_DOMAIN_URL)
            .type("CITY")
            .city(city)
            .twitterUrl(TENANT_TWITTER_URL)
            .facebookUrl(TENANT_FACEBOOK_URL)
            .address(TENANT_ADDRESS)
            .contactNumber(TENANT_CONTACT_NUMBER)
            .helpLineNumber(TENANT_HELPLINE_NUMBER)
            .emailId(TENANT_EMAIL_ID)
            .build();

        assertThat(tenant.isCodeOfInvalidLength()).isTrue();
        tenant.validate();
    }

    @Test(expected = InvalidTenantDetailsException.class)
    public void test_should_throw_exception_when_logoId_is_not_present() {
        Tenant tenant = Tenant.builder()
            .code(TENANT_CODE)
            .name("name")
            .description(TENANT_DESCRIPTION)
            .logoId(null)
            .imageId(TENANT_IMAGE_ID)
            .domainUrl(TENANT_DOMAIN_URL)
            .type("CITY")
            .city(city)
            .twitterUrl(TENANT_TWITTER_URL)
            .facebookUrl(TENANT_FACEBOOK_URL)
            .address(TENANT_ADDRESS)
            .contactNumber(TENANT_CONTACT_NUMBER)
            .helpLineNumber(TENANT_HELPLINE_NUMBER)
            .emailId(TENANT_EMAIL_ID)
            .build();

        assertThat(tenant.isLogoIdAbsent()).isTrue();
        tenant.validate();
    }

    @Test(expected = InvalidTenantDetailsException.class)
    public void test_should_throw_exception_when_logoId_is_empty() {
        Tenant tenant = Tenant.builder()
            .code(TENANT_CODE)
            .name("name")
            .description(TENANT_DESCRIPTION)
            .logoId("")
            .imageId(TENANT_IMAGE_ID)
            .domainUrl(TENANT_DOMAIN_URL)
            .type("CITY")
            .city(city)
            .twitterUrl(TENANT_TWITTER_URL)
            .facebookUrl(TENANT_FACEBOOK_URL)
            .address(TENANT_ADDRESS)
            .contactNumber(TENANT_CONTACT_NUMBER)
            .helpLineNumber(TENANT_HELPLINE_NUMBER)
            .emailId(TENANT_EMAIL_ID)
            .build();

        assertThat(tenant.isLogoIdAbsent()).isTrue();
        tenant.validate();
    }

    @Test(expected = InvalidTenantDetailsException.class)
    public void test_should_throw_exception_when_imageId_is_not_present() {
        Tenant tenant = Tenant.builder()
            .code(TENANT_CODE)
            .name("name")
            .description(TENANT_DESCRIPTION)
            .logoId(TENANT_OTHER_LOGO_ID)
            .imageId(null)
            .domainUrl(TENANT_DOMAIN_URL)
            .type("CITY")
            .city(city)
            .twitterUrl(TENANT_TWITTER_URL)
            .facebookUrl(TENANT_FACEBOOK_URL)
            .address(TENANT_ADDRESS)
            .contactNumber(TENANT_CONTACT_NUMBER)
            .helpLineNumber(TENANT_HELPLINE_NUMBER)
            .emailId(TENANT_EMAIL_ID)
            .build();

        assertThat(tenant.isImageIdAbsent()).isTrue();
        tenant.validate();
    }

    @Test(expected = InvalidTenantDetailsException.class)
    public void test_should_throw_exception_when_imageId_is_empty() {
        Tenant tenant = Tenant.builder()
            .code(TENANT_CODE)
            .name("name")
            .description(TENANT_DESCRIPTION)
            .logoId(TENANT_OTHER_LOGO_ID)
            .imageId("")
            .domainUrl(TENANT_DOMAIN_URL)
            .type("CITY")
            .city(city)
            .twitterUrl(TENANT_TWITTER_URL)
            .facebookUrl(TENANT_FACEBOOK_URL)
            .address(TENANT_ADDRESS)
            .contactNumber(TENANT_CONTACT_NUMBER)
            .helpLineNumber(TENANT_HELPLINE_NUMBER)
            .emailId(TENANT_EMAIL_ID)
            .build();

        assertThat(tenant.isImageIdAbsent()).isTrue();
        tenant.validate();
    }

    @Test(expected = InvalidTenantDetailsException.class)
    public void test_should_throw_exception_when_type_is_not_present() {
        Tenant tenant = Tenant.builder()
            .code(TENANT_CODE)
            .name("name")
            .description(TENANT_DESCRIPTION)
            .logoId(TENANT_OTHER_LOGO_ID)
            .imageId("imageid")
            .domainUrl(TENANT_DOMAIN_URL)
            .type(null)
            .city(city)
            .twitterUrl(TENANT_TWITTER_URL)
            .facebookUrl(TENANT_FACEBOOK_URL)
            .address(TENANT_ADDRESS)
            .contactNumber(TENANT_CONTACT_NUMBER)
            .helpLineNumber(TENANT_HELPLINE_NUMBER)
            .emailId(TENANT_EMAIL_ID)
            .build();

        assertThat(tenant.isTypeAbsent()).isTrue();
        tenant.validate();
    }

    @Test(expected = InvalidTenantDetailsException.class)
    public void test_should_throw_exception_when_type_is_invalid() {
        Tenant tenant = Tenant.builder()
            .code(TENANT_CODE)
            .name("name")
            .description(TENANT_DESCRIPTION)
            .logoId(TENANT_OTHER_LOGO_ID)
            .imageId("imageid")
            .domainUrl(TENANT_DOMAIN_URL)
            .type("INVALID")
            .city(city)
            .twitterUrl(TENANT_TWITTER_URL)
            .facebookUrl(TENANT_FACEBOOK_URL)
            .address(TENANT_ADDRESS)
            .contactNumber(TENANT_CONTACT_NUMBER)
            .helpLineNumber(TENANT_HELPLINE_NUMBER)
            .emailId(TENANT_EMAIL_ID)
            .build();

        assertThat(tenant.isTypeInvalid()).isTrue();
        tenant.validate();
    }
}