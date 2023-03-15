package org.egov.swservice.repository.builder;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.swservice.config.SWConfiguration;
import org.egov.swservice.service.UserService;
import org.egov.swservice.util.SewerageServicesUtil;
import org.egov.swservice.web.models.Property;
import org.egov.swservice.web.models.SearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import static org.egov.swservice.util.SWConstants.SEARCH_TYPE_CONNECTION;

@Component
public class SWQueryBuilder {

	@Autowired
	private SewerageServicesUtil sewerageServicesUtil;

	@Autowired
	private SWConfiguration config;
	
	@Autowired
    private UserService userService;

	private static final String INNER_JOIN_STRING = "INNER JOIN";
	private static final String LEFT_OUTER_JOIN_STRING = " LEFT OUTER JOIN ";
	
	private static String holderSelectValues = "connectionholder.tenantid as holdertenantid, connectionholder.connectionid as holderapplicationId, userid, connectionholder.status as holderstatus, isprimaryholder, connectionholdertype, holdershippercentage, connectionholder.relationship as holderrelationship, connectionholder.createdby as holdercreatedby, connectionholder.createdtime as holdercreatedtime, connectionholder.lastmodifiedby as holderlastmodifiedby, connectionholder.lastmodifiedtime as holderlastmodifiedtime";
	
	private final static String SEWERAGE_SEARCH_QUERY = "SELECT conn.*, sc.*, document.*, plumber.*, sc.connectionExecutionDate,"
			+ "sc.noOfWaterClosets, sc.noOfToilets,sc.proposedWaterClosets, sc.proposedToilets, sc.connectionType, sc.connection_id as connection_Id, sc.appCreatedDate as sc_appCreatedDate,"
			+ "  sc.detailsprovidedby, sc.estimationfileStoreId , sc.sanctionfileStoreId , sc.estimationLetterDate,"
			+ " conn.id as conn_id, conn.tenantid, conn.applicationNo, conn.applicationStatus, conn.status, conn.connectionNo, conn.oldConnectionNo, conn.property_id,"
			+ " conn.roadcuttingarea, conn.action, conn.adhocpenalty, conn.adhocrebate, conn.createdBy as sw_createdBy,"
			+ " conn.lastModifiedBy as sw_lastModifiedBy, conn.createdTime as sw_createdTime, conn.lastModifiedTime as sw_lastModifiedTime,conn.additionaldetails, "
			+ " conn.adhocpenaltyreason, conn.adhocpenaltycomment, conn.adhocrebatereason, conn.adhocrebatecomment, conn.applicationType, conn.channel, conn.dateEffectiveFrom,"
			+ " conn.locality, conn.isoldapplication, conn.roadtype, conn.disconnectionreason, conn.isDisconnectionTemporary, sc.disconnectionExecutionDate, document.id as doc_Id, document.documenttype, document.filestoreid, document.active as doc_active, plumber.id as plumber_id, plumber.name as plumber_name, plumber.licenseno,"
			+ " roadcuttingInfo.id as roadcutting_id, roadcuttingInfo.roadtype as roadcutting_roadtype, roadcuttingInfo.roadcuttingarea as roadcutting_roadcuttingarea, roadcuttingInfo.roadcuttingarea as roadcutting_roadcuttingarea, roadcuttingInfo.active as roadcutting_active,"
			+ " plumber.mobilenumber as plumber_mobileNumber, plumber.gender as plumber_gender, plumber.fatherorhusbandname, plumber.correspondenceaddress, plumber.relationship, " + holderSelectValues 
			+ " FROM eg_sw_connection conn "
			+  INNER_JOIN_STRING 
			+ " eg_sw_service sc ON sc.connection_id = conn.id"
			+  LEFT_OUTER_JOIN_STRING
			+ "eg_sw_applicationdocument document ON document.swid = conn.id" 
			+  LEFT_OUTER_JOIN_STRING
			+ "eg_sw_plumberinfo plumber ON plumber.swid = conn.id" 
			+  LEFT_OUTER_JOIN_STRING
			+ "eg_sw_connectionholder connectionholder ON connectionholder.connectionid = conn.id"
			+  LEFT_OUTER_JOIN_STRING
			+ "eg_sw_roadcuttinginfo roadcuttingInfo ON roadcuttingInfo.swid = conn.id AND roadcuttingInfo.active != 'INACTIVE'";
	
	private final static String SEARCH_COUNT_QUERY = " FROM eg_sw_connection conn "
			+  INNER_JOIN_STRING 
			+ " eg_sw_service sc ON sc.connection_id = conn.id"
			+  LEFT_OUTER_JOIN_STRING
			+ "eg_sw_applicationdocument document ON document.swid = conn.id" 
			+  LEFT_OUTER_JOIN_STRING
			+ "eg_sw_plumberinfo plumber ON plumber.swid = conn.id" 
			+  LEFT_OUTER_JOIN_STRING
			+ "eg_sw_connectionholder connectionholder ON connectionholder.connectionid = conn.id"
			+  LEFT_OUTER_JOIN_STRING
			+ "eg_sw_roadcuttinginfo roadcuttingInfo ON roadcuttingInfo.swid = conn.id";

	private static final String TOTAL_APPLICATIONS_COUNT_QUERY = "select count(*) from eg_sw_connection where tenantid = ?;";

	private final String paginationWrapper = "SELECT * FROM " +
            "(SELECT *, DENSE_RANK() OVER (ORDER BY sc_appCreatedDate DESC) offset_ FROM " +
            "({})" +
            " result) result_offset " +
            "WHERE offset_ > ? AND offset_ <= ?";
	
	private static final String COUNT_WRAPPER = " SELECT COUNT(*) FROM ({INTERNAL_QUERY}) AS count ";
	
	private static final String ORDER_BY_CLAUSE = " ORDER BY sc.appCreatedDate DESC";

	private static final String ORDER_BY_COUNT_CLAUSE = " ORDER BY appCreatedDate DESC";

	private static final String LATEST_EXECUTED_MIGRATION_QUERY = "select * from eg_sw_enc_audit where tenantid = ? order by createdTime desc limit 1;";

	/**
	 *
	 * @param criteria on search criteria
	 * @param preparedStatement preparedStatement
	 * @param requestInfo Request Info Object
	 * @return Returns the created Query
	 */
	public String getSearchQueryString(SearchCriteria criteria, List<Object> preparedStatement,
			RequestInfo requestInfo) {
		if (criteria.isEmpty())
			return null;
		Set<String> propertyIds = new HashSet<>();
		
		if (criteria.getIsCountCall() == null)
			criteria.setIsCountCall(Boolean.FALSE);

		StringBuilder query;
		if (!criteria.getIsCountCall())
			query = new StringBuilder(SEWERAGE_SEARCH_QUERY);
		else if (criteria.getIsCountCall() && !StringUtils.isEmpty(criteria.getSearchType())
				&& criteria.getSearchType().equalsIgnoreCase(SEARCH_TYPE_CONNECTION)) {
			query = new StringBuilder("SELECT DISTINCT(conn.connectionno),max(sc.appCreatedDate) appCreatedDate");
			query.append(SEARCH_COUNT_QUERY);
		} else {
			query = new StringBuilder("SELECT DISTINCT(conn.applicationNo),max(sc.appCreatedDate) appCreatedDate");
			query.append(SEARCH_COUNT_QUERY);
		}

		boolean propertyIdsPresent = false;
		
		if (!StringUtils.isEmpty(criteria.getMobileNumber()) || !StringUtils.isEmpty(criteria.getDoorNo())
				|| !StringUtils.isEmpty(criteria.getOwnerName()) || !StringUtils.isEmpty(criteria.getPropertyId())) {
			List<Property> propertyList = sewerageServicesUtil.propertySearchOnCriteria(criteria, requestInfo);
			propertyList.forEach(property -> propertyIds.add(property.getPropertyId()));
			criteria.setPropertyIds(propertyIds);
			if (!propertyIds.isEmpty()) {
				addClauseIfRequired(preparedStatement, query);
				query.append(" (conn.property_id in (").append(createQuery(propertyIds)).append(" )");
				addToPreparedStatement(preparedStatement, propertyIds);
				propertyIdsPresent = true;
			}
		}
		
		Set<String> uuids = null;
		if(!StringUtils.isEmpty(criteria.getMobileNumber()) || !StringUtils.isEmpty(criteria.getOwnerName())
				|| !StringUtils.isEmpty(criteria.getDoorNo())) {
		//	Set<String> uuids = userService.getUUIDForUsers(criteria.getMobileNumber(), criteria.getTenantId(), requestInfo);
			boolean userIdsPresent = false;
			if(!StringUtils.isEmpty(criteria.getMobileNumber()) || !StringUtils.isEmpty(criteria.getOwnerName())) {
				uuids = userService.getUUIDForUsers(criteria.getMobileNumber(),criteria.getOwnerName(), criteria.getTenantId(), requestInfo);
				criteria.setUserIds(uuids);
				}
			if (!CollectionUtils.isEmpty(uuids)) {
				addORClauseIfRequired(preparedStatement, query);
				if(!propertyIdsPresent)
					query.append("(");
				query.append(" connectionholder.userid in (").append(createQuery(uuids)).append(" ))");
				addToPreparedStatement(preparedStatement, uuids);
				userIdsPresent = true;
			}
			if(propertyIdsPresent && !userIdsPresent){
				query.append(")");
			}
			if(!propertyIdsPresent && !userIdsPresent) {
				return null;
			}
		}
		
		/*
		 * to return empty result for mobilenumber empty result
		 */
		if (!StringUtils.isEmpty(criteria.getMobileNumber())  
				&& !StringUtils.isEmpty(criteria.getDoorNo()) && !StringUtils.isEmpty(criteria.getOwnerName()) && 
				CollectionUtils.isEmpty(criteria.getPropertyIds()) && CollectionUtils.isEmpty(criteria.getUserIds())
				&& CollectionUtils.isEmpty(criteria.getApplicationNumber()) && StringUtils.isEmpty(criteria.getPropertyId())
				&& CollectionUtils.isEmpty(criteria.getConnectionNumber()) && CollectionUtils.isEmpty(criteria.getIds())) {
			return null;
		}
		
		if (!StringUtils.isEmpty(criteria.getTenantId())) {
			addClauseIfRequired(preparedStatement, query);
			if(criteria.getTenantId().equalsIgnoreCase(config.getStateLevelTenantId())){
				query.append(" conn.tenantid LIKE ? ");
				preparedStatement.add(criteria.getTenantId() + '%');
			}
			else{
				query.append(" conn.tenantid = ? ");
				preparedStatement.add(criteria.getTenantId());
			}
		}

		if (!StringUtils.isEmpty(criteria.getPropertyId()) && (StringUtils.isEmpty(criteria.getMobileNumber())
				&&  StringUtils.isEmpty(criteria.getDoorNo()) &&  StringUtils.isEmpty(criteria.getOwnerName()))) {
			if(propertyIdsPresent)
				query.append(")");
			else{
				addClauseIfRequired(preparedStatement, query);
				query.append(" conn.property_id = ? ");
				preparedStatement.add(criteria.getPropertyId());
			}
		}
		if (!CollectionUtils.isEmpty(criteria.getIds())) {
			addClauseIfRequired(preparedStatement, query);
			query.append(" conn.id in (").append(createQuery(criteria.getIds())).append(" )");
			addToPreparedStatement(preparedStatement, criteria.getIds());
		}

		if (!StringUtils.isEmpty(criteria.getOldConnectionNumber())) {
			addClauseIfRequired(preparedStatement, query);
			query.append(" conn.oldconnectionno = ? ");
			preparedStatement.add(criteria.getOldConnectionNumber());
		}

		// Added clause to support multiple connectionNumbers search
		if (!CollectionUtils.isEmpty(criteria.getConnectionNumber())) {
			addClauseIfRequired(preparedStatement, query);
			query.append("  conn.connectionno IN (").append(createQuery(criteria.getConnectionNumber())).append(")");
			addToPreparedStatement(preparedStatement, criteria.getConnectionNumber());
		}
		
		if (!StringUtils.isEmpty(criteria.getStatus())) {
			addClauseIfRequired(preparedStatement, query);
			query.append(" conn.status = ? ");
			preparedStatement.add(criteria.getStatus());
		}
		
		// Added clause to support multiple applicationNumbers search
		if (!CollectionUtils.isEmpty(criteria.getApplicationNumber())) {
			addClauseIfRequired(preparedStatement, query);
			query.append("  conn.applicationno IN (").append(createQuery(criteria.getApplicationNumber())).append(")");
			addToPreparedStatement(preparedStatement, criteria.getApplicationNumber());
		}
		// Added clause to support multiple applicationStatuses search
		if (!CollectionUtils.isEmpty(criteria.getApplicationStatus())) {
			if (StringUtils.isEmpty(criteria.getSearchType())
					|| !criteria.getSearchType().equalsIgnoreCase(SEARCH_TYPE_CONNECTION)) {
				addClauseIfRequired(preparedStatement, query);
				query.append("  conn.applicationStatus IN (").append(createQuery(criteria.getApplicationStatus()))
						.append(")");
				addToPreparedStatement(preparedStatement, criteria.getApplicationStatus());
			}
		}
		
		if (criteria.getFromDate() != null) {
			addClauseIfRequired(preparedStatement, query);
			query.append("  sc.appCreatedDate >= ? ");
			preparedStatement.add(criteria.getFromDate());
		}
		if (criteria.getToDate() != null) {
			addClauseIfRequired(preparedStatement, query);
			query.append("  sc.appCreatedDate <= ? ");
			preparedStatement.add(criteria.getToDate());
		}
		if(!StringUtils.isEmpty(criteria.getApplicationType())) {
			addClauseIfRequired(preparedStatement, query);
			query.append(" conn.applicationType = ? ");
			preparedStatement.add(criteria.getApplicationType());
		}
		if(!StringUtils.isEmpty(criteria.getSearchType())
				&& criteria.getSearchType().equalsIgnoreCase(SEARCH_TYPE_CONNECTION)){
			addClauseIfRequired(preparedStatement, query);
			query.append(" conn.isoldapplication = ? ");
			preparedStatement.add(Boolean.FALSE);
			addClauseIfRequired(preparedStatement, query);
			query.append(" conn.connectionno is not null ");
			addClauseIfRequired(preparedStatement, query);
			query.append(" conn.applicationstatus in ('APPROVED','CONNECTION_ACTIVATED','DISCONNECTION_EXECUTED') ");
		}
		if (!StringUtils.isEmpty(criteria.getLocality())) {
			addClauseIfRequired(preparedStatement, query);
			query.append(" conn.locality = ? ");
			preparedStatement.add(criteria.getLocality());
		}

		// Add OrderBy clause
		if (criteria.getIsCountCall() && !StringUtils.isEmpty(criteria.getSearchType())
				&& criteria.getSearchType().equalsIgnoreCase(SEARCH_TYPE_CONNECTION))
			query.append("GROUP BY conn.connectionno ").append(ORDER_BY_COUNT_CLAUSE);
		else if (criteria.getIsCountCall())
			query.append("GROUP BY conn.applicationno ").append(ORDER_BY_COUNT_CLAUSE);
		else
			query.append(ORDER_BY_CLAUSE);
		
		// Pagination to limit results, do not paginate query in case of count call.
		if (!criteria.getIsCountCall()) {
			if (query.toString().contains("WHERE"))
				return addPaginationWrapper(query.toString(), preparedStatement, criteria);
		}
		
		return query.toString();
	}

	public String getSearchCountQueryString(SearchCriteria criteria, List<Object> preparedStmtList,
			RequestInfo requestInfo) {
		String query = getSearchQueryString(criteria, preparedStmtList, requestInfo);
		if (query != null)
			return COUNT_WRAPPER.replace("{INTERNAL_QUERY}", query);
		else
			return query;
	}
	
	private void addClauseIfRequired(List<Object> values, StringBuilder queryString) {
		if (values.isEmpty())
			queryString.append(" WHERE ");
		else {
			queryString.append(" AND");
		}
	}

	private String createQuery(Set<String> ids) {
		StringBuilder builder = new StringBuilder();
		int length = ids.size();
		for (int i = 0; i < length; i++) {
			builder.append(" ?");
			if (i != length - 1)
				builder.append(",");
		}
		return builder.toString();
	}

	private void addToPreparedStatement(List<Object> preparedStatement, Set<String> ids) {
		preparedStatement.addAll(ids);
	}


	/**
	 * 
	 * @param query
	 *            Query String
	 * @param preparedStmtList
	 *            Array of object for preparedStatement list
	 * @param criteria Search Criteria
	 * @return It's returns query
	 */
	private String addPaginationWrapper(String query, List<Object> preparedStmtList, SearchCriteria criteria) {
		Integer limit = config.getDefaultLimit();
		Integer offset = config.getDefaultOffset();
		if (criteria.getLimit() == null && criteria.getOffset() == null)
			limit = config.getMaxLimit();

		if (criteria.getLimit() != null && criteria.getLimit() <= config.getDefaultLimit())
			limit = criteria.getLimit();

		if (criteria.getLimit() != null && criteria.getLimit() > config.getDefaultLimit())
			limit = config.getDefaultLimit();

		if (criteria.getOffset() != null)
			offset = criteria.getOffset();

		preparedStmtList.add(offset);
		preparedStmtList.add(limit + offset);
		return paginationWrapper.replace("{}",query);
	}
	
	private void addORClauseIfRequired(List<Object> values, StringBuilder queryString){
		if (values.isEmpty())
			queryString.append(" WHERE ");
		else {
			queryString.append(" OR");
		}
	}
	
	public String getSearchQueryStringForPlainSearch(SearchCriteria criteria, List<Object> preparedStatement,
			RequestInfo requestInfo) {
		if(criteria.isEmpty())
			return null;
		StringBuilder query = new StringBuilder(SEWERAGE_SEARCH_QUERY);
		
		if (!StringUtils.isEmpty(criteria.getTenantId())) {
			addClauseIfRequired(preparedStatement, query);
			if(criteria.getTenantId().equalsIgnoreCase(config.getStateLevelTenantId())){
				query.append(" conn.tenantid LIKE ? ");
				preparedStatement.add(criteria.getTenantId() + '%');
			}
			else{
				query.append(" conn.tenantid = ? ");
				preparedStatement.add(criteria.getTenantId());
			}
		}
		
		//Add OrderBy clause
		query.append(" ORDER BY sc.appCreatedDate DESC");
		
		if (query.toString().contains("WHERE"))
			return addPaginationWrapperForPlainSearch(query.toString(), preparedStatement, criteria);
		return query.toString();
	}

	public String getTotalApplicationsCountQueryString(SearchCriteria criteria, List<Object> preparedStatement) {
		preparedStatement.add(criteria.getTenantId());
		return TOTAL_APPLICATIONS_COUNT_QUERY;
	}

	private String addPaginationWrapperForPlainSearch(String query, List<Object> preparedStmtList, SearchCriteria criteria) {
		Integer limit = config.getDefaultLimit();
		Integer offset = config.getDefaultOffset();
		StringBuilder finalQuery = null;

		if (criteria.getLimit() == null && criteria.getOffset() == null)
			limit = config.getMaxLimit();

		if (criteria.getLimit() != null && criteria.getLimit() <= config.getMaxLimit())
			limit = criteria.getLimit();

		if (criteria.getLimit() != null && criteria.getLimit() > config.getMaxLimit()) {
			limit = config.getMaxLimit();
		}

		if (criteria.getOffset() != null)
			offset = criteria.getOffset();

		if (limit <= 0) {
			return finalQuery.toString();
		} else {
			finalQuery = new StringBuilder(paginationWrapper.replace("{}", query));
			preparedStmtList.add(offset);
			preparedStmtList.add(limit + offset);
		}

		return finalQuery.toString();
	}

	public String getLastExecutionDetail(SearchCriteria criteria, List<Object> preparedStatement) {
		preparedStatement.add(criteria.getTenantId());
		return LATEST_EXECUTED_MIGRATION_QUERY;
	}

}
