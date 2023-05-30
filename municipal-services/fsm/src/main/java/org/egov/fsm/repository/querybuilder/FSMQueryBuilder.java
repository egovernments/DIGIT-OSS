package org.egov.fsm.repository.querybuilder;

import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;

import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.web.model.FSMSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

@Component
public class FSMQueryBuilder {

	@Autowired
	private FSMConfiguration config;

	private static final String QUERY = "select count(*) OVER() AS full_count,fsm.*,fsm_address.*,fsm_geo.*,fsm_pit.*,fsm.id as fsm_id, fsm.createdby as fsm_createdby,"
			+ "  fsm.lastmodifiedby as fsm_lastmodifiedby, fsm.createdtime as fsm_createdtime, fsm.lastmodifiedtime as fsm_lastmodifiedtime,"
			+ "	 fsm.additionaldetails,fsm_address.id as fsm_address_id, fsm_address.additionaldetails as addressAdditionalDetails, fsm_geo.id as fsm_geo_id,"
			+ "	 fsm_pit.id as fsm_pit_id, fsm_pit.additionalDetails as fsm_pit_additionalDetails"
			+ "	 FROM eg_fsm_application fsm"
			+ "	 INNER JOIN   eg_fsm_address fsm_address on fsm_address.fsm_id = fsm.id"
			+ "	 LEFT OUTER JOIN  eg_fsm_geolocation fsm_geo on fsm_geo.address_id = fsm_address.id"
			+ "	 LEFT OUTER JOIN  eg_fsm_pit_detail fsm_pit on fsm_pit.fsm_id = fsm.id";

	private static final String PAGINATION_WRAPPER = "{} {orderby} {pagination}";

	public static final String GET_PERIODIC_ELGIABLE_APPLICATIONS = "select applicationno from eg_fsm_application ";

	public static final String GET_UNIQUE_TENANTS = "select distinct(tenantid) from eg_fsm_application";

	public static final String GET_APPLICATION_LIST = "select applicationno from eg_fsm_application where oldapplicationno=? and tenantid=?";

	public static final String GET_VEHICLE_TRIPS_LIST = "SELECT * FROM eg_vehicle_trip_detail WHERE referenceno= ? and status='ACTIVE' order by createdtime desc ";

	public String getFSMSearchQuery(FSMSearchCriteria criteria, String dsoId, List<Object> preparedStmtList) {

		StringBuilder builder = new StringBuilder(QUERY);
		if (criteria.getTenantId() != null) {
			if (criteria.getTenantId().split("\\.").length == 1) {
				addClauseIfRequired(preparedStmtList, builder);
				builder.append(" fsm.tenantid like ?");
				preparedStmtList.add('%' + criteria.getTenantId() + '%');
			} else {
				addClauseIfRequired(preparedStmtList, builder);
				builder.append(" fsm.tenantid=? ");
				preparedStmtList.add(criteria.getTenantId());
			}
		}

		/*
		 * Enable part search by application number of fsm application
		 */
		List<String> applicationNumber = criteria.getApplicationNos();
		if (!CollectionUtils.isEmpty(applicationNumber) && (applicationNumber.stream()
				.filter(checkappnumber -> checkappnumber.length() > 0).findFirst().orElse(null) != null)) {
			boolean flag = false;
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(" ( ");
			for (String applicationno : applicationNumber) {

				if (flag)
					builder.append(" OR ");
				builder.append(" UPPER(fsm.applicationNo) like ?");
				preparedStmtList.add('%' + org.apache.commons.lang3.StringUtils.upperCase(applicationno) + '%');
				builder.append(" ESCAPE '_' ");
				flag = true;

			}
			builder.append(" ) ");
		}

		List<String> applicationStatus = criteria.getApplicationStatus();
		if (!CollectionUtils.isEmpty(applicationStatus)) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(" fsm.applicationStatus IN (").append(createQuery(applicationStatus)).append(")");
			addToPreparedStatement(preparedStmtList, applicationStatus);
		}

		List<String> locality = criteria.getLocality();
		if (!CollectionUtils.isEmpty(locality)) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(" fsm_address.locality IN (").append(createQuery(locality)).append(")");
			addToPreparedStatement(preparedStmtList, locality);

		}

		List<String> ids = criteria.getIds();
		if (!CollectionUtils.isEmpty(ids)) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(" fsm.id IN (").append(createQuery(ids)).append(")");
			addToPreparedStatement(preparedStmtList, ids);

		}

		if (criteria.getApplicationType() != null) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(" fsm.applicationType=? ");
			preparedStmtList.add(criteria.getApplicationType());

		}

		List<String> oldApplicationNo = criteria.getOldApplicationNos();
		if (!CollectionUtils.isEmpty(oldApplicationNo)) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(" fsm.oldApplicationNo IN (").append(createQuery(oldApplicationNo)).append(")");
			addToPreparedStatement(preparedStmtList, oldApplicationNo);

		}

		if (criteria.getFromDate() != null && criteria.getToDate() != null) {

			Calendar fromDate = Calendar.getInstance(TimeZone.getDefault());
			fromDate.setTimeInMillis(criteria.getFromDate());
			fromDate.set(Calendar.HOUR_OF_DAY, 0);
			fromDate.set(Calendar.MINUTE, 0);
			fromDate.set(Calendar.SECOND, 0);

			Calendar toDate = Calendar.getInstance(TimeZone.getDefault());
			toDate.setTimeInMillis(criteria.getToDate());
			toDate.set(Calendar.HOUR_OF_DAY, 23);
			toDate.set(Calendar.MINUTE, 59);
			toDate.set(Calendar.SECOND, 59);
			toDate.set(Calendar.MILLISECOND, 0);

			addClauseIfRequired(preparedStmtList, builder);
			builder.append(" fsm.createdtime BETWEEN ").append(fromDate.getTimeInMillis()).append(" AND ")
					.append(toDate.getTimeInMillis());
		}

		List<String> ownerIds = criteria.getOwnerIds();
		if (!CollectionUtils.isEmpty(ownerIds)) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(" fsm.accountId IN (").append(createQuery(ownerIds)).append(")");
			addToPreparedStatement(preparedStmtList, ownerIds);
		}

		if (org.apache.commons.lang3.StringUtils.isNotBlank(dsoId)) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(" fsm.dso_id = ?");
			preparedStmtList.add(dsoId);
		}
		return addPaginationWrapper(builder.toString(), preparedStmtList, criteria);

	}

	/**
	 * 
	 * @param query            prepared Query
	 * @param preparedStmtList values to be replased on the query
	 * @param criteria         fsm search criteria
	 * @return the query by replacing the placeholders with preparedStmtList
	 */
	private String addPaginationWrapper(String query, List<Object> preparedStmtList, FSMSearchCriteria criteria) {

		int limit = config.getDefaultLimit();
		int offset = config.getDefaultOffset();
		String finalQuery = PAGINATION_WRAPPER.replace("{}", query);

		if (criteria.getLimit() != null && criteria.getLimit() <= config.getMaxSearchLimit())
			limit = criteria.getLimit();

		if (criteria.getLimit() != null && criteria.getLimit() > config.getMaxSearchLimit()) {
			limit = config.getMaxSearchLimit();
		}

		if (criteria.getOffset() != null)
			offset = criteria.getOffset();

		StringBuilder orderQuery = new StringBuilder();
		addOrderByClause(orderQuery, criteria);
		finalQuery = finalQuery.replace("{orderby}", orderQuery.toString());

		if (limit == -1) {
			finalQuery = finalQuery.replace("{pagination}", "");
		} else {
			finalQuery = finalQuery.replace("{pagination}", " offset ?  limit ?  ");
			preparedStmtList.add(offset);
			preparedStmtList.add(limit);
		}

		return finalQuery;

	}

	private void addClauseIfRequired(List<Object> values, StringBuilder queryString) {
		if (values.isEmpty())
			queryString.append(" WHERE ");
		else {
			queryString.append(" AND");
		}
	}

	private void addToPreparedStatement(List<Object> preparedStmtList, List<String> ids) {
		ids.forEach(id -> {
			preparedStmtList.add(id);
		});

	}

	private Object createQuery(List<String> ids) {
		StringBuilder builder = new StringBuilder();
		int length = ids.size();
		for (int i = 0; i < length; i++) {
			builder.append(" ?");
			if (i != length - 1)
				builder.append(",");
		}
		return builder.toString();
	}

	/**
	 * 
	 * @param builder
	 * @param criteria
	 */
	private void addOrderByClause(StringBuilder builder, FSMSearchCriteria criteria) {

		if (StringUtils.isEmpty(criteria.getSortBy()))
			builder.append(" ORDER BY fsm_lastmodifiedtime ");

		else if (criteria.getSortBy() == FSMSearchCriteria.SortBy.locality)
			builder.append(" ORDER BY fsm_address.locality ");

		else if (criteria.getSortBy() == FSMSearchCriteria.SortBy.applicationStatus)
			builder.append(" ORDER BY fsm.applicationStatus ");

		else if (criteria.getSortBy() == FSMSearchCriteria.SortBy.applicationNumber)
			builder.append(" ORDER BY fsm.applicationno ");

		else if (criteria.getSortBy() == FSMSearchCriteria.SortBy.propertyUsage)
			builder.append(" ORDER BY fsm.propertyUsage ");

		else if (criteria.getSortBy() == FSMSearchCriteria.SortBy.vehicle)
			builder.append(" ORDER BY fsm.vehicle_id ");

		else if (criteria.getSortBy() == FSMSearchCriteria.SortBy.createdTime)
			builder.append(" ORDER BY fsm.createdtime ");

		if (criteria.getSortOrder() == FSMSearchCriteria.SortOrder.ASC)
			builder.append(" ASC ");
		else
			builder.append(" DESC ");

	}

	public String getFSMLikeQuery(FSMSearchCriteria criteria, List<Object> preparedStmtList) {

		StringBuilder builder = new StringBuilder(QUERY);

		List<String> ids = criteria.getIds();
		if (!CollectionUtils.isEmpty(ids)) {

			addClauseIfRequired(preparedStmtList, builder);
			builder.append(" fsm.id IN (").append(createQuery(ids)).append(")");
			addToPreparedStatement(preparedStmtList, ids);
		}

		return addPaginationClause(builder, preparedStmtList, criteria);

	}

	private String addPaginationClause(StringBuilder builder, List<Object> preparedStmtList,
			FSMSearchCriteria criteria) {

		if (criteria.getLimit() != null && criteria.getLimit() != 0) {
			builder.append(
					"and fsm.id in (select id from eg_fsm_application where tenantid= ? order by id offset ? limit ?)");
			preparedStmtList.add(criteria.getTenantId());
			preparedStmtList.add(criteria.getOffset());
			preparedStmtList.add(criteria.getLimit());

			addOrderByClause(builder, criteria);

		} else {
			addOrderByClause(builder, criteria);
		}
		return builder.toString();
	}

	public String getTripDetailSarchQuery(String referenceNumber, int numOfRecords, List<Object> preparedStmtList) {
		StringBuilder builder = new StringBuilder(GET_VEHICLE_TRIPS_LIST);
		preparedStmtList.add(referenceNumber);
		if (numOfRecords != 0) {
			builder.append("fetch first ? rows only");
			preparedStmtList.add(numOfRecords);
		}
		return builder.toString();
	}

}
