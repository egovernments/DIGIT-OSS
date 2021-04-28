package org.egov.vehicle.trip.querybuilder;

import java.util.List;
import java.util.stream.Collectors;

import org.egov.vehicle.config.VehicleConfiguration;
import org.egov.vehicle.trip.web.model.VehicleTripSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

@Component
public class VehicleTripQueryBuilder {

	private static final String QUERY_VEHICLE_LOG_EXIST = "SELECT count(*) FROM eg_vehicle_trip where id =? AND status='ACTIVE'";
	private static final String Query_SEARCH_VEHICLE_LOG = "select count(*) OVER() AS full_count, * from eg_vehicle_trip WHERE tenantid=?";
	private final String paginationWrapper = "{} {orderby}  OFFSET ? LIMIT ?";
	private static final String QUERY_TRIP_FROM_REF= "SELECT trip_id from eg_vehicle_trip_detail WHERE referenceno in ( %s )";
	private static final String QUERY_TRIP_DTL= "SELECT * FROM eg_vehicle_trip_detail WHERE trip_id = ? ";
	

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
		StringBuilder query = new StringBuilder(Query_SEARCH_VEHICLE_LOG);
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
			query.append(" AND applicationstatus IN(").append(createQuery(criteria.getApplicationStatus()))
					.append(")");
			addToPreparedStatement(preparedStmtList, criteria.getApplicationStatus());
		}
		
		return addPaginationWrapper(query.toString(), criteria, preparedStmtList);
	}

	private String addPaginationWrapper(String query, VehicleTripSearchCriteria criteria, List<Object> preparedStmtList) {

		int limit = config.getDefaultLimit();
		int offset = config.getDefaultOffset();
		String finalQuery = paginationWrapper.replace("{}", query);

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
			preparedStmtList.add(limit );
		}

		return finalQuery;

	}
	
	private void addOrderByClause(StringBuilder builder, VehicleTripSearchCriteria criteria){

        if(StringUtils.isEmpty(criteria.getSortBy()))
            builder.append( " ORDER BY lastmodifiedtime ");

        else if(criteria.getSortBy()== VehicleTripSearchCriteria.SortBy.applicationStatus)
            builder.append(" ORDER BY applicationStatus ");


        
        else if(criteria.getSortBy()== VehicleTripSearchCriteria.SortBy.vehicle)
            builder.append(" ORDER BY vehicle_id ");
        
        else if(criteria.getSortBy()== VehicleTripSearchCriteria.SortBy.createdTime)
            builder.append(" ORDER BY createdtime ");

        if(criteria.getSortOrder()== VehicleTripSearchCriteria.SortOrder.ASC)
            builder.append(" ASC ");
        else builder.append(" DESC ");

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
		return String.format(QUERY_TRIP_FROM_REF,convertListToString(refernceNos));
	}



	public String getTripDetailSarchQuery(String tripId, List<Object> preparedStmtList) {
		preparedStmtList.add(tripId);
		return QUERY_TRIP_DTL;
	}

}
