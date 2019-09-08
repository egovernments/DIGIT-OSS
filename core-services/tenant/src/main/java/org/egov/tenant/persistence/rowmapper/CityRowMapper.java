package org.egov.tenant.persistence.rowmapper;

import org.egov.tenant.persistence.entity.City;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import static org.egov.tenant.persistence.entity.City.*;

public class CityRowMapper implements RowMapper<City> {

    @Override
    public City mapRow(ResultSet resultSet, int i) throws SQLException {
        return builder()
                .id(resultSet.getLong(ID))
                .name(resultSet.getString(NAME))
                .localName(resultSet.getString(LOCAL_NAME))
                .districtCode(resultSet.getString(DISTRICT_CODE))
                .districtName(resultSet.getString(DISTRICT_NAME))
                .latitude(resultSet.getDouble(LATITUDE))
                .longitude(resultSet.getDouble(LONGITUDE))
                .tenantCode(resultSet.getString(TENANT_CODE))
                .regionName(resultSet.getString(REGION_NAME))
                .ULBGrade(resultSet.getString(ULB_GRADE))
                .createdBy(resultSet.getLong(CREATED_BY))
                .createdDate(resultSet.getTimestamp(CREATED_DATE))
                .lastModifiedBy(resultSet.getLong(LAST_MODIFIED_BY))
                .lastModifiedDate(resultSet.getTimestamp(LAST_MODIFIED_DATE))
                .shapeFileLocation(resultSet.getString(SHAPEFILE_LOCATION))
                .captcha(resultSet.getString(CAPTCHA))
                .code(resultSet.getString(CODE))
                .build();
    }
}
