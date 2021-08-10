package org.egov.vehicle.repository;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.tracer.model.CustomException;
import org.egov.vehicle.config.VehicleConfiguration;
import org.egov.vehicle.producer.VehicleProducer;
import org.egov.vehicle.repository.querybuilder.QueryBuilder;
import org.egov.vehicle.repository.rowmapper.RowMapper;
import org.egov.vehicle.web.model.Vehicle;
import org.egov.vehicle.web.model.VehicleRequest;
import org.egov.vehicle.web.model.VehicleResponse;
import org.egov.vehicle.web.model.VehicleSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.stereotype.Repository;

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

        public void save(VehicleRequest vehicleRequest) {
            vehicleProducer.push(config.getSaveTopic(), vehicleRequest);
        }

		public VehicleResponse getVehicleData(@Valid VehicleSearchCriteria criteria) {
			
			List<Object> preparedStmtList = new ArrayList<>();
			String query = queryBuilder.getSearchQuery(criteria, preparedStmtList);
			List<Vehicle> vehicles = jdbcTemplate.query(query, preparedStmtList.toArray(),rowMapper );
			VehicleResponse response = VehicleResponse.builder().vehicle(vehicles).totalCount(Integer.valueOf(rowMapper.getFullCount())).build();
			return response;
		}

		public Integer getVehicleCount(VehicleRequest vehicleRequest) {
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

		public List<Vehicle> getVehiclePlainSearch(VehicleSearchCriteria criteria) {
			if(criteria.getIds() == null || criteria.getIds().isEmpty())
				throw new CustomException("PLAIN_SEARCH_ERROR", "Search only allowed by ids!");

			List<Object> preparedStmtList = new ArrayList<>();
			String query = queryBuilder.getVehicleLikeQuery(criteria, preparedStmtList);
			log.info("Query: "+query);
			log.info("PS: "+preparedStmtList);
			return jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
		}



}
