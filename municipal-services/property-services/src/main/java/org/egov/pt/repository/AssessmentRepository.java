package org.egov.pt.repository;

import java.util.*;

import org.egov.pt.models.Assessment;
import org.egov.pt.models.AssessmentSearchCriteria;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.repository.builder.AssessmentQueryBuilder;
import org.egov.pt.repository.rowmapper.AssessmentRowMapper;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.util.CollectionUtils;

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
		assessments = namedParameterJdbcTemplate.query(query, preparedStatementValues, rowMapper);
		return assessments;
	}

	public List<String> fetchAssessmentNumbers(AssessmentSearchCriteria criteria) {
		Map<String, Object> preparedStatementValues = new HashMap<>();
		preparedStatementValues.put("offset", criteria.getOffset());
		preparedStatementValues.put("limit", criteria.getLimit());
		return namedParameterJdbcTemplate.query("SELECT assessmentnumber from eg_pt_asmt_assessment ORDER BY createdtime,id offset :offset limit :limit",
				preparedStatementValues,
				new SingleColumnRowMapper<>(String.class));
	}

	public List<Assessment> getAssessmentPlainSearch(AssessmentSearchCriteria criteria) {
		if (criteria.getAssessmentNumbers() == null || criteria.getAssessmentNumbers().isEmpty())
			throw new CustomException("PLAIN_SEARCH_ERROR", "Search only allowed by assessent Numbers!");
		return getAssessments(criteria);
	}
	/**
	 * Fetches the assessment from DB corresponding to given assessment for update
	 * @param assessment THe Assessment to be updated
	 * @return Assessment from DB
	 */
	public Assessment getAssessmentFromDB(Assessment assessment){

		AssessmentSearchCriteria criteria = AssessmentSearchCriteria.builder()
				.ids(Collections.singleton(assessment.getId()))
				.tenantId(assessment.getTenantId())
				.build();

		List<Assessment> assessments = getAssessments(criteria);

		if(CollectionUtils.isEmpty(assessments))
			throw new CustomException("ASSESSMENT_NOT_FOUND","The assessment with id: "+assessment.getId()+" is not found in DB");

		return assessments.get(0);
	}


}
