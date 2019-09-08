package org.egov.dataupload.repository;

import java.util.List;

import org.egov.dataupload.model.JobSearchRequest;
import org.egov.tracer.model.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class DataUploadQueryBuilder {
	
	public static final Logger logger = LoggerFactory.getLogger(DataUploadQueryBuilder.class);

	@SuppressWarnings({ "rawtypes" })
	public String getQuery(final JobSearchRequest jobSearchRequest, final List preparedStatementValues) {
		final StringBuilder selectQuery = new StringBuilder("select * from egdu_uploadregistry ");
		addWhereClause(selectQuery, preparedStatementValues, jobSearchRequest);
		logger.info("Query for job search : " + selectQuery);
		return selectQuery.toString();
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private void addWhereClause(final StringBuilder selectQuery, final List preparedStatementValues,
			final JobSearchRequest jobSearchRequest) {

		if(null == jobSearchRequest.getTenantId()){
			throw new CustomException("400", "No tenantId available");
		}
		selectQuery.append("WHERE TENANTID = ?");
		preparedStatementValues.add(jobSearchRequest.getTenantId());

		if (null != jobSearchRequest.getCodes() && !jobSearchRequest.getCodes().isEmpty()) {
			selectQuery.append(" AND code IN (" + getListAppendQuery(jobSearchRequest.getCodes()) + ")");
		}
		
		if (null != jobSearchRequest.getStatuses() && !jobSearchRequest.getStatuses().isEmpty()) {
			selectQuery.append(" AND status IN (" + getListAppendQuery(jobSearchRequest.getStatuses()) + ")");
		}
		
		if (null != jobSearchRequest.getRequesterNames() && !jobSearchRequest.getRequesterNames().isEmpty()) {
			selectQuery.append(" AND requester_name IN (" + getListAppendQuery(jobSearchRequest.getRequesterNames()) + ")");
		}

		if (null != jobSearchRequest.getRequestFileNames() && !jobSearchRequest.getRequestFileNames().isEmpty()) {
			selectQuery.append(" AND file_name IN (" + getListAppendQuery(jobSearchRequest.getRequestFileNames()) + ")");
		}
		
		if (jobSearchRequest.getStartDate() != null) {
			selectQuery.append(" AND start_time>?");
			preparedStatementValues.add(jobSearchRequest.getStartDate());
		}
		
		if (jobSearchRequest.getEndDate() != null) {
			selectQuery.append(" AND end_time<?");
			preparedStatementValues.add(jobSearchRequest.getEndDate());
		}

	}
	
	private String getListAppendQuery(final List<String> codes) {
		StringBuilder query = new StringBuilder();
		query.append("'").append(codes.get(0)).append("'");
		for(int i = 1; i < codes.size(); i++){
			query.append(",").append("'").append(codes.get(0)).append("'");
		}
		
		return query.toString();
	}

}
