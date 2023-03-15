package org.egov.vehicle.trip.repository;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.vehicle.config.VehicleConfiguration;
import org.egov.vehicle.producer.VehicleProducer;
import org.egov.vehicle.trip.querybuilder.VehicleTripQueryBuilder;
import org.egov.vehicle.trip.repository.rowmapper.TripDetailRowMapper;
import org.egov.vehicle.trip.repository.rowmapper.VehicleTripRowMapper;
import org.egov.vehicle.trip.web.model.VehicleTrip;
import org.egov.vehicle.trip.web.model.VehicleTripDetail;
import org.egov.vehicle.trip.web.model.VehicleTripRequest;
import org.egov.vehicle.trip.web.model.VehicleTripResponse;
import org.egov.vehicle.trip.web.model.VehicleTripSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.stereotype.Repository;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class VehicleTripRepository {

	@Autowired
	private VehicleProducer producer;

	@Autowired
	private VehicleConfiguration config;

	@Autowired
	private JdbcTemplate jdbcTemplate;
	@Autowired
	private VehicleTripRowMapper mapper;

	@Autowired
	private TripDetailRowMapper detailMapper;

	@Autowired
	private VehicleTripQueryBuilder queryBuilder;

	public void save(VehicleTripRequest request) {
		producer.push(config.getSaveVehicleLogTopic(), request);
	}

	public void update(RequestInfo requestInfo, VehicleTrip trip, boolean isStateUpdatable) {
		List<VehicleTrip> tripForStatusUpdate = new ArrayList<>();
		List<VehicleTrip> tripForUpdate = new ArrayList<>();

		if (isStateUpdatable) {
			tripForUpdate.add(trip);
		} else {
			tripForStatusUpdate.add(trip);
		}
		if (tripForUpdate != null) {
			producer.push(config.getUpdateVehicleLogTopic(), new VehicleTripRequest(requestInfo, tripForUpdate, null));
		}

		if (tripForStatusUpdate != null)
			producer.push(config.getUpdateWorkflowVehicleLogTopic(),
					new VehicleTripRequest(requestInfo, tripForStatusUpdate, null));
	}

	public Integer getDataCount(String query, List<Object> preparedStmtList) {
		Integer count = null;
		try {
			count = jdbcTemplate.queryForObject(query, preparedStmtList.toArray(), Integer.class);
		} catch (Exception e) {
			throw new CustomException("INVALID_DATA", "INVALID_DATA");
		}
		return count;
	}

	public VehicleTripResponse getVehicleLogData(VehicleTripSearchCriteria criteria) {
		List<VehicleTrip> vehicleTrips = null;
		List<Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getVehicleLogSearchQuery(criteria, preparedStmtList);
		vehicleTrips = jdbcTemplate.query(query, preparedStmtList.toArray(), mapper);
		return VehicleTripResponse.builder().vehicleTrip(vehicleTrips)
				.totalCount(Integer.valueOf(mapper.getFullCount())).build();
	}

	public List<VehicleTripDetail> getTrpiDetails(String tripId) {
		List<VehicleTripDetail> tripDetails = null;
		List<Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getTripDetailSarchQuery(tripId, preparedStmtList);
		try {
			tripDetails = jdbcTemplate.query(query, preparedStmtList.toArray(), detailMapper);
		} catch (Exception e) {
			throw new CustomException("INVALID_VEHICLE_TRIP_DETAILS", "INVALID_VEHICLE_TRIP_DETAILS");
		}

		return tripDetails;
	}

	public List<String> getTripFromRefrences(List<String> refernceNos) {

		List<String> ids = null;
		String query = queryBuilder.getTripIdFromReferenceNosQuery(refernceNos);
		try {
			ids = jdbcTemplate.queryForList(query, String.class);
		} catch (Exception e) {
			throw new CustomException("INVALID_TRIP_FROM_REFERENCES", "INVALID_TRIP_FROM_REFERENCES");
		}

		return ids;
	}

	public List<String> fetchVehicleTripIds(@Valid VehicleTripSearchCriteria criteria) {

		List<Object> preparedStmtList = new ArrayList<>();
		preparedStmtList.add(criteria.getOffset());
		preparedStmtList.add(criteria.getLimit());
		return jdbcTemplate.query("SELECT id from eg_vehicle_trip ORDER BY createdtime offset " + " ? " + "limit ? ",
				preparedStmtList.toArray(), new SingleColumnRowMapper<>(String.class));
	}

	public List<VehicleTrip> getVehicleTripPlainSearch(VehicleTripSearchCriteria criteria) {
		if (criteria.getIds() == null || criteria.getIds().isEmpty())
			throw new CustomException("PLAIN_SEARCH_ERROR", "Search only allowed by ids!");

		List<Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getvehicleTripLikeQuery(criteria, preparedStmtList);
		log.info("Query: " + query);
		log.info("PS: " + preparedStmtList);
		return jdbcTemplate.query(query, preparedStmtList.toArray(), mapper);
	}

}
