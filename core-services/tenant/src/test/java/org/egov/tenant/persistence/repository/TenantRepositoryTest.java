package org.egov.tenant.persistence.repository;

import org.egov.tenant.domain.model.City;
import org.egov.tenant.domain.model.Tenant;
import org.egov.tenant.domain.model.TenantSearchCriteria;
import org.egov.tenant.domain.model.TenantType;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.Arrays.asList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.egov.tenant.persistence.entity.Tenant.*;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
public class TenantRepositoryTest {
    private static final List<String> TENANT_CODES = asList("AP.KURNOOL");

    @MockBean
    private CityRepository cityRepository;

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    private TenantRepository tenantRepository;

    @Before
    public void setUp() throws Exception {
        tenantRepository = new TenantRepository(cityRepository, namedParameterJdbcTemplate);
    }

    @Test
    @Sql(scripts = {"/sql/clearCity.sql", "/sql/clearTenant.sql", "/sql/insertTenantData.sql","/sql/updateTenantData.sql"})
    public void test_should_retrieve_tenant() throws Exception {
        TenantSearchCriteria tenantSearchCriteria = TenantSearchCriteria.builder()
            .tenantCodes(TENANT_CODES)
            .build();

        City guntoorCity = City.builder().id(1L).build();
        City kurnoolCity = City.builder().id(2L).build();

        when(cityRepository.find("AP.KURNOOL")).thenReturn(kurnoolCity);
        when(cityRepository.find("AP.GUNTOOR")).thenReturn(guntoorCity);

        List<Tenant> tenants = tenantRepository.find(tenantSearchCriteria);

        assertThat(tenants.size()).isEqualTo(1);

    }

    @Test
    @Sql(scripts = {"/sql/clearCity.sql", "/sql/clearTenant.sql", "/sql/insertTenantData.sql","/sql/updateTenantData.sql"})
    public void test_should_return_all_tenants() throws Exception {
        TenantSearchCriteria tenantSearchCriteria = TenantSearchCriteria.builder()
            .tenantCodes(null)
            .build();
        City kurnoolCity = City.builder().id(2L).build();
        City guntoorCity = City.builder().id(1L).build();
        when(cityRepository.find("AP.GUNTOOR")).thenReturn(guntoorCity);
        when(cityRepository.find("AP.KURNOOL")).thenReturn(kurnoolCity);

        List<Tenant> tenants = tenantRepository.find(tenantSearchCriteria);

        assertThat(tenants.size()).isEqualTo(2);

    }

    @Test
    @Sql(scripts = {"/sql/clearCity.sql", "/sql/clearTenant.sql", "/sql/insertTenantData.sql"})
    public void test_should_return_count_of_tenants_with_given_tenantCode_matching() throws Exception {

        Long count = tenantRepository.isTenantPresent("AP.KURNOOL");
        assertThat(count).isEqualTo(1L);
    }

    @Test
    @Sql(scripts = {"/sql/clearCity.sql", "/sql/clearTenant.sql", "/sql/insertTenantData.sql"})
    public void test_should_return_zero_when_tenant_does_not_exist_for_the_given_tenantCode() throws Exception {

        Long count = tenantRepository.isTenantPresent("NON.EXISTENT");
        assertThat(count).isEqualTo(0L);
    }

    @Test
    @Sql(scripts = {"/sql/clearCity.sql", "/sql/clearTenant.sql"})
    public void test_should_save_tenant() throws Exception {
        City city = City.builder().id(1L).build();

        Tenant tenant = Tenant.builder()
            .code("AP.KURNOOL")
            .name("kurnool")
            .description("description")
            .domainUrl("http://egov.ap.gov.in/kurnool")
            .logoId("d45d7118-2013-11e7-93ae-92361f002671")
            .imageId("8716872c-cd50-4fbb-a0d6-722e6bc9c143")
            .type("CITY")
            .twitterUrl("twitterUrl")
            .facebookUrl("faceBookUrl")
            .emailId("email")
            .address("address")
            .contactNumber("contactNumber")
            .helpLineNumber("helpLineNumber")
            .city(city)
            .build();

        tenantRepository.save(tenant);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM tenant", new TenantResultExtractor());
        Map<String, Object> row = result.get(0);
        assertThat(row.get(ID)).isEqualTo(1L);
        assertThat(row.get(CODE)).isEqualTo("AP.KURNOOL");
        assertThat(row.get(NAME)).isEqualTo("kurnool");
        assertThat(row.get(DESCRIPTION)).isEqualTo("description");
        assertThat(row.get(DOMAIN_URL)).isEqualTo("http://egov.ap.gov.in/kurnool");
        assertThat(row.get(LOGO_ID)).isEqualTo("d45d7118-2013-11e7-93ae-92361f002671");
        assertThat(row.get(IMAGE_ID)).isEqualTo("8716872c-cd50-4fbb-a0d6-722e6bc9c143");
        assertThat(row.get(TYPE)).isEqualTo("CITY");
        assertThat(row.get(CREATED_BY)).isEqualTo(1L);
        assertThat(row.get(CREATED_DATE)).isNotNull();
        assertThat(row.get(LAST_MODIFIED_BY)).isEqualTo(1L);
        assertThat(row.get(LAST_MODIFIED_DATE)).isNotNull();
        assertThat(row.get(TWITTER_URL)).isNotNull();
        assertThat(row.get(FACEBOOK_URL)).isNotNull();
        assertThat(row.get(EMAILID)).isNotNull();
        assertThat(row.get(ADDRESS)).isEqualTo("address");
        assertThat(row.get(CONTACTNUMBER)).isEqualTo("contactNumber");
        assertThat(row.get(HELPLINENUMBER)).isEqualTo("helpLineNumber");

        verify(cityRepository).save(city, "AP.KURNOOL");
    }

    class TenantResultExtractor implements ResultSetExtractor<List<Map<String, Object>>> {
        @Override
        public List<Map<String, Object>> extractData(ResultSet resultSet) throws SQLException, DataAccessException {
            List<Map<String, Object>> rows = new ArrayList<>();
            while (resultSet.next()) {
                Map<String, Object> row = new HashMap<String, Object>() {{
                    put(ID, resultSet.getLong(ID));
                    put(CODE, resultSet.getString(CODE));
                    put(NAME, resultSet.getString(NAME));
                    put(DESCRIPTION, resultSet.getString(DESCRIPTION));
                    put(DOMAIN_URL, resultSet.getString(DOMAIN_URL));
                    put(LOGO_ID, resultSet.getString(LOGO_ID));
                    put(IMAGE_ID, resultSet.getString(IMAGE_ID));
                    put(TYPE, resultSet.getString(TYPE));
                    put(CREATED_BY, resultSet.getLong(CREATED_BY));
                    put(CREATED_DATE, resultSet.getString(CREATED_DATE));
                    put(LAST_MODIFIED_BY, resultSet.getLong(LAST_MODIFIED_BY));
                    put(LAST_MODIFIED_DATE, resultSet.getString(LAST_MODIFIED_DATE));
                    put(TWITTER_URL, resultSet.getString(TWITTER_URL));
                    put(FACEBOOK_URL, resultSet.getString(FACEBOOK_URL));
                    put(EMAILID ,resultSet.getString(EMAILID));
                    put(ADDRESS,resultSet.getString(ADDRESS));
                    put(CONTACTNUMBER,resultSet.getString(CONTACTNUMBER));
                    put(HELPLINENUMBER,resultSet.getString(HELPLINENUMBER)); 
                }};

                rows.add(row);
            }
            return rows;
        }
    }
    
    
    @Test
    @Sql(scripts = {"/sql/clearCity.sql", "/sql/clearTenant.sql","/sql/insertTenantData.sql"})
    public void test_should_update_tenant() throws Exception {
        City city = City.builder().id(1L).build();

        Tenant expected = Tenant.builder()
            .code("AP.KURNOOL")
            .name("kurnool")
            .description("descrdsfghjkliption")
            .domainUrl("http://egov.ap.gov.in/kurnool")
            .logoId("d45d7118-2013-11e7-93ae-92361f002671")
            .imageId("8716872c-cd50-4fbb-a0d6-722e6bc9c143")
            .type("CITY")
            .twitterUrl("twitterUrl")
            .facebookUrl("faceBookUrl")
            .emailId("email")
            .address("address")
            .contactNumber("contactNumber")
            .helpLineNumber("helpLineNumber")
            .city(city)
            .build();

        Tenant actual=  tenantRepository.update(expected);
        assertEquals(expected,actual);
       
    }

}