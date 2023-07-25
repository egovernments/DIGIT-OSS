package org.egov.fsm.plantmapping.repository;

import java.util.ArrayList;
import java.util.List;

import org.egov.fsm.plantmapping.config.PlantMappingConfiguration;
import org.egov.fsm.plantmapping.querybuilder.PlantMappingQueryBuilder;
import org.egov.fsm.plantmapping.rowmapper.PlantMappingRowMapper;
import org.egov.fsm.plantmapping.web.model.PlantMapping;
import org.egov.fsm.plantmapping.web.model.PlantMappingRequest;
import org.egov.fsm.plantmapping.web.model.PlantMappingResponse;
import org.egov.fsm.plantmapping.web.model.PlantMappingSearchCriteria;
import org.egov.fsm.producer.Producer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class PlantMappingRepository {


	@Autowired
	private Producer producer;
	
	@Autowired
	private PlantMappingConfiguration config;
	
	@Autowired
	private PlantMappingQueryBuilder queryBuilder;

	@Autowired
	private PlantMappingRowMapper rowMapper;

	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	
	
	public void save(PlantMappingRequest request) {
		producer.push(config.getSaveTopic(), request);
	}

	public PlantMappingResponse getPlantMappingData(PlantMappingSearchCriteria criteria) {
		List<Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getPlantMapSearchQuery(criteria, preparedStmtList);
		List<PlantMapping> plantmaps = jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
		PlantMappingResponse plantMapResponse = PlantMappingResponse.builder().plantMapping(plantmaps).build();
		return plantMapResponse;
	}

	public void update(PlantMappingRequest request) {
		producer.push(config.getUpdateTopic(), request);
	}
}
