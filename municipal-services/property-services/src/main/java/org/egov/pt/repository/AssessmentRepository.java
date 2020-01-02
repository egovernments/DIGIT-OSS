package org.egov.pt.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.pt.models.Assessment;
import org.egov.pt.models.AssessmentSearchCriteria;
import org.egov.pt.repository.builder.AssessmentQueryBuilder;
import org.egov.pt.repository.rowmapper.AssessmentRowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class AssessmentRepository {

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private AssessmentQueryBuilder queryBuilder;

	@Autowired
	private AssessmentRowMapper rowMapper;
	
	
	public List<Assessment> getAssessments(AssessmentSearchCriteria criteria){
		Map<String, Object> preparedStatementValues = new HashMap<>();
		List<Assessment> assessments = new ArrayList<>();
		String query = queryBuilder.getSearchQuery(criteria, preparedStatementValues);
		log.info("Query: "+query);
		log.debug("preparedStatementValues: "+preparedStatementValues);
		try {
			assessments = namedParameterJdbcTemplate.query(query, preparedStatementValues, rowMapper);
		}catch(Exception e) {
			log.error("Exception while fetching assessments from DB: ",e);
		}
		return assessments;
	}

}
