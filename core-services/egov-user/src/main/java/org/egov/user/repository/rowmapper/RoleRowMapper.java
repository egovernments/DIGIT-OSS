package org.egov.user.repository.rowmapper;

import org.egov.user.domain.model.Role;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class RoleRowMapper implements RowMapper<Role> {

	@Override
	public Role mapRow(final ResultSet rs, final int rowNum) throws SQLException {
		return Role.builder().tenantId(rs.getString("tenantid")).code(rs.getString("code")).description(rs.getString("description")).name(rs.getString("name")).build();
	}
}
