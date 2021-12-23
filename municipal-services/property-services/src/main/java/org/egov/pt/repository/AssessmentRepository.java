package org.egov.pt.repository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.exception.InvalidTenantIdException;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.pt.models.Assessment;
import org.egov.pt.models.AssessmentSearchCriteria;
import org.egov.pt.repository.builder.AssessmentQueryBuilder;
import org.egov.pt.repository.rowmapper.AssessmentRowMapper;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

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
	
	@Autowired
	private MultiStateInstanceUtil centralInstanceutil;
	
	
	public List<Assessment> getAssessments(AssessmentSearchCriteria criteria){
		Map<String, Object> preparedStatementValues = new HashMap<>();
		List<Assessment> assessments = new ArrayList<>();
		String query = queryBuilder.getSearchQuery(criteria, preparedStatementValues);
		try {
			query = centralInstanceutil.replaceSchemaPlaceholder(query, criteria.getTenantId());
		} catch (InvalidTenantIdException e) {
			throw new CustomException("EG_PT_AS_TENANTID_ERROR",
					"TenantId length is not sufficient to replace query schema in a multi state instance");
		}
		log.info("Query: "+query);
		log.debug("preparedStatementValues: "+preparedStatementValues);
		assessments = namedParameterJdbcTemplate.query(query, preparedStatementValues, rowMapper);
		return assessments;
	}

	public List<String> fetchAssessmentNumbers(AssessmentSearchCriteria criteria) {
		Map<String, Object> preparedStatementValues = new HashMap<>();
		String basequery = "SELECT assessmentnumber from eg_pt_asmt_assessment";
		StringBuilder builder = new StringBuilder(basequery);
		if (!ObjectUtils.isEmpty(criteria.getTenantId())) {
			builder.append(" where tenantid = :tenantid");
			preparedStatementValues.put("tenantid", criteria.getTenantId());
		}
		String orderbyClause = " ORDER BY createdtime,id offset :offset limit :limit";
		preparedStatementValues.put("offset", criteria.getOffset());
		preparedStatementValues.put("limit", criteria.getLimit());
		builder.append(orderbyClause);
		String query;
		try {
			query = centralInstanceutil.replaceSchemaPlaceholder(builder.toString(), criteria.getTenantId());
		} catch (InvalidTenantIdException e) {
			throw new CustomException("EG_PT_AS_TENANTID_ERROR",
					"TenantId length is not sufficient to replace query schema in a multi state instance");
		}
		return namedParameterJdbcTemplate.query(query, preparedStatementValues, new SingleColumnRowMapper<>(String.class));
	}

	public List<Assessment> getAssessmentPlainSearch(AssessmentSearchCriteria criteria) {
		if ((criteria.getAssessmentNumbers() == null || criteria.getAssessmentNumbers().isEmpty())
				&& (criteria.getIds() == null || criteria.getIds().isEmpty())
				&& (criteria.getPropertyIds() == null || criteria.getPropertyIds().isEmpty()))
			throw new CustomException("PLAIN_SEARCH_ERROR", "Empty search not allowed!");
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
