package org.egov.access.persistence.repository.rowmapper;

import org.egov.access.domain.model.ActionValidation;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ActionValidationRowMapper implements RowMapper<ActionValidation> {
	@Override
	public ActionValidation mapRow(ResultSet resultSet, int i) throws SQLException {
		return ActionValidation.builder().allowed(resultSet.getBoolean("exists")).build();
	}
}
