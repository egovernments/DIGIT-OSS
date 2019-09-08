package org.egov.search.repository;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.egov.search.model.Definition;
import org.egov.search.model.SearchRequest;
import org.egov.search.utils.SearchUtils;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;



@Repository
public class SearchRepository {
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Value("${max.sql.execution.time.millisec:45000}")
	private Long maxExecutionTime;
	
	@Autowired
	private SearchUtils searchUtils;
	
	public static final Logger LOGGER = LoggerFactory.getLogger(SearchRepository.class);
		
	public List<String> searchData(SearchRequest searchRequest, Definition definition) {
		List<String> result = new ArrayList<>();
		String query = null;
		try{
			query = searchUtils.buildQuery(searchRequest, definition.getSearchParams(), definition.getQuery());
		}catch(CustomException e){
			throw e;
		}
		Long startTime = new Date().getTime();
		List<PGobject> maps = jdbcTemplate.queryForList(query,PGobject.class);
		Long endTime = new Date().getTime();
		Long totalExecutionTime = endTime - startTime;
		LOGGER.info("Query execution time in millisec: "+totalExecutionTime);
		if((endTime - startTime) > maxExecutionTime){
			LOGGER.error("Json query is taking unusually more time, query: "+query);
			throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.toString(), 
					"Query Execution Timeout! Json query is taking more time than the max exec time, query: "+query);
		}
		result = searchUtils.convertPGOBjects(maps);
		return result;
	}

}
