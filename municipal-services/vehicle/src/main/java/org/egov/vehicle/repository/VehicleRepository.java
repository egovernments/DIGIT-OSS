package org.egov.vehicle.repository;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.vehicle.config.VehicleConfiguration;
import org.egov.vehicle.producer.VehicleProducer;
import org.egov.vehicle.repository.querybuilder.QueryBuilder;
import org.egov.vehicle.repository.rowmapper.RowMapper;
import org.egov.vehicle.web.model.Vehicle;
import org.egov.vehicle.web.model.VehicleRequest;
import org.egov.vehicle.web.model.VehicleSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
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

		public List<Vehicle> getVehicleData(@Valid VehicleSearchCriteria criteria) {
			
			List<Object> preparedStmtList = new ArrayList<>();
			String query = queryBuilder.getSearchQuery(criteria, preparedStmtList);
			List<Vehicle> vehicles = jdbcTemplate.query(query, preparedStmtList.toArray(),rowMapper );
			
			return vehicles;
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



}
