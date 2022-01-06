package org.egov.tenant.web.contract;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class TenantTest {

    private static final String TENANT_CODE = "AP.KURNOOL";
    private static final String TENANT_NAME = "kurnool";
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

    @Mock
    private City cityContract;

    @Test
    public void test_should_convert_contract_to_model() {

        org.egov.tenant.domain.model.City expectedCityModel = org.egov.tenant.domain.model.City.builder()
            .name("Bengaluru")
            .localName("localname")
            .districtCode("districtcode")
            .districtName("districtname")
            .regionName("regionname")
            .longitude(35.456)
            .latitude(75.443)
            .shapeFileLocation("shapeFileLocation")
            .captcha("captcha")
            .build();

        org.egov.tenant.domain.model.Tenant expectedTenantModel = org.egov.tenant.domain.model.Tenant.builder()
            .code(TENANT_CODE)
            .name(TENANT_NAME)
            .description(TENANT_DESCRIPTION)
            .logoId(TENANT_LOGO_ID)
            .imageId(TENANT_IMAGE_ID)
            .domainUrl(TENANT_DOMAIN_URL)
            .type("CITY")
            .twitterUrl(TENANT_TWITTER_URL)
            .facebookUrl(TENANT_FACEBOOK_URL)
            .emailId(TENANT_EMAIL_ID)
            .address(TENANT_ADDRESS)
            .contactNumber(TENANT_CONTACT_NUMBER)
            .helpLineNumber(TENANT_HELPLINE_NUMBER)
            .city(expectedCityModel)
            .build();

        when(cityContract.toDomain()).thenReturn(expectedCityModel);

        Tenant tenantContract = Tenant.builder()
            .code(TENANT_CODE)
            .name(TENANT_NAME)
            .description(TENANT_DESCRIPTION)
            .logoId(TENANT_LOGO_ID)
            .imageId(TENANT_IMAGE_ID)
            .domainUrl(TENANT_DOMAIN_URL)
            .type("CITY")
            .twitterUrl(TENANT_TWITTER_URL)
            .facebookUrl(TENANT_FACEBOOK_URL)
            .emailId(TENANT_EMAIL_ID)
            .address(TENANT_ADDRESS)
            .contactNumber(TENANT_CONTACT_NUMBER)
            .helpLineNumber(TENANT_HELPLINE_NUMBER)
            .city(cityContract)
            .build();


        org.egov.tenant.domain.model.Tenant actualTenantModel = tenantContract.toDomain();

        assertThat(actualTenantModel).isEqualTo(expectedTenantModel);

    }

    @Test
    public void test_should_not_convert_city_if_null() {
        Tenant tenantContract = Tenant.builder()
            .code(TENANT_CODE)
            .name(TENANT_NAME)
            .description(TENANT_DESCRIPTION)
            .logoId(TENANT_LOGO_ID)
            .imageId(TENANT_IMAGE_ID)
            .domainUrl(TENANT_DOMAIN_URL)
            .type("CITY")
            .twitterUrl(TENANT_TWITTER_URL)
            .facebookUrl(TENANT_FACEBOOK_URL)
            .emailId(TENANT_EMAIL_ID)
            .address(TENANT_ADDRESS)
            .contactNumber(TENANT_CONTACT_NUMBER)
            .helpLineNumber(TENANT_HELPLINE_NUMBER)
            .city(null)
            .build();

        org.egov.tenant.domain.model.Tenant actualTenantModel = tenantContract.toDomain();

        assertThat(actualTenantModel.getCity()).isNull();
    }

    @Test
    public void test_should_convert_model_to_contract() {
        org.egov.tenant.domain.model.City cityModel = mock(org.egov.tenant.domain.model.City.class);

        org.egov.tenant.domain.model.Tenant tenantModel = org.egov.tenant.domain.model.Tenant.builder()
            .code(TENANT_CODE)
            .name(TENANT_NAME)
            .description(TENANT_DESCRIPTION)
            .logoId(TENANT_LOGO_ID)
            .imageId(TENANT_IMAGE_ID)
            .domainUrl(TENANT_DOMAIN_URL)
            .type("CITY")
            .twitterUrl(TENANT_TWITTER_URL)
            .facebookUrl(TENANT_FACEBOOK_URL)
            .emailId(TENANT_EMAIL_ID)
            .address(TENANT_ADDRESS)
            .contactNumber(TENANT_CONTACT_NUMBER)
            .helpLineNumber(TENANT_HELPLINE_NUMBER)
            .city(cityModel)
            .build();

        City city = mock(City.class);

        Tenant tenantContract = new Tenant(tenantModel, city);

        assertThat(tenantContract.getCode()).isEqualTo(TENANT_CODE);
        assertThat(tenantContract.getName()).isEqualTo(TENANT_NAME);
        assertThat(tenantContract.getDescription()).isEqualTo(TENANT_DESCRIPTION);
        assertThat(tenantContract.getLogoId()).isEqualTo(TENANT_LOGO_ID);
        assertThat(tenantContract.getImageId()).isEqualTo(TENANT_IMAGE_ID);
        assertThat(tenantContract.getDomainUrl()).isEqualTo(TENANT_DOMAIN_URL);
        assertThat(tenantContract.getType()).isEqualTo("CITY");
        assertThat(tenantContract.getTwitterUrl()).isEqualTo(TENANT_TWITTER_URL);
        assertThat(tenantContract.getFacebookUrl()).isEqualTo(TENANT_FACEBOOK_URL);
        assertThat(tenantContract.getEmailId()).isEqualTo(TENANT_EMAIL_ID);
        assertThat(tenantContract.getAddress()).isEqualTo(TENANT_ADDRESS);
        assertThat(tenantContract.getContactNumber()).isEqualTo(TENANT_CONTACT_NUMBER);
        assertThat(tenantContract.getHelpLineNumber()).isEqualTo(TENANT_HELPLINE_NUMBER);
        assertThat(tenantContract.getCity()).isEqualTo(city);
    }
}