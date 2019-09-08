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
            .code("AP.KURNOOL")
            .name("kurnool")
            .description("description")
            .logoId("logoId")
            .imageId("imageId")
            .domainUrl("domainUrl")
            .type("CITY")
            .twitterUrl("twitterUrl")
            .facebookUrl("faceBookUrl")
            .emailId("email")
            .address("address")
            .contactNumber("contactNumber")
            .helpLineNumber("helpLineNumber")
            .city(expectedCityModel)
            .build();

        when(cityContract.toDomain()).thenReturn(expectedCityModel);

        Tenant tenantContract = Tenant.builder()
            .code("AP.KURNOOL")
            .name("kurnool")
            .description("description")
            .logoId("logoId")
            .imageId("imageId")
            .domainUrl("domainUrl")
            .type("CITY")
            .twitterUrl("twitterUrl")
            .facebookUrl("faceBookUrl")
            .emailId("email")
            .address("address")
            .contactNumber("contactNumber")
            .helpLineNumber("helpLineNumber")
            .city(cityContract)
            .build();


        org.egov.tenant.domain.model.Tenant actualTenantModel = tenantContract.toDomain();

        assertThat(actualTenantModel).isEqualTo(expectedTenantModel);

    }

    @Test
    public void test_should_not_convert_city_if_null() {
        Tenant tenantContract = Tenant.builder()
            .code("AP.KURNOOL")
            .name("kurnool")
            .description("description")
            .logoId("logoId")
            .imageId("imageId")
            .domainUrl("domainUrl")
            .type("CITY")
            .twitterUrl("twitterUrl")
            .facebookUrl("faceBookUrl")
            .emailId("email")
            .address("address")
            .contactNumber("contactNumber")
            .helpLineNumber("helpLineNumber")
            .city(null)
            .build();

        org.egov.tenant.domain.model.Tenant actualTenantModel = tenantContract.toDomain();

        assertThat(actualTenantModel.getCity()).isNull();
    }

    @Test
    public void test_should_convert_model_to_contract() {
        org.egov.tenant.domain.model.City cityModel = mock(org.egov.tenant.domain.model.City.class);

        org.egov.tenant.domain.model.Tenant tenantModel = org.egov.tenant.domain.model.Tenant.builder()
            .code("AP.KURNOOL")
            .name("kurnool")
            .description("description")
            .logoId("logoId")
            .imageId("imageId")
            .domainUrl("domainUrl")
            .type("CITY")
            .twitterUrl("twitterUrl")
            .facebookUrl("faceBookUrl")
            .emailId("email")
            .address("address")
            .contactNumber("contactNumber")
            .helpLineNumber("helpLineNumber")
            .city(cityModel)
            .build();

        City city = mock(City.class);

        Tenant tenantContract = new Tenant(tenantModel, city);

        assertThat(tenantContract.getCode()).isEqualTo("AP.KURNOOL");
        assertThat(tenantContract.getName()).isEqualTo("kurnool");
        assertThat(tenantContract.getDescription()).isEqualTo("description");
        assertThat(tenantContract.getLogoId()).isEqualTo("logoId");
        assertThat(tenantContract.getImageId()).isEqualTo("imageId");
        assertThat(tenantContract.getDomainUrl()).isEqualTo("domainUrl");
        assertThat(tenantContract.getType()).isEqualTo("CITY");
        assertThat(tenantContract.getTwitterUrl()).isEqualTo("twitterUrl");
        assertThat(tenantContract.getFacebookUrl()).isEqualTo("faceBookUrl");
        assertThat(tenantContract.getEmailId()).isEqualTo("email");
        assertThat(tenantContract.getAddress()).isEqualTo("address");
        assertThat(tenantContract.getContactNumber()).isEqualTo("contactNumber");
        assertThat(tenantContract.getHelpLineNumber()).isEqualTo("helpLineNumber");
        assertThat(tenantContract.getCity()).isEqualTo(city);
    }
}