package org.egov.tenant.persistence.entity;

import org.egov.tenant.domain.model.TenantType;
import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class TenantTest {

    @Test
    public void test_should_convert_entity_to_domain() {
        Tenant tenant = Tenant.builder()
                .id(1L)
                .code("AP.KURNOOL")
                .name("kurnool")
                .description("description")
                .logoId("logoid")
                .imageId("imageid")
                .domainUrl("domainUrl")
                .type(TenantType.CITY)
                .twitterUrl("twitterUrl")
                .facebookUrl("facebookUrl")
                .address("address")
                .contactNumber("contactNumber")
                .helplineNumber("helpLineNumber")
                .emailId("email")
                .build();

        org.egov.tenant.domain.model.Tenant tenantModel = tenant.toDomain();

        assertThat(tenantModel.getId()).isEqualTo(1);
        assertThat(tenantModel.getCode()).isEqualTo("AP.KURNOOL");
        assertThat(tenantModel.getName()).isEqualTo("kurnool");
        assertThat(tenantModel.getDescription()).isEqualTo("description");
        assertThat(tenantModel.getLogoId()).isEqualTo("logoid");
        assertThat(tenantModel.getImageId()).isEqualTo("imageid");
        assertThat(tenantModel.getDomainUrl()).isEqualTo("domainUrl");
        assertThat(tenantModel.getType()).isEqualTo(TenantType.CITY);
        assertThat(tenantModel.getTwitterUrl()).isEqualTo("twitterUrl");
        assertThat(tenantModel.getFacebookUrl()).isEqualTo("facebookUrl");
        assertThat(tenantModel.getEmailId()).isEqualTo("email");
        assertThat(tenantModel.getAddress()).isEqualTo("address");
        assertThat(tenantModel.getContactNumber()).isEqualTo("contactNumber");
        assertThat(tenantModel.getHelpLineNumber()).isEqualTo("helpLineNumber");
        
        
    }
}