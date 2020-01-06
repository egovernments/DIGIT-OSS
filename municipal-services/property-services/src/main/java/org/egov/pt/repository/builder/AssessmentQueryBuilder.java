package org.egov.pt.repository.builder;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.AssessmentSearchCriteria;
import org.egov.pt.models.PropertyCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

@Repository
public class AssessmentQueryBuilder {
	
	@Autowired
	private PropertyConfiguration configs;
	
	private static final String ASSESSMENT_SEARCH_QUERY = "SELECT ass.id as ass_assessmentid, ass.financialyear as ass_financialyear, ass.tenantId as ass_tenantid, ass.assessmentNumber as ass_assessmentnumber, "
			+ "ass.status as ass_status, ass.propertyId as ass_propertyid, ass.source as ass_source, ass.assessmentDate as ass_assessmentdate, ass.buildUpArea as ass_builduparea, "
			+ "ass.additionalDetails as ass_additionaldetails, ass.createdby as ass_createdby, ass.createdtime as ass_createdtime, ass.lastmodifiedby as ass_lastmodifiedby, "
			+ "ass.lastmodifiedtime as ass_lastmodifiedtime, unit.tenantId as unit_tenantid, unit.id as unit_id, unit.assessmentId as unit_assessmentid, "
			+ "unit.floorNo as unit_floorno, unit.unitArea as unit_unitarea, unit.usageCategory as unit_usagecategory, unit.occupancyType as unit_occupancytype, "
			+ "unit.occupancyDate as unit_occupancydate, unit.constructionType as unit_constructionType, unit.arv as unit_arv, unit.active as unit_active, unit.createdby as unit_createdby, "
			+ "unit.createdtime as unit_createdtime, unit.lastmodifiedby as unit_lastmodifiedby, unit.lastmodifiedtime as unit_lastmodifiedtime, "
			+ "doc.id as doc_id, doc.entityid as doc_entityid, doc.documentType as doc_documenttype, doc.fileStore as doc_filestore, doc.documentuid as doc_documentuid, "
			+ "doc.status as doc_status, doc.tenantid as doc_tenantid, "
			+ "doc.createdby as doc_createdby, doc.createdtime as doc_createdtime, doc.lastmodifiedby as doc_lastmodifiedby, doc.lastmodifiedtime as doc_lastmodifiedtime " 
			+ "FROM eg_pt_assessments ass LEFT OUTER JOIN eg_pt_unit unit ON ass.id = unit.assessmentId LEFT OUTER JOIN eg_pt_document doc ON ass.id = doc.entityid ";
	
	
	private final String paginationWrapper = "SELECT * FROM "
			+ "(SELECT *, DENSE_RANK() OVER (ORDER BY ass_assessmentid) offset_ FROM " + "({})" + " result) result_offset "
			+ "WHERE offset_ > :offset AND offset_ <= :limit";
	
	
    public String getSearchQuery(AssessmentSearchCriteria criteria, Map<String, Object> preparedStatementValues) {
		String baseQuery = ASSESSMENT_SEARCH_QUERY;
		StringBuilder finalQuery = new StringBuilder();
		finalQuery.append(baseQuery);
		
		return addWhereClause(finalQuery, criteria, preparedStatementValues);
	}
	
	
	private String addWhereClause(StringBuilder query, AssessmentSearchCriteria criteria, Map<String, Object> preparedStatementValues) {
		
		if(!StringUtils.isEmpty(criteria.getTenantId())) {
			addClauseIfRequired(preparedStatementValues, query);
			query.append(" ass.tenantid = :tenantid");
			preparedStatementValues.put("tenantid", criteria.getTenantId());
		}
		
		if(!StringUtils.isEmpty(criteria.getFinancialYear())) {
			addClauseIfRequired(preparedStatementValues, query);
			query.append(" ass.financialyear = :financialyear");
			preparedStatementValues.put("financialyear", criteria.getFinancialYear());
		}
		
		if(!CollectionUtils.isEmpty(criteria.getAssessmentNumbers())) {
			addClauseIfRequired(preparedStatementValues, query);
			query.append(" ass.assessmentNumber IN ( :assessmentnumber )");
			preparedStatementValues.put("assessmentnumber", criteria.getAssessmentNumbers());
		}
		
		if(!CollectionUtils.isEmpty(criteria.getIds())) {
			addClauseIfRequired(preparedStatementValues, query);
			query.append(" ass.id IN ( :id )");
			preparedStatementValues.put("id", criteria.getIds());
		}
		
		if(!CollectionUtils.isEmpty(criteria.getPropertyIds())) {
			addClauseIfRequired(preparedStatementValues, query);
			query.append(" ass.propertyId IN ( :propertyid )");
			preparedStatementValues.put("propertyid", criteria.getPropertyIds());
		}
		
		if(null != criteria.getStatus()) {
			addClauseIfRequired(preparedStatementValues, query);
			query.append(" ass.status = :status");
			preparedStatementValues.put("status", criteria.getStatus().toString());
		}
		
		query.append(" ORDER BY ass.createdtime DESC"); //default ordering on the platform.
		
		return addPaginationWrapper(query.toString(), preparedStatementValues, criteria);
	}
	
	
    private static void addClauseIfRequired(Map<String, Object> values, StringBuilder queryString) {
        if (values.isEmpty())
            queryString.append(" WHERE ");
        else {
            queryString.append(" AND ");
        }
    }
    
	private String addPaginationWrapper(String query, Map<String, Object> preparedStatementValues, AssessmentSearchCriteria criteria) {
				
		Long limit = (null == criteria.getLimit()) ? configs.getDefaultLimit() : criteria.getLimit();
		Long offset = (null == criteria.getOffset()) ? configs.getDefaultOffset() : criteria.getOffset();
		String finalQuery = paginationWrapper.replace("{}", query);

		if (criteria.getOffset() != null)
			offset = criteria.getOffset();

		preparedStatementValues.put("offset", offset);
		preparedStatementValues.put("limit", limit + offset);

		return finalQuery;
	}

}
