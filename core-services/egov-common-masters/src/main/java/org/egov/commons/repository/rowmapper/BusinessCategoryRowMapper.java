package org.egov.commons.repository.rowmapper;

import static org.springframework.util.ObjectUtils.isEmpty;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.egov.commons.model.BusinessCategory;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component
public class BusinessCategoryRowMapper implements RowMapper<BusinessCategory> {
	@Override
	public BusinessCategory mapRow(ResultSet rs, int rowNum) throws SQLException {
		BusinessCategory businessCategory = new BusinessCategory();
		businessCategory.setId(rs.getLong("id"));
		businessCategory.setCode(rs.getString("code"));
		businessCategory.setName(rs.getString("name"));
		businessCategory.setIsactive(((Boolean) rs.getObject("active")));
		businessCategory.setTenantId(rs.getString("tenantId"));
		return businessCategory;
	}
}
