package org.egov.search.repository;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.custom.mapper.billing.impl.Bill;
import org.egov.custom.mapper.billing.impl.BillRowMapper;
import org.egov.search.model.Definition;
import org.egov.search.model.SearchRequest;
import org.egov.search.utils.SearchUtils;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.extern.slf4j.Slf4j;



@Repository
@Slf4j
public class SearchRepository {
		
    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	
	@Value("${max.sql.execution.time.millisec:45000}")
	private Long maxExecutionTime;
	
	@Autowired
	private SearchUtils searchUtils;
	
	@Autowired
	public static ResourceLoader resourceLoader;

	@Autowired
	private BillRowMapper rowMapper;
			
	public List<String> fetchData(SearchRequest searchRequest, Definition definition) {
        Map<String, Object> preparedStatementValues = new HashMap<>();
        String query = searchUtils.buildQuery(searchRequest, definition.getSearchParams(), definition.getQuery(), preparedStatementValues);
		log.info("Final Query: " + query);
		//log.debug("preparedStatementValues: " + preparedStatementValues);
		List<PGobject> maps = namedParameterJdbcTemplate.queryForList(query, preparedStatementValues, PGobject.class);

		return searchUtils.convertPGOBjects(maps);
	}
	
	public Object fetchWithCustomMapper(SearchRequest searchRequest, Definition searchDefinition) {
        Map<String, Object> preparedStatementValues = new HashMap<>();
		String query = searchUtils.buildQuery(searchRequest, searchDefinition.getSearchParams(), searchDefinition.getQuery(), preparedStatementValues);
		try {
			log.info("Final Query: " + query);
			//log.debug("preparedStatementValues: " + preparedStatementValues);
			List<Bill> result = namedParameterJdbcTemplate.query(query, preparedStatementValues, rowMapper);
			return result;
		} catch (CustomException e) {
			throw e;
		}
	}

}
