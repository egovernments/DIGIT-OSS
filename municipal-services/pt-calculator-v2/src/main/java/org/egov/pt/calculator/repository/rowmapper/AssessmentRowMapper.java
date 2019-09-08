package org.egov.pt.calculator.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.egov.pt.calculator.web.models.Assessment;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component
public class AssessmentRowMapper implements RowMapper<Assessment> {

	@Override
	public Assessment mapRow(ResultSet rs, int rowNum) throws SQLException {

		return Assessment.builder().demandId(rs.getString("demandId")).propertyId(rs.getString("propertyId")).assessmentYear(rs.getString("assessmentyear"))
				.uuid(rs.getString("uuid")).assessmentNumber(rs.getString("assessmentNumber")).tenantId(rs.getString("tenantId")).build();
	}

}
