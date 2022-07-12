package org.egov.vehicle.repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.egov.tracer.model.CustomException;
import org.egov.vehicle.config.VehicleConfiguration;
import org.egov.vehicle.producer.VehicleProducer;
import org.egov.vehicle.repository.querybuilder.QueryBuilder;
import org.egov.vehicle.repository.rowmapper.RowMapper;
import org.egov.vehicle.trip.repository.rowmapper.TripDetailRowMapper;
import org.egov.vehicle.trip.web.model.VehicleTripDetail;
import org.egov.vehicle.trip.web.model.VehicleTripSearchCriteria;
import org.egov.vehicle.util.ErrorConstants;
import org.egov.vehicle.web.model.Vehicle;
import org.egov.vehicle.web.model.VehicleRequest;
import org.egov.vehicle.web.model.VehicleResponse;
import org.egov.vehicle.web.model.VehicleSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class VehicleRepository {

        @Autowired
        private VehicleConfiguration config;

        @Autowired
        private VehicleProducer vehicleProducer;
        
        @Autowired
        private QueryBuilder queryBuilder;
        
        @Autowired
    		private JdbcTemplate jdbcTemplate;
        
        @Autowired
        private RowMapper rowMapper;
        
        @Autowired
        private TripDetailRowMapper vehicleTripMapper;
        
        private static final String Query_SEARCH_VEHICLE_LOG = " SELECT applicationstatus,count(applicationstatus) FROM eg_vehicle_trip ";

    	private static final String QUERY_VEHICLE_TRIP_DETAIL = "SELECT id,tenantid,trip_id,referenceno,referencestatus,additionaldetails,status,itemstarttime, "
    			+ "itemendtime, volume from eg_vehicle_trip_detail ";

        public void save(VehicleRequest vehicleRequest) {
            vehicleProducer.push(config.getSaveTopic(), vehicleRequest);
        }
        
        public void update(VehicleRequest vehicleRequest) {
            vehicleProducer.push(config.getUpdateTopic(), vehicleRequest);
        }
        
		public VehicleResponse getVehicleData(@Valid VehicleSearchCriteria criteria) {
			
			List<Object> preparedStmtList = new ArrayList<>();
			String query = queryBuilder.getSearchQuery(criteria, preparedStmtList);
			List<Vehicle> vehicles = jdbcTemplate.query(query, preparedStmtList.toArray(),rowMapper );
			VehicleResponse response = VehicleResponse.builder().vehicle(vehicles).totalCount(Integer.valueOf(rowMapper.getFullCount())).build();
			return response;
		}

		public Integer getVehicleCount(VehicleRequest vehicleRequest, String status) {
			List<Object> preparedStmtList = new ArrayList<>();
			String query = queryBuilder.vehicleExistsQuery(vehicleRequest, preparedStmtList);
			Integer count = null;
			try {
				count = jdbcTemplate.queryForObject(query, preparedStmtList.toArray(), Integer.class);
			} catch (Exception e) {
				throw e;
			}
			return count;
		}

		public List<String> fetchVehicleIds(@Valid VehicleSearchCriteria criteria) {

			List<Object> preparedStmtList = new ArrayList<>();
			preparedStmtList.add(criteria.getOffset());
			preparedStmtList.add(criteria.getLimit());

			List<String> ids = jdbcTemplate.query("SELECT id from eg_vehicle ORDER BY createdtime offset " +
							" ? " +
							"limit ? ",
					preparedStmtList.toArray(),
					new SingleColumnRowMapper<>(String.class));
			return ids;
		}
		
		public List<String> fetchVehicleIdsWithNoVendor(@Valid VehicleSearchCriteria criteria) {

			List<Object> preparedStmtList = new ArrayList<>();
			String query = queryBuilder.getVehicleIdsWithNoVendorQuery(criteria, preparedStmtList);
			List<String> ids = jdbcTemplate.query(query,preparedStmtList.toArray(),	new SingleColumnRowMapper<>(String.class));
			return ids;
		}

		public List<Vehicle> getVehiclePlainSearch(VehicleSearchCriteria criteria) {
			if(criteria.getIds() == null || criteria.getIds().isEmpty())
				throw new CustomException("PLAIN_SEARCH_ERROR", "Search only allowed by ids!");

			List<Object> preparedStmtList = new ArrayList<>();
			String query = queryBuilder.getVehicleLikeQuery(criteria, preparedStmtList);
			log.info("Query: "+query);
			log.info("PS: "+preparedStmtList);
			return jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
		}
		
		public List<Map<String, Object>> fetchStatusCount(VehicleSearchCriteria criteria) {
    		List<Object> preparedStmtList = new ArrayList<>();
    		String query = getSearchQuery(criteria, preparedStmtList);
    		return jdbcTemplate.queryForList(query, preparedStmtList.toArray());
    	}

		public List<VehicleTripDetail> fetchVehicleTripDetailsByReferenceNo(VehicleTripSearchCriteria vehicleTripSearchCriteria) {
			StringBuilder builder = new StringBuilder(QUERY_VEHICLE_TRIP_DETAIL);
			List<Object> preparedStmtList = new ArrayList<>();
			if (!CollectionUtils.isEmpty(vehicleTripSearchCriteria.getRefernceNos())) {
				addClauseIfRequired(preparedStmtList, builder);
				builder.append(" referenceno IN (").append(createQuery(vehicleTripSearchCriteria.getRefernceNos())).append(")");
				addToPreparedStatement(preparedStmtList, vehicleTripSearchCriteria.getRefernceNos());
			}
			List<VehicleTripDetail> vehicleTrips = new ArrayList();
			try {
				vehicleTrips = jdbcTemplate.query(builder.toString(), preparedStmtList.toArray(), vehicleTripMapper);
			} catch (IllegalArgumentException e) {
				throw new CustomException(ErrorConstants.PARSING_ERROR, "Failed to parse response of VehicleTripIntance");
			}
			return vehicleTrips;
		}
		

		private String getSearchQuery(VehicleSearchCriteria criteria, List<Object> preparedStmtList) {
			StringBuilder builder = new StringBuilder(Query_SEARCH_VEHICLE_LOG);

			if (criteria.getTenantId() != null) {
				if (criteria.getTenantId().split("\\.").length == 1) {
					addClauseIfRequired(preparedStmtList, builder);
					builder.append(" tenantid like ?");
					preparedStmtList.add('%' + criteria.getTenantId() + '%');
				} else {
					addClauseIfRequired(preparedStmtList, builder);
					builder.append(" tenantid=? ");
					preparedStmtList.add(criteria.getTenantId());
				}
			}

			List<String> appStates = criteria.getApplicationStatus();

			if (!CollectionUtils.isEmpty(appStates)) {
				addClauseIfRequired(preparedStmtList, builder);
				builder.append(" applicationstatus IN (").append(createQuery(appStates)).append(")");
				addToPreparedStatement(preparedStmtList, appStates);
			}

			builder.append(" group by applicationstatus ");

			return builder.toString();

		}
		
		private void addToPreparedStatement(List<Object> preparedStmtList, List<String> ids) {
			ids.forEach(id -> {
				preparedStmtList.add(id);
			});

		}
		
		private String addPaginationClause(StringBuilder builder, List<Object> preparedStmtList,
				VehicleTripSearchCriteria criteria) {
      
			log.info("criteria.getLimit() :::: " + criteria.getLimit());

			
			if (criteria.getLimit()!=null && criteria.getLimit() != 0) {
				builder.append(" order by fsm.applicationno offset ? limit ?");
				preparedStmtList.add(criteria.getOffset());
				preparedStmtList.add(criteria.getLimit());
			}
			
			log.info("preparedStmtList :::: " + preparedStmtList);
			log.info("preparedStmtList size :::: " + preparedStmtList.size());

			
			return builder.toString();
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

		private void addClauseIfRequired(List<Object> values, StringBuilder queryString) {
			if (values.isEmpty())
				queryString.append(" WHERE ");
			else {
				queryString.append(" AND");
			}
		}
}