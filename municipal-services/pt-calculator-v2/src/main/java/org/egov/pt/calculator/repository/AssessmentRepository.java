package org.egov.pt.calculator.repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.calculator.repository.rowmapper.AssessmentRowMapper;
import org.egov.pt.calculator.util.CalculatorUtils;
import org.egov.pt.calculator.web.models.Assessment;
import org.egov.pt.calculator.web.models.property.AuditDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/**
 * Persists and retrieves the assessment data from DB
 * 
 * @author kavi elrey
 */
@Repository
public class AssessmentRepository {

	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private AssessmentRowMapper rowMapper;
	
	@Autowired
	private CalculatorUtils utils;
	
	/**
	 * Retrieves assessments for the given query
	 * 
	 * @param query
	 * @param preparedStatementList
	 * @return
	 */
	public List<Assessment> getAssessments(String query, Object[] preparedStatementList) {
		return jdbcTemplate.query(query, preparedStatementList, rowMapper);
	}

	/**
	 * Saves the assessments in to assessment table
	 * 
	 * @param assessments
	 * @param info
	 * @return
	 */
	public List<Assessment> saveAssessments(List<Assessment> assessments, RequestInfo info){
	
		jdbcTemplate.batchUpdate(utils.getAssessmentInsertQuery(), new BatchPreparedStatementSetter() {
			
			@Override
			public void setValues(PreparedStatement ps, int rowNum) throws SQLException {

				Assessment current = assessments.get(rowNum);
				AuditDetails audit = current.getAuditDetails();

				ps.setString(1, current.getUuid());
				ps.setString(2, current.getAssessmentNumber());
				ps.setString(3, current.getAssessmentYear());
				ps.setString(4, current.getDemandId());
				ps.setString(5, current.getPropertyId());
				ps.setString(6, current.getTenantId());
				ps.setString(7, audit.getCreatedBy());
				ps.setLong(8, audit.getCreatedTime());
				ps.setString(9, audit.getLastModifiedBy());
				if (audit.getLastModifiedTime() == null)
					ps.setLong(10, 0);
				else
					ps.setLong(10, audit.getLastModifiedTime());
			}
			
			@Override
			public int getBatchSize() {
				return assessments.size();
			}
		});
		return assessments;
	}
}
