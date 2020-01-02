package org.egov.pt.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.repository.builder.PropertyQueryBuilder;
import org.egov.pt.repository.rowmapper.PropertyRowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class PropertyRepository {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private PropertyQueryBuilder queryBuilder;

	@Autowired
	private PropertyRowMapper rowMapper;

	public List<Property> getProperties(PropertyCriteria criteria) {

		List<Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getPropertySearchQuery(criteria, preparedStmtList);
		return jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
	}

	public List<String> getPropertyIds(Set<String> ownerIds) {

		List<Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getPropertyIdsQuery(ownerIds, preparedStmtList);
		return jdbcTemplate.queryForList(query, preparedStmtList.toArray(), String.class);
	}

/*	public List<Property> getPropertiesPlainSearch(PropertyCriteria criteria) {
		
		List<Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getPropertyLikeQuery(criteria, preparedStmtList);
		log.info("Query: " + query);
		log.info("PS: " + preparedStmtList);
		return jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
	}*/
}
