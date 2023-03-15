package org.egov.tenant.persistence.rowmapper;

import org.egov.tenant.persistence.entity.City;
import org.egov.tenant.persistence.entity.Tenant;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.egov.tenant.persistence.entity.City.*;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class CityRowMapperTest {

    @Mock
    ResultSet resultSet;

    @Test
    public void test_should_map_result_set_to_entity() throws Exception {
        Date date = new Date();
        Timestamp timestamp = new Timestamp(date.getTime());

        when(resultSet.getLong(ID)).thenReturn(1L);
        when(resultSet.getString(NAME)).thenReturn("Bengaluru");
        when(resultSet.getString(LOCAL_NAME)).thenReturn("local name");
        when(resultSet.getString(DISTRICT_CODE)).thenReturn("district code");
        when(resultSet.getString(DISTRICT_NAME)).thenReturn("district name");
        when(resultSet.getString(REGION_NAME)).thenReturn("region name");
        when(resultSet.getDouble(LONGITUDE)).thenReturn(35.234);
        when(resultSet.getDouble(LATITUDE)).thenReturn(75.234);
        when(resultSet.getString(TENANT_CODE)).thenReturn("AP.GUNTOOR");
        when(resultSet.getTimestamp(CREATED_DATE)).thenReturn(timestamp);
        when(resultSet.getLong(CREATED_BY)).thenReturn(1L);
        when(resultSet.getTimestamp(LAST_MODIFIED_DATE)).thenReturn(timestamp);
        when(resultSet.getLong(LAST_MODIFIED_BY)).thenReturn(1L);
        when(resultSet.getString(SHAPEFILE_LOCATION)).thenReturn("shapeFileLocation");
        when(resultSet.getString(CAPTCHA)).thenReturn("captcha");


        CityRowMapper cityRowMapper = new CityRowMapper();

        City city = cityRowMapper.mapRow(resultSet, 1);

        assertThat(city.getId()).isEqualTo(1);
        assertThat(city.getName()).isEqualTo("Bengaluru");
        assertThat(city.getLocalName()).isEqualTo("local name");
        assertThat(city.getDistrictCode()).isEqualTo("district code");
        assertThat(city.getDistrictName()).isEqualTo("district name");
        assertThat(city.getRegionName()).isEqualTo("region name");
        assertThat(city.getLongitude()).isEqualTo(35.234);
        assertThat(city.getLatitude()).isEqualTo(75.234);
        assertThat(city.getTenantCode()).isEqualTo("AP.GUNTOOR");
        assertThat(city.getCreatedDate()).isInSameSecondAs(date);
        assertThat(city.getCreatedBy()).isEqualTo(1L);
        assertThat(city.getLastModifiedDate()).isInSameSecondAs(date);
        assertThat(city.getLastModifiedBy()).isEqualTo(1L);
        assertThat(city.getShapeFileLocation()).isEqualTo("shapeFileLocation");
        assertThat(city.getCaptcha()).isEqualTo("captcha");
    }
}