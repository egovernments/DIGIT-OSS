package org.egov.pt.repository;

import lombok.extern.slf4j.Slf4j;
import org.egov.pt.repository.builder.PropertyQueryBuilder;
import org.egov.pt.repository.rowmapper.PropertyRowMapper;
import org.egov.pt.web.models.Property;
import org.egov.pt.web.models.PropertyCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

	public Set<String> fetchPropertyIds(PropertyCriteria criteria){

		List<Object> preparedStmtList = new ArrayList<>();
		preparedStmtList.add(criteria.getOffset());
		preparedStmtList.add(criteria.getLimit());

		List<String> ids = jdbcTemplate.query("SELECT propertyid from eg_pt_property_v2 ORDER BY createdtime offset " +
						" ? " +
						"limit ? ",
				preparedStmtList.toArray(),
				new SingleColumnRowMapper<>(String.class));
		return new HashSet<>(ids);
	}
	
	public List<Property> getPropertiesPlainSearch(PropertyCriteria criteria){
		if(criteria.getIds() == null || criteria.getIds().isEmpty())
			throw new CustomException("PLAIN_SEARCH_ERROR", "Search only allowed by ids!");

		List<Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getPropertyLikeQuery(criteria, preparedStmtList);
		log.info("Query: "+query);
		log.info("PS: "+preparedStmtList);
		return jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
	}
}
