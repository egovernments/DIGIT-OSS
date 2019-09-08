package org.egov.tenant.persistence.rowmapper;

import org.egov.tenant.domain.model.TenantType;
import org.egov.tenant.persistence.entity.Tenant;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.sql.ResultSet;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class TenantRowMapperTest {

    @Mock
    ResultSet resultSet;

    @Test
    public void test_should_map_result_set_to_model() throws Exception {
        when(resultSet.getLong(Tenant.ID)).thenReturn(1L);
        when(resultSet.getString(Tenant.CODE)).thenReturn("AP.KURNOOL");
        when(resultSet.getString(Tenant.NAME)).thenReturn("kurnool");
        when(resultSet.getString(Tenant.DESCRIPTION)).thenReturn("description");
        when(resultSet.getString(Tenant.DOMAIN_URL)).thenReturn("domainurl");
        when(resultSet.getString(Tenant.LOGO_ID)).thenReturn("logoid");
        when(resultSet.getString(Tenant.IMAGE_ID)).thenReturn("imageid");
        when(resultSet.getString(Tenant.TYPE)).thenReturn("CITY");
        when(resultSet.getString(Tenant.TWITTER_URL)).thenReturn("twitterUrl");
        when(resultSet.getString(Tenant.FACEBOOK_URL)).thenReturn("faceBookUrl");
        when(resultSet.getString(Tenant.EMAILID)).thenReturn("email");
        when(resultSet.getString(Tenant.ADDRESS)).thenReturn("address");
        when(resultSet.getString(Tenant.CONTACTNUMBER)).thenReturn("contactNumber");
        when(resultSet.getString(Tenant.HELPLINENUMBER)).thenReturn("helpLineNumber");
        
        
        
        
        TenantRowMapper tenantRowMapper = new TenantRowMapper();

        Tenant tenant = tenantRowMapper.mapRow(resultSet, 1);

        assertThat(tenant.getId()).isEqualTo(1L);
        assertThat(tenant.getCode()).isEqualTo("AP.KURNOOL");
        assertThat(tenant.getName()).isEqualTo("kurnool");
        assertThat(tenant.getDescription()).isEqualTo("description");
        assertThat(tenant.getDomainUrl()).isEqualTo("domainurl");
        assertThat(tenant.getLogoId()).isEqualTo("logoid");
        assertThat(tenant.getImageId()).isEqualTo("imageid");
        assertThat(tenant.getType()).isEqualTo(TenantType.CITY);
        assertThat(tenant.getTwitterUrl()).isEqualTo("twitterUrl");
        assertThat(tenant.getFacebookUrl()).isEqualTo("faceBookUrl");
        assertThat(tenant.getEmailId()).isEqualTo("email");
        assertThat(tenant.getAddress()).isEqualTo("address");
        assertThat(tenant.getContactNumber()).isEqualTo("contactNumber");
        assertThat(tenant.getHelplineNumber()).isEqualTo("helpLineNumber");
    }
}