package org.egov.vendor.repository;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.tracer.model.CustomException;
import org.egov.vendor.config.VendorConfiguration;
import org.egov.vendor.producer.Producer;
import org.egov.vendor.repository.querybuilder.VendorQueryBuilder;
import org.egov.vendor.repository.rowmapper.VendorRowMapper;
import org.egov.vendor.web.model.Vendor;
import org.egov.vendor.web.model.VendorRequest;
import org.egov.vendor.web.model.VendorResponse;
import org.egov.vendor.web.model.VendorSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.stereotype.Repository;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
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
	
	public void update(VendorRequest vendorRequest) {
		producer.push(configuration.getUpdateTopic(), vendorRequest);
	}


	public void updateVendorVehicleDriver(VendorRequest vendorRequest) {
		producer.push(configuration.getSaveVendorVehicleDriverTopic(), vendorRequest);
	}

	public VendorResponse getVendorData(VendorSearchCriteria vendorSearchCriteria) {
		List<Object> preparedStmtList = new ArrayList<>();
		String query = vendorQueryBuilder.getVendorSearchQuery(vendorSearchCriteria, preparedStmtList);
		List<Vendor> vendorData = jdbcTemplate.query(query, preparedStmtList.toArray(), vendorrowMapper);
		VendorResponse response= VendorResponse.builder().vendor(vendorData).totalCount(Integer.valueOf(vendorrowMapper.getFullCount())).build();
		System.out.println("query is " + query);
		return response;
	}

	public List<String> getDrivers(String id, String status) {
		List<String> ids = null;
		List<Object> preparedStmtList = new ArrayList<>();
		preparedStmtList.add(id);
		preparedStmtList.add(status);
		ids = jdbcTemplate.queryForList(vendorQueryBuilder.getDriverSearchQuery(), preparedStmtList.toArray(),
				String.class);
		return ids;
	}

	public List<String> getVehicles(String id, String status) {
		List<String> ids = null;
		List<Object> preparedStmtList = new ArrayList<>();
		preparedStmtList.add(id);
		preparedStmtList.add(status);
		ids = jdbcTemplate.queryForList(vendorQueryBuilder.getVehicleSearchQuery(), preparedStmtList.toArray(),
				String.class);
		return ids;
	}

	public List<String> getVendorWithVehicles(VendorSearchCriteria vendorSearchCriteria) {
		List<String> vendorIds = null;
		List<Object> preparedStmtList = new ArrayList<>();
		vendorIds = jdbcTemplate.queryForList(vendorQueryBuilder.vendorsForVehicles(vendorSearchCriteria, preparedStmtList),
				preparedStmtList.toArray(), String.class);
		return vendorIds;
	}
	
	public List<String> getVendorWithDrivers(VendorSearchCriteria vendorSearchCriteria) {
		List<String> vendorIds = null;
		List<Object> preparedStmtList = new ArrayList<>();
		vendorIds = jdbcTemplate.queryForList(vendorQueryBuilder.vendorsForDrivers(vendorSearchCriteria, preparedStmtList),
				preparedStmtList.toArray(), String.class);
		return vendorIds;
	}

	public List<String> fetchVendorIds(@Valid VendorSearchCriteria criteria) {
		List<Object> preparedStmtList = new ArrayList<>();
		preparedStmtList.add(criteria.getOffset());
		preparedStmtList.add(criteria.getLimit());

		List<String> ids = jdbcTemplate.query(
				"SELECT id from eg_vendor ORDER BY createdtime offset " + " ? " + "limit ? ",
				preparedStmtList.toArray(), new SingleColumnRowMapper<>(String.class));
		return ids;
	}

	public List<Vendor> getVendorPlainSearch(VendorSearchCriteria criteria) {

		if (criteria.getIds() == null || criteria.getIds().isEmpty())
			throw new CustomException("PLAIN_SEARCH_ERROR", "Search only allowed by ids!");

		List<Object> preparedStmtList = new ArrayList<>();
		String query = vendorQueryBuilder.getVendorLikeQuery(criteria, preparedStmtList);
		log.info("Query: " + query);
		log.info("PS: " + preparedStmtList);
		return jdbcTemplate.query(query, preparedStmtList.toArray(), vendorrowMapper);
	}

	public int getExistingVenodrsCount(List<String> ownerIdList) {
		List<Object> preparedStmtList = new ArrayList<>();

		String query = vendorQueryBuilder.getvendorCount(ownerIdList, preparedStmtList);

		return jdbcTemplate.queryForObject(query, preparedStmtList.toArray(), Integer.class);

	}

}
