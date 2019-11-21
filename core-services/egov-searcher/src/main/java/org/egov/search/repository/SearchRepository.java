package org.egov.search.repository;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.search.model.Definition;
import org.egov.search.model.SearchRequest;
import org.egov.search.utils.SearchUtils;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
			
	public List<String> fetchData(SearchRequest searchRequest, Definition definition) {
        Map<String, Object> preparedStatementValues = new HashMap<>();
        String query = searchUtils.buildQuery(searchRequest, definition.getSearchParams(), definition.getQuery(), preparedStatementValues);
		List<PGobject> maps = namedParameterJdbcTemplate.queryForList(query, preparedStatementValues, PGobject.class);

		return searchUtils.convertPGOBjects(maps);
	}

}
