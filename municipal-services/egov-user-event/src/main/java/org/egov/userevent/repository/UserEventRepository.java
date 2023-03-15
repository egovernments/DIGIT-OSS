package org.egov.userevent.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.userevent.repository.querybuilder.UserEventsQueryBuilder;
import org.egov.userevent.repository.rowmappers.UserEventRowMapper;
import org.egov.userevent.repository.rowmappers.NotificationCountRowMapper;
import org.egov.userevent.web.contract.Event;
import org.egov.userevent.web.contract.EventSearchCriteria;
import org.egov.userevent.web.contract.NotificationCountResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class UserEventRepository {
	
	@Autowired
	private UserEventsQueryBuilder queryBuilder;
	
	@Autowired
	private UserEventRowMapper rowMapper;
	
	@Autowired
	private NotificationCountRowMapper countRowMapper;
	
    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	
	/**
	 * Repository method to fetch events
	 * 
	 * @param criteria
	 * @return
	 */
	public List<Event> fetchEvents(EventSearchCriteria criteria){
		Map<String, Object> preparedStatementValues = new HashMap<>();
		String query = queryBuilder.getSearchQuery(criteria, preparedStatementValues);
		log.info("Query: "+query);
		log.info("Search preparedStatementValues: "+preparedStatementValues.toString());
		List<Event> events = new ArrayList<>();
		try {
			events = namedParameterJdbcTemplate.query(query, preparedStatementValues, rowMapper);
		}catch(Exception e) {
			log.error("Error while fetching results from db: ", e);
		}
		
		return events;
	}
	
	/**
	 * Repository method to fetch count of events
	 * 
	 * @param criteria
	 * @return
	 */
	public NotificationCountResponse fetchCount(EventSearchCriteria criteria){
		Map<String, Object> preparedStatementValues = new HashMap<>();
		String insertQuery = queryBuilder.getInserIfNotExistsQuery(criteria, preparedStatementValues);
		String query = queryBuilder.getCountQuery(criteria, preparedStatementValues);
		log.info("Query: "+query);
		log.info("Notification count preparedStatementValues: "+preparedStatementValues.toString());
		NotificationCountResponse response = null;
		try {
			namedParameterJdbcTemplate.update(insertQuery, preparedStatementValues);
			response = namedParameterJdbcTemplate.query(query, preparedStatementValues, countRowMapper);
		}catch(Exception e) {
			log.error("Error while fetching count from db: ", e);
		}
		return response;
	}


	public Integer fetchTotalEventCount(EventSearchCriteria criteria) {
		Map<String, Object> preparedStatementValues = new HashMap<>();
		criteria.setIsEventsCountCall(Boolean.TRUE);
		String query = queryBuilder.getSearchQuery(criteria, preparedStatementValues);
		query = queryBuilder.addCountWrapper(query);
		criteria.setIsEventsCountCall(Boolean.FALSE);
		log.info("Count Query: " + query);
		log.info("Count preparedStatementValues: "+preparedStatementValues.toString());
		Integer totalCount = 0;
		try {
			totalCount = namedParameterJdbcTemplate.queryForObject(query, preparedStatementValues, Integer.class);
		}catch(Exception e) {
			log.error("Error while fetching total event count from db: ", e);
		}

		return totalCount;
	}
}
