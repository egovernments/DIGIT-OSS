package org.egov.fsm.calculator.repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.egov.fsm.calculator.config.BillingSlabConfig;
import org.egov.fsm.calculator.kafka.broker.BillingSlabProducer;
import org.egov.fsm.calculator.repository.querybuilder.BillingSlabQueryBuilder;
import org.egov.fsm.calculator.repository.rowmapper.BillingSlabRowMapper;
import org.egov.fsm.calculator.utils.CalculatorConstants;
import org.egov.fsm.calculator.web.models.BillingSlab;
import org.egov.fsm.calculator.web.models.BillingSlabRequest;
import org.egov.fsm.calculator.web.models.BillingSlabSearchCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class BillingSlabRepository {

	@Autowired
	private BillingSlabConfig config;

	@Autowired
	private BillingSlabProducer producer;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private BillingSlabQueryBuilder queryBuilder;
	
	@Autowired
	private BillingSlabRowMapper mapper;
	

	public void save(BillingSlabRequest request) {
		producer.push(config.getSaveBillingSlabTopic(), request);
	}
	
	public void update(BillingSlabRequest request) {
		producer.push(config.getUpdateBillingSlabTopic(), request);
	}

	public Integer getDataCount(String query, List<Object> preparedStmtList) {
		Integer count = null;
		try {
			count = jdbcTemplate.queryForObject(query, preparedStmtList.toArray(), Integer.class);
		} catch (Exception e) {
			throw new CustomException(CalculatorConstants.INVALID_BILLING_SLAB_ERROR,"Invalid Billing Slab");
		}
		return count;
	}
	
	public BigDecimal getBillingSlabPrice(String query, List<Object> preparedStmtList) {
		BigDecimal billingSlabPrice = null;
		try {
			billingSlabPrice = jdbcTemplate.queryForObject(query, preparedStmtList.toArray(),  BigDecimal.class);
		} catch (Exception e) {
			if(!e.getMessage().equalsIgnoreCase("Incorrect result size: expected 1, actual 0")) {
				throw new CustomException(CalculatorConstants.INVALID_BILLING_SLAB_ERROR,"Invalid Billing Slab Price");
			}
		}
		return billingSlabPrice;
	}
	
	public List<BillingSlab> getBillingSlabData(BillingSlabSearchCriteria criteria) {
		List<BillingSlab> billingSlabList = null;
		List<Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getBillingSlabSearchQuery(criteria, preparedStmtList);
		try {
			billingSlabList = jdbcTemplate.query(query, preparedStmtList.toArray(), mapper);
		} catch (Exception e) {
			throw new CustomException(CalculatorConstants.INVALID_BILLING_SLAB_ERROR,"Invalid Billing Slab Data");
		}
		return billingSlabList;
	}
	
}
