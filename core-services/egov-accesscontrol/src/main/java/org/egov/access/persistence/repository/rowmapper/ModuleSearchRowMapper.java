package org.egov.access.persistence.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.egov.access.web.contract.action.Module;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component
public class ModuleSearchRowMapper implements RowMapper<Module> {

	@Override
	public Module mapRow(final ResultSet rs, final int rowNum) throws SQLException {

		Module module = new Module();
		module.setId(rs.getLong("id"));
		module.setCode(rs.getString("code"));
		module.setName(rs.getString("name"));
		module.setDisplayName(rs.getString("displayname"));
		module.setParentModule(rs.getString("parentmodule"));
		module.setEnabled(rs.getBoolean("enabled"));
		return module;
	}

}