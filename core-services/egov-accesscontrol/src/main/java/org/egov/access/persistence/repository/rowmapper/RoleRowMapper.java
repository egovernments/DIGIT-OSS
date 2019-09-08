package org.egov.access.persistence.repository.rowmapper;

import org.egov.access.domain.model.Role;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class RoleRowMapper implements RowMapper<Role> {

	@Override
	public Role mapRow(final ResultSet rs, final int rowNum) throws SQLException {
		return Role.builder().name(rs.getString("r_name")).description(rs.getString("r_description"))
				.code(rs.getString("r_code")).build();
	}
}