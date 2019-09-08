package org.egov.tlcalculator.repository;

import java.util.ArrayList;
import java.util.List;

import org.egov.tlcalculator.repository.rowmapper.BillingSlabRowMapper;
import org.egov.tlcalculator.web.models.BillingSlab;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class BillingslabRepository {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private BillingSlabRowMapper billingSlabRowMapper;
	
	/**
	 * Queries the db with search query using a connection abstracted within the jdbctemplate.
	 * @param query
	 * @param preparedStmtList
	 * @return List<BillingSlab>
	 */
	public List<BillingSlab> getDataFromDB(String query, List<Object> preparedStmtList){
		List<BillingSlab> slabs = new ArrayList<>();
		try {
			slabs = jdbcTemplate.query(query, preparedStmtList.toArray(), billingSlabRowMapper);
			if(CollectionUtils.isEmpty(slabs))
				return new ArrayList<>();
		}catch(Exception e) {
			log.error("Exception while fetching from DB: " + e);
			return slabs;
		}

		return slabs;
	}

}