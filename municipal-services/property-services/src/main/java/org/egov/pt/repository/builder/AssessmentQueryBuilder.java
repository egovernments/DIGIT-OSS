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
	
	private static final String ASSESSMENT_SEARCH_QUERY = "SELECT asmt.id as ass_assessmentid, asmt.financialyear as ass_financialyear, asmt.tenantId as ass_tenantid, asmt.assessmentNumber as ass_assessmentnumber, "
			+ "asmt.status as ass_status, asmt.propertyId as ass_propertyid, asmt.source as ass_source, asmt.assessmentDate as ass_assessmentdate,  "
			+ "asmt.additionalDetails as ass_additionaldetails, asmt.createdby as ass_createdby, asmt.createdtime as ass_createdtime, asmt.lastmodifiedby as ass_lastmodifiedby, "
			+ "asmt.lastmodifiedtime as ass_lastmodifiedtime, us.tenantId as us_tenantid, us.unitId as us_unitid, us.id as us_id, us.assessmentId as us_assessmentid, "
			+ "us.usageCategory as us_usagecategory, us.occupancyType as us_occupancytype, "
			+ "us.occupancyDate as us_occupancydate, us.active as us_active, us.createdby as us_createdby, "
			+ "us.createdtime as us_createdtime, us.lastmodifiedby as us_lastmodifiedby, us.lastmodifiedtime as us_lastmodifiedtime, "
			+ "doc.id as doc_id, doc.entityid as doc_entityid, doc.documentType as doc_documenttype, doc.fileStoreId as doc_filestoreid, doc.documentuid as doc_documentuid, "
			+ "doc.status as doc_status, doc.tenantid as doc_tenantid, "
			+ "doc.createdby as doc_createdby, doc.createdtime as doc_createdtime, doc.lastmodifiedby as doc_lastmodifiedby, doc.lastmodifiedtime as doc_lastmodifiedtime " 
			+ "FROM {schema}.eg_pt_asmt_assessment asmt LEFT OUTER JOIN {schema}.eg_pt_asmt_unitusage us ON asmt.id = us.assessmentId LEFT OUTER JOIN {schema}.eg_pt_asmt_document doc ON asmt.id = doc.entityid ";
	
	
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
			query.append(" asmt.tenantid = :tenantid");
			preparedStatementValues.put("tenantid", criteria.getTenantId());
		}
		
		if(!StringUtils.isEmpty(criteria.getFinancialYear())) {
			addClauseIfRequired(preparedStatementValues, query);
			query.append(" asmt.financialyear = :financialyear");
			preparedStatementValues.put("financialyear", criteria.getFinancialYear());
		}
		
		if(!CollectionUtils.isEmpty(criteria.getAssessmentNumbers())) {
			addClauseIfRequired(preparedStatementValues, query);
			query.append(" asmt.assessmentNumber IN ( :assessmentnumber )");
			preparedStatementValues.put("assessmentnumber", criteria.getAssessmentNumbers());
		}
		
		if(!CollectionUtils.isEmpty(criteria.getIds())) {
			addClauseIfRequired(preparedStatementValues, query);
			query.append(" asmt.id IN ( :id )");
			preparedStatementValues.put("id", criteria.getIds());
		}
		
		if(!CollectionUtils.isEmpty(criteria.getPropertyIds())) {
			addClauseIfRequired(preparedStatementValues, query);
			query.append(" asmt.propertyId IN ( :propertyid )");
			preparedStatementValues.put("propertyid", criteria.getPropertyIds());
		}
		
		if(null != criteria.getStatus()) {
			addClauseIfRequired(preparedStatementValues, query);
			query.append(" asmt.status = :status");
			preparedStatementValues.put("status", criteria.getStatus().toString());
		}
		
		query.append(" ORDER BY asmt.createdtime DESC"); //default ordering on the platform.
		
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
