package org.egov.vehicle.trip.querybuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.egov.vehicle.config.VehicleConfiguration;
import org.egov.vehicle.trip.web.model.VehicleTripSearchCriteria;
import org.egov.vehicle.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

@Component
public class VehicleTripQueryBuilder {

	private static final String QUERY_VEHICLE_LOG_EXIST = "SELECT count(*) FROM eg_vehicle_trip where id =? AND status='ACTIVE'";
	private static final String QUERY_SEARCH_VEHICLE_LOG = "select count(*) OVER() AS full_count, * from eg_vehicle_trip WHERE tenantid like ?";
	private static final String PAGINATION_WRAPPER = "{} {orderby}  OFFSET ? LIMIT ?";
	private static final String QUERY_TRIP_FROM_REF = "SELECT trip_id from eg_vehicle_trip_detail WHERE  status='ACTIVE' and referenceno in ( %s )";
	private static final String QUERY_TRIP_DTL = "SELECT * FROM eg_vehicle_trip_detail WHERE status='ACTIVE' and trip_id = ? ";

	@Autowired
	private VehicleConfiguration config;

	private String convertListToString(List<String> namesList) {
		return String.join(",", namesList.stream().map(name -> ("'" + name + "'")).collect(Collectors.toList()));
	}

	public String getVehicleLogExistQuery(String vehicleLogId, List<Object> preparedStmtList) {
		preparedStmtList.add(vehicleLogId);
		return QUERY_VEHICLE_LOG_EXIST;
	}

	public String getVehicleLogSearchQuery(VehicleTripSearchCriteria criteria, List<Object> preparedStmtList) {
		StringBuilder query = new StringBuilder(QUERY_SEARCH_VEHICLE_LOG);
		if (criteria.getTenantId() != null) {
			if (criteria.getTenantId().split("\\.").length == 1) {

				preparedStmtList.add('%' + criteria.getTenantId() + '%');
			} else {

				preparedStmtList.add(criteria.getTenantId());
			}
		}

		if (!CollectionUtils.isEmpty(criteria.getIds())) {
			query.append(" AND id IN(").append(createQuery(criteria.getIds())).append(")");
			addToPreparedStatement(preparedStmtList, criteria.getIds());
		}
		if (!CollectionUtils.isEmpty(criteria.getVehicleIds())) {
			query.append(" AND vehicle_id IN(").append(createQuery(criteria.getVehicleIds())).append(")");
			addToPreparedStatement(preparedStmtList, criteria.getVehicleIds());
		}

		if (!CollectionUtils.isEmpty(criteria.getDriverIds())) {
			query.append(" AND driver_id IN(").append(createQuery(criteria.getDriverIds())).append(")");
			addToPreparedStatement(preparedStmtList, criteria.getDriverIds());
		}

		if (!CollectionUtils.isEmpty(criteria.getTripOwnerIds())) {
			query.append(" AND owner_id IN(").append(createQuery(criteria.getTripOwnerIds())).append(")");
			addToPreparedStatement(preparedStmtList, criteria.getTripOwnerIds());
		}

		if (!CollectionUtils.isEmpty(criteria.getApplicationNos())) {
			query.append(" AND applicationno IN(").append(createQuery(criteria.getApplicationNos())).append(")");
			addToPreparedStatement(preparedStmtList, criteria.getApplicationNos());
		}

		if (!StringUtils.isEmpty(criteria.getBusinessService())) {
			query.append(" AND businessservice = ?");
			preparedStmtList.add(criteria.getBusinessService());
		}

		if (!CollectionUtils.isEmpty(criteria.getApplicationStatus())) {
			query.append(" AND applicationstatus IN(").append(createQuery(criteria.getApplicationStatus())).append(")");
			addToPreparedStatement(preparedStmtList, criteria.getApplicationStatus());
		}
		if (CollectionUtils.isEmpty(criteria.getStatus())) {
			List<String> applicationStatus = criteria.getApplicationStatus();
			if (!CollectionUtils.isEmpty(applicationStatus)
					&& applicationStatus.contains(Constants.WAITING_FOR_DISPOSAL)) {
				List<String> statusData = new ArrayList<>();
				statusData.add(Constants.ACTIVE);
				query.append(" AND status IN(").append(createQuery(statusData)).append(")");
				addToPreparedStatement(preparedStmtList, statusData);
			}
		}
		return addPaginationWrapper(query.toString(), criteria, preparedStmtList);
	}

	private String addPaginationWrapper(String query, VehicleTripSearchCriteria criteria,
			List<Object> preparedStmtList) {

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
			finalQuery = finalQuery.replace("OFFSET ? LIMIT ?", "");
		} else {
			preparedStmtList.add(offset);
			preparedStmtList.add(limit);
		}

		return finalQuery;

	}

	private void addOrderByClause(StringBuilder builder, VehicleTripSearchCriteria criteria) {

		if (StringUtils.isEmpty(criteria.getSortBy()))
			builder.append(" ORDER BY lastmodifiedtime ");

		else if (criteria.getSortBy() == VehicleTripSearchCriteria.SortBy.applicationStatus)
			builder.append(" ORDER BY applicationStatus ");

		else if (criteria.getSortBy() == VehicleTripSearchCriteria.SortBy.vehicle)
			builder.append(" ORDER BY vehicle_id ");

		else if (criteria.getSortBy() == VehicleTripSearchCriteria.SortBy.createdTime)
			builder.append(" ORDER BY createdtime ");

		if (criteria.getSortOrder() == VehicleTripSearchCriteria.SortOrder.ASC)
			builder.append(" ASC ");
		else
			builder.append(" DESC ");

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

	public String getTripIdFromReferenceNosQuery(List<String> refernceNos) {
		return String.format(QUERY_TRIP_FROM_REF, convertListToString(refernceNos));
	}

	public String getTripDetailSarchQuery(String tripId, List<Object> preparedStmtList) {
		preparedStmtList.add(tripId);
		return QUERY_TRIP_DTL;
	}

	public String getvehicleTripLikeQuery(VehicleTripSearchCriteria criteria, List<Object> preparedStmtList) {

		StringBuilder builder = new StringBuilder(QUERY_SEARCH_VEHICLE_LOG);

		List<String> ids = criteria.getIds();
		if (!CollectionUtils.isEmpty(ids)) {
			if (criteria.getTenantId() != null) {
				if (criteria.getTenantId().split("\\.").length == 1) {

					preparedStmtList.add('%' + criteria.getTenantId() + '%');
				} else {

					preparedStmtList.add(criteria.getTenantId());
				}
			}
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(" id IN (").append(createQuery(ids)).append(")");
			addToPreparedStatement(preparedStmtList, ids);
		}

		return addPaginationClause(builder, preparedStmtList, criteria);
	}

	private String addPaginationClause(StringBuilder builder, List<Object> preparedStmtList,
			VehicleTripSearchCriteria criteria) {

		if (criteria.getLimit() != null && criteria.getLimit() != 0) {
			builder.append(
					"and vehicletrip.id in (select id from eg_vehicle_trip where tenantid like ? order by id offset ? limit ?)");
			if (criteria.getTenantId() != null) {
				if (criteria.getTenantId().split("\\.").length == 1) {

					preparedStmtList.add('%' + criteria.getTenantId() + '%');
				} else {

					preparedStmtList.add(criteria.getTenantId());
				}
			}
			preparedStmtList.add(criteria.getOffset());
			preparedStmtList.add(criteria.getLimit());

			addOrderByClause(builder, criteria);

		} else {
			addOrderByClause(builder, criteria);
		}
		return builder.toString();
	}

	private void addClauseIfRequired(List<Object> values, StringBuilder queryString) {
		if (values.isEmpty())
			queryString.append(" WHERE ");
		else {
			queryString.append(" AND");
		}
	}

}
