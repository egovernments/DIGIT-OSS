package org.egov.pt.repository;

import java.util.ArrayList;
import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.egov.pt.repository.builder.PropertyQueryBuilder;
import org.egov.pt.repository.rowmapper.PropertyRowMapper;
import org.egov.pt.web.models.Property;
import org.egov.pt.web.models.PropertyCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@Slf4j
public class PropertyRepository {

	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private PropertyQueryBuilder queryBuilder;
	
	@Autowired
	private PropertyRowMapper rowMapper;
	
	public List<Property> getProperties(PropertyCriteria criteria){
		List<Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getPropertySearchQuery(criteria, preparedStmtList);
		return jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
	}
	
	public List<Property> getPropertiesPlainSearch(PropertyCriteria criteria){
		List<Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getPropertyLikeQuery(criteria, preparedStmtList);
		log.info("Query: "+query);
		log.info("PS: "+preparedStmtList);
		return jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
	}
}
