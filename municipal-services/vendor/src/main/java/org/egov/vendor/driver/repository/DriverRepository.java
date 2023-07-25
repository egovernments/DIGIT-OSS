package org.egov.vendor.driver.repository;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.vendor.config.VendorConfiguration;
import org.egov.vendor.driver.repository.querybuilder.DriverQueryBuilder;
import org.egov.vendor.driver.repository.rowmapper.DriverRowMapper;
import org.egov.vendor.driver.web.model.Driver;
import org.egov.vendor.driver.web.model.DriverRequest;
import org.egov.vendor.driver.web.model.DriverResponse;
import org.egov.vendor.driver.web.model.DriverSearchCriteria;
import org.egov.vendor.producer.Producer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.stereotype.Repository;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class DriverRepository {

	@Autowired
	private Producer producer;

	@Autowired
	private VendorConfiguration configuration;

	@Autowired
	private DriverQueryBuilder driverQueryBuilder;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private DriverRowMapper driverRowMapper;

	public void save(DriverRequest driverRequest) {
		producer.push(configuration.getSaveDriverTopic(), driverRequest);
	}

	public void update(DriverRequest driverRequest) {
		producer.push(configuration.getUpdateDriverTopic(), driverRequest);
	}

	public DriverResponse getDriverData(DriverSearchCriteria driverSearchCriteria) {
		List<Object> preparedStmtList = new ArrayList<>();
		String query = driverQueryBuilder.getDriverSearchQuery(driverSearchCriteria, preparedStmtList);
		List<Driver> driverData = jdbcTemplate.query(query, preparedStmtList.toArray(), driverRowMapper);
		DriverResponse response = DriverResponse.builder().driver(driverData)
				.totalCount(Integer.valueOf(driverRowMapper.getFullCount())).build();

		System.out.println("query is " + query);
		return response;
	}
	public List<String> fetchDriverIdsWithNoVendor(@Valid DriverSearchCriteria criteria) {
		List<Object> preparedStmtList = new ArrayList<>();
		String query = driverQueryBuilder.getDriverIdsWithNoVendorQuery(criteria, preparedStmtList);
		List<String> ids = jdbcTemplate.query(query,preparedStmtList.toArray(),	new SingleColumnRowMapper<>(String.class));
		return ids;
	}

}