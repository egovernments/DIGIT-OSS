package org.egov.pt.calculator.repository;

import java.util.ArrayList;
import java.util.List;

import org.egov.pt.calculator.repository.rowmapper.BillingSlabRowMapper;
import org.egov.pt.calculator.web.models.BillingSlab;
import org.egov.pt.calculator.web.models.BillingSlabSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class PTCalculatorDBRepository {
	
	@Autowired
	private BillingSlabQueryBuilder billingSlabQueryBuilder;
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private BillingSlabRowMapper billingSlabRowMapper;
	
	public List<BillingSlab> searchBillingSlab(BillingSlabSearchCriteria billingSlabSearcCriteria) {
		
		List<Object> preparedStmtList = new ArrayList<>();
		String query = billingSlabQueryBuilder.getBillingSlabSearchQuery(billingSlabSearcCriteria, preparedStmtList);
		log.debug("Query: "+query);
		return jdbcTemplate.query(query, preparedStmtList.toArray(), billingSlabRowMapper);
	}

}
