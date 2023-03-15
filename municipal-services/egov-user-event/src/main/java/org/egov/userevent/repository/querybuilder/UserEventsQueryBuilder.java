package org.egov.userevent.repository.querybuilder;

import java.time.Instant;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.egov.tracer.model.CustomException;
import org.egov.userevent.config.PropertiesManager;
import org.egov.userevent.model.enums.Status;
import org.egov.userevent.web.contract.EventSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.egov.userevent.model.enums.Status;

@Component
public class UserEventsQueryBuilder {
	
	@Autowired
	private PropertiesManager properties;

	public static final String EVENT_COUNT_WRAPPER = " SELECT COUNT(id) FROM ({INTERNAL_QUERY}) AS count ";
	
	public static final String EVENT_SEARCH_QUERY = "SELECT id, tenantid, source, eventtype, category, description, status, referenceid, name, postedby,"
			+ " eventdetails, actions, recepient, createdby, createdtime, lastmodifiedby, lastmodifiedtime FROM eg_usrevents_events ";
	
	public static final String EVENT_INNER_SEARCH_QUERY = "id IN (SELECT eventid FROM eg_usrevents_recepnt_event_registry WHERE ";
	
	public static final String INSERT_USERLAT_IFNOT_EXISTS = "INSERT INTO eg_usrevents_user_lat VALUES (:userid, 0) ON CONFLICT DO NOTHING";
	
	public static final String COUNT_OF_NOTIFICATION_QUERY = "SELECT (SELECT COUNT(*) as total FROM eg_usrevents_events WHERE id IN (SELECT eventid FROM eg_usrevents_recepnt_event_registry WHERE recepient IN (:recepients))), "
			+ "COUNT(*) as unread FROM eg_usrevents_events WHERE id IN (SELECT eventid FROM eg_usrevents_recepnt_event_registry WHERE recepient IN (:recepients)) "
			+ "AND id NOT IN (SELECT referenceid FROM eg_usrevents_events WHERE referenceid NOTNULL) AND "
			+ "lastmodifiedtime > (SELECT lastaccesstime FROM eg_usrevents_user_lat WHERE userid IN (:userid))";
	
	/**
	 * Returns query for search events
	 * 
	 * @param criteria
	 * @param preparedStatementValues
	 * @return
	 */
	public String getSearchQuery(EventSearchCriteria criteria, Map<String, Object> preparedStatementValues) {
		String query = EVENT_SEARCH_QUERY;
		return addWhereClause(query, criteria, preparedStatementValues);
	}
	

	/**
	 * Returns query for inserting user-lat value in the table.
	 * 
	 * @param criteria
	 * @param preparedStatementValues
	 * @return
	 */
	public String getInserIfNotExistsQuery(EventSearchCriteria criteria, Map<String, Object> preparedStatementValues) {
		String query = INSERT_USERLAT_IFNOT_EXISTS;
		preparedStatementValues.put("userid", criteria.getUserids().get(0)); //will always have one user.
		
		return query;
		
	}
	/**
	 * Returns query for count of events
	 * 
	 * @param criteria
	 * @param preparedStatementValues
	 * @return
	 */
	public String getCountQuery(EventSearchCriteria criteria, Map<String, Object> preparedStatementValues) {
		String query = COUNT_OF_NOTIFICATION_QUERY;
		return addWhereClauseForCountQuery(query, criteria, preparedStatementValues);
	}
	
	/**
	 * Appends where clause to the query. 
	 *
	 * @param query
	 * @param criteria
	 * @param preparedStatementValues
	 * @return
	 */
	private String addWhereClauseForCountQuery(String query, EventSearchCriteria criteria, Map<String, Object> preparedStatementValues) {
		StringBuilder queryBuilder = new StringBuilder();
		queryBuilder.append(query);
		preparedStatementValues.put("recepients", criteria.getRecepients());
		preparedStatementValues.put("userid", criteria.getUserids());
		addClauseIfRequired(preparedStatementValues, queryBuilder);
		queryBuilder.append(" status IN (:status)");
		if(!CollectionUtils.isEmpty(criteria.getStatus()))
			preparedStatementValues.put("status", criteria.getStatus());

		else
			preparedStatementValues.put("status", "ACTIVE");


		if (criteria.getFromDate() != null) {
			addClauseIfRequired(preparedStatementValues, queryBuilder);

			//If user does not specify toDate, take today's date as toDate by default.
			if (criteria.getToDate() == null) {
				criteria.setToDate(Instant.now().toEpochMilli());
			}

			queryBuilder.append(" lastmodifiedtime BETWEEN :fromdate AND :todate");
			preparedStatementValues.put("fromdate",criteria.getFromDate());
			preparedStatementValues.put("todate",criteria.getToDate());

		} else {
			//if only toDate is provided as parameter without fromDate parameter
			if (criteria.getToDate() != null) {
				addClauseIfRequired(preparedStatementValues, queryBuilder);
				queryBuilder.append(" lastmodifiedtime <= :todate");
				preparedStatementValues.put("todate",criteria.getToDate());
			}
		}
		
		return queryBuilder.toString();

	}
	
	/**
	 * Builds the where clause for the query based on the criteria.
	 * 
	 * @param query
	 * @param criteria
	 * @param preparedStatementValues
	 * @return
	 */
	private String addWhereClause(String query, EventSearchCriteria criteria, Map<String, Object> preparedStatementValues) {
		StringBuilder queryBuilder = new StringBuilder();
		queryBuilder.append(query);		
		if(!CollectionUtils.isEmpty(criteria.getIds())) {
            addClauseIfRequired(preparedStatementValues, queryBuilder);
			queryBuilder.append("id IN (:id)");
			preparedStatementValues.put("id", criteria.getIds());
		}
		if(!CollectionUtils.isEmpty(criteria.getStatus())) {
            addClauseIfRequired(preparedStatementValues, queryBuilder);
			queryBuilder.append("status IN (:status)");
			preparedStatementValues.put("status", criteria.getStatus());
		}

		if (criteria.getFromDate() != null) {
			addClauseIfRequired(preparedStatementValues, queryBuilder);

			//If user does not specify toDate, take today's date as toDate by default.
			if (criteria.getToDate() == null) {
				criteria.setToDate(Instant.now().toEpochMilli());
			}

			queryBuilder.append(" lastmodifiedtime BETWEEN :fromdate AND :todate");
			preparedStatementValues.put("fromdate",criteria.getFromDate());
			preparedStatementValues.put("todate",criteria.getToDate());

		} else {
			//if only toDate is provided as parameter without fromDate parameter, throw an exception.
			if (criteria.getToDate() != null) {
				addClauseIfRequired(preparedStatementValues, queryBuilder);
				queryBuilder.append(" lastmodifiedtime <= :todate");
				preparedStatementValues.put("todate",criteria.getToDate());
			}
		}
		if(!CollectionUtils.isEmpty(criteria.getSource())) {
            addClauseIfRequired(preparedStatementValues, queryBuilder);
			queryBuilder.append("source IN (:source)");
			preparedStatementValues.put("source", criteria.getSource());
		}
		
		if(!CollectionUtils.isEmpty(criteria.getPostedBy())) {
            addClauseIfRequired(preparedStatementValues, queryBuilder);
			queryBuilder.append("postedby IN (:postedby)");
			preparedStatementValues.put("postedby", criteria.getPostedBy());
		}

		if(!CollectionUtils.isEmpty(criteria.getEventTypes())) {
            addClauseIfRequired(preparedStatementValues, queryBuilder);
			queryBuilder.append("eventtype IN (:eventtype)");
			preparedStatementValues.put("eventtype", criteria.getEventTypes());
		}
		
		if(!CollectionUtils.isEmpty(criteria.getName())) {
            addClauseIfRequired(preparedStatementValues, queryBuilder);
			queryBuilder.append("name IN (:name)");
			preparedStatementValues.put("name", criteria.getName());
		}
		
		if(!CollectionUtils.isEmpty(criteria.getReferenceIds())) {
            addClauseIfRequired(preparedStatementValues, queryBuilder);
			queryBuilder.append("referenceid IN (:referenceid)");
			preparedStatementValues.put("referenceid", criteria.getReferenceIds());
		}
		
		if(null != criteria.getIsCitizenSearch()) {
			if(!criteria.getIsCitizenSearch()) {
				if(!StringUtils.isEmpty(criteria.getTenantId())) {
		            addClauseIfRequired(preparedStatementValues, queryBuilder);
					queryBuilder.append("tenantid = :tenantid");
					preparedStatementValues.put("tenantid", criteria.getTenantId());
					
		            addClauseIfRequired(preparedStatementValues, queryBuilder);
					queryBuilder.append("referenceid IS NULL"); //counter events shouldn't be returned in employee search.
				}
			}
			
		}

		if(!CollectionUtils.isEmpty(criteria.getRecepients())) {
            addClauseIfRequired(preparedStatementValues, queryBuilder);
            queryBuilder.append(EVENT_INNER_SEARCH_QUERY);
    		queryBuilder.append("recepient IN (:recepients)");
    		preparedStatementValues.put("recepients", criteria.getRecepients());
    		queryBuilder.append(" )");
		}
		
		queryBuilder.append(" ORDER BY createdtime DESC"); //default ordering on the platform.
		// Do NOT paginate in case of building count query
		if(!criteria.getIsEventsCountCall()) {
			queryBuilder.append(" OFFSET :offset");
			preparedStatementValues.put("offset", null == criteria.getOffset() ? properties.getDefaultOffset() : criteria.getOffset());
			queryBuilder.append(" LIMIT :limit");
			preparedStatementValues.put("limit", null == criteria.getLimit() ? properties.getDefaultLimit() : criteria.getLimit());
		}
		
		return queryBuilder.toString();
		
	}
	
    private static void addClauseIfRequired(Map<String, Object> values, StringBuilder queryString) {
        if (values.isEmpty())
            queryString.append(" WHERE ");
        else {
            queryString.append(" AND ");
        }
    }

	public String addCountWrapper(String query) {
		return EVENT_COUNT_WRAPPER.replace("{INTERNAL_QUERY}", query);
	}
}
