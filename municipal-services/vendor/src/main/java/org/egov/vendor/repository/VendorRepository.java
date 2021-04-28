package org.egov.vendor.repository;

import java.util.ArrayList;
import java.util.List;

import org.egov.vendor.config.VendorConfiguration;
import org.egov.vendor.producer.Producer;
import org.egov.vendor.repository.querybuilder.VendorQueryBuilder;
import org.egov.vendor.repository.rowmapper.VendorRowMapper;
import org.egov.vendor.web.model.Vendor;
import org.egov.vendor.web.model.VendorRequest;
import org.egov.vendor.web.model.VendorSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class VendorRepository {

	@Autowired
	private Producer producer;

	@Autowired
	private VendorConfiguration configuration;

	@Autowired
	private VendorQueryBuilder vendorQueryBuilder;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private VendorRowMapper vendorrowMapper;

	public void save(VendorRequest vendorRequest) {
		producer.push(configuration.getSaveTopic(), vendorRequest);
	}

	public List<Vendor> getVendorData(VendorSearchCriteria vendorSearchCriteria) {
		List<Object> preparedStmtList = new ArrayList<>();
		String query = vendorQueryBuilder.getVendorSearchQuery(vendorSearchCriteria, preparedStmtList);
		List<Vendor> vendorData = jdbcTemplate.query(query, preparedStmtList.toArray(), vendorrowMapper);
		System.out.println("query is " + query);
		return vendorData;
	}

	public List<String> getDrivers(String id) {
		List<String> ids = null;
		List<Object> preparedStmtList = new ArrayList<>();
		preparedStmtList.add(id);
		ids = jdbcTemplate.queryForList(vendorQueryBuilder.getDriverSearchQuery(), preparedStmtList.toArray(), String.class);
		return ids;
	}

	public List<String> getVehicles(String id) {
		List<String> ids = null;
		List<Object> preparedStmtList = new ArrayList<>();
		preparedStmtList.add(id);
		ids = jdbcTemplate.queryForList(vendorQueryBuilder.getVehicleSearchQuery(), preparedStmtList.toArray(), String.class);
		return ids;
	}
	
	public List<String> getVendorWithVehicles(List<String> vehicleIds){
		List<String> vendorIds = null;
		List<Object> preparedStmtList = new ArrayList<>();
		vendorIds = jdbcTemplate.queryForList(vendorQueryBuilder.vendorsForVehicles(vehicleIds, preparedStmtList), preparedStmtList.toArray(), String.class);		
		return vendorIds;		
	}

}
