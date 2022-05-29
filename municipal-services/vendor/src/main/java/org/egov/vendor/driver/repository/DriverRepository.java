package org.egov.vendor.driver.repository;

import org.egov.vendor.config.VendorConfiguration;
import org.egov.vendor.driver.repository.querybuilder.DriverQueryBuilder;
import org.egov.vendor.driver.repository.rowmapper.DriverRowMapper;
import org.egov.vendor.driver.web.model.DriverRequest;
import org.egov.vendor.producer.Producer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
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
	private DriverRowMapper driverrowMapper;

	public void save(DriverRequest driverRequest) {
		producer.push(configuration.getSaveTopic(), driverRequest);
	}
	
	public void update(DriverRequest driverRequest) {
		producer.push(configuration.getUpdateTopic(), driverRequest);
	}
}
