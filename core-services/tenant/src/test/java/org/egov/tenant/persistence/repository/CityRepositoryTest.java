package org.egov.tenant.persistence.repository;

import org.egov.tenant.domain.model.City;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.egov.tenant.persistence.entity.City.*;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
public class CityRepositoryTest {

    private CityRepository cityRepository;

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Before
    public void setUp() throws Exception {
        cityRepository = new CityRepository(namedParameterJdbcTemplate);
    }

    @Test
    @Sql(scripts = {"/sql/clearCity.sql", "/sql/clearTenant.sql", "/sql/insertTenantData.sql"})
    public void test_should_create_city() {
        City city = City.builder()
            .name("Bengaluru")
            .localName("local name")
            .districtCode("AB")
            .districtName("district")
            .regionName("region name")
            .ulbGrade("municipality")
            .longitude(35.345)
            .latitude(75.234)
            .shapeFileLocation("shapeFileLocation")
            .captcha("captcha")
            .code("code")
            .build();

        cityRepository.save(city, "AP.KURNOOL");

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM city", new CityResultExtractor());

        Map<String, Object> row = result.get(0);
        assertThat(row.get(ID)).isEqualTo(1L);
        assertThat(row.get(NAME)).isEqualTo("Bengaluru");
        assertThat(row.get(LOCAL_NAME)).isEqualTo("local name");
        assertThat(row.get(DISTRICT_CODE)).isEqualTo("AB");
        assertThat(row.get(DISTRICT_NAME)).isEqualTo("district");
        assertThat(row.get(REGION_NAME)).isEqualTo("region name");
        assertThat(row.get(ULB_GRADE)).isEqualTo("municipality");
        assertThat(row.get(SHAPEFILE_LOCATION)).isEqualTo("shapeFileLocation");
        assertThat(row.get(CAPTCHA)).isEqualTo("captcha");
        assertThat(row.get(CODE)).isEqualTo("code");
    }

    @Test
    @Sql(scripts = {"/sql/clearCity.sql", "/sql/clearTenant.sql", "/sql/insertTenantData.sql", "/sql/insertCityData.sql", "/sql/updateCityData.sql"})
    public void test_should_retrieve_city() {
        City city = cityRepository.find("AP.KURNOOL");
        Calendar calendar = Calendar.getInstance();
        calendar.set(1990, Calendar.JULY, 23, 0, 0, 0);
        Date date = calendar.getTime();

        assertThat(city.getId()).isEqualTo(1L);
        assertThat(city.getName()).isEqualTo("Bengaluru");
        assertThat(city.getLocalName()).isEqualTo("localname");
        assertThat(city.getDistrictCode()).isEqualTo("ABC");
        assertThat(city.getDistrictName()).isEqualTo("Udupi");
        assertThat(city.getRegionName()).isEqualTo("Region");
        assertThat(city.getLongitude()).isEqualTo(34.567);
        assertThat(city.getLatitude()).isEqualTo(74.566);
        assertThat(city.getTenantCode()).isEqualTo("AP.KURNOOL");
        assertThat(city.getUlbGrade()).isEqualTo("Municipality");
        assertThat(city.getCreatedBy()).isEqualTo(1L);
        assertThat(city.getCreatedDate()).isInSameSecondAs(date);
        assertThat(city.getLastModifiedBy()).isEqualTo(1L);
        assertThat(city.getShapeFileLocation()).isEqualTo("shapeFileLocation");
        assertThat(city.getCaptcha()).isEqualTo("captcha");
        assertThat(city.getCode()).isEqualTo("1016");
    }

    class CityResultExtractor implements ResultSetExtractor<List<Map<String, Object>>> {
        @Override
        public List<Map<String, Object>> extractData(ResultSet resultSet) throws SQLException, DataAccessException {
            List<Map<String, Object>> rows = new ArrayList<>();
            while (resultSet.next()) {
                Map<String, Object> row = new HashMap<String, Object>() {{
                    put(ID, resultSet.getLong(ID));
                    put(NAME, resultSet.getString(NAME));
                    put(LOCAL_NAME, resultSet.getString(LOCAL_NAME));
                    put(DISTRICT_CODE, resultSet.getString(DISTRICT_CODE));
                    put(DISTRICT_NAME, resultSet.getString(DISTRICT_NAME));
                    put(REGION_NAME, resultSet.getString(REGION_NAME));
                    put(LONGITUDE, resultSet.getDouble(LONGITUDE));
                    put(LATITUDE, resultSet.getDouble(LATITUDE));
                    put(TENANT_CODE, resultSet.getString(TENANT_CODE));
                    put(ULB_GRADE, resultSet.getString(ULB_GRADE));
                    put(CREATED_BY, resultSet.getLong(CREATED_BY));
                    put(CREATED_DATE, resultSet.getString(CREATED_DATE));
                    put(LAST_MODIFIED_BY, resultSet.getLong(LAST_MODIFIED_BY));
                    put(LAST_MODIFIED_DATE, resultSet.getString(LAST_MODIFIED_DATE));
                    put(SHAPEFILE_LOCATION, resultSet.getString(SHAPEFILE_LOCATION));
                    put(CAPTCHA,resultSet.getString(CAPTCHA));    
                    put(CODE,resultSet.getString(CODE));
                    
                }};

                rows.add(row);
            }
            return rows;
        }
    }
    
    
    @Test
    @Sql(scripts = {"/sql/clearCity.sql", "/sql/clearTenant.sql", "/sql/insertTenantData.sql","/sql/insertCityData.sql"})
    public void test_should_update_city() {
        City city = City.builder()
            .name("Hyderabad")
            .localName("local name1")
            .districtCode("AB")
            .districtName("district")
            .regionName("region name")
            .ulbGrade("municipality")
            .longitude(35.345)
            .latitude(75.234)
            .shapeFileLocation("shapeFileLocation")
            .captcha("captcha")
            .code("code")
            .build();

        cityRepository.update(city, "AP.KURNOOL");

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM city", new CityResultExtractor());

        Map<String, Object> row = result.get(0);
        assertThat(row.get(ID)).isEqualTo(1L);
        assertThat(row.get(NAME)).isEqualTo("Hyderabad");
        assertThat(row.get(LOCAL_NAME)).isEqualTo("local name1");
        assertThat(row.get(DISTRICT_CODE)).isEqualTo("AB");
        assertThat(row.get(DISTRICT_NAME)).isEqualTo("district");
        assertThat(row.get(REGION_NAME)).isEqualTo("region name");
        assertThat(row.get(ULB_GRADE)).isEqualTo("municipality");
        assertThat(row.get(SHAPEFILE_LOCATION)).isNotNull();
        assertThat(row.get(CAPTCHA)).isNotNull();
        assertThat(row.get(CODE)).isNotNull();
        
    }

}