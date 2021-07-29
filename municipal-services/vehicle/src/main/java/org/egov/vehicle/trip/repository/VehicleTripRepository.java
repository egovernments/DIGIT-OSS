package org.egov.vehicle.trip.repository;

import java.util.ArrayList;
import java.util.List;

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
import org.springframework.stereotype.Repository;

@Repository
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
	
	public void update(VehicleTripRequest request, boolean isStateUpdatable) {
		RequestInfo requestInfo = request.getRequestInfo();

		VehicleTrip tripForStatusUpdate = null;
		VehicleTrip tripForUpdate = null;

		VehicleTrip trip = request.getVehicleTrip();

		if (isStateUpdatable) {
			tripForUpdate = trip;
		} else {
			tripForStatusUpdate = trip;
		}
		if (tripForUpdate != null)
			producer.push(config.getUpdateVehicleLogTopic(), new VehicleTripRequest(requestInfo, tripForUpdate, null));

		if (tripForStatusUpdate != null)
			producer.push(config.getUpdateWorkflowVehicleLogTopic(), new VehicleTripRequest(requestInfo, tripForStatusUpdate,null));
	}
	
	public Integer getDataCount(String query, List<Object> preparedStmtList) {
		Integer count = null;
		try {
			count = jdbcTemplate.queryForObject(query,preparedStmtList.toArray(), Integer.class);
		} catch (Exception e) {
			throw new CustomException("INVALID_DATA", "INVALID_DATA");
		}
		return count;
	}
	
	public VehicleTripResponse getVehicleLogData(VehicleTripSearchCriteria criteria) {
		List<VehicleTrip> vehicleTrips = null;
		List<Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getVehicleLogSearchQuery(criteria, preparedStmtList);
		vehicleTrips = jdbcTemplate.query(query,preparedStmtList.toArray(), mapper);
		VehicleTripResponse response = VehicleTripResponse.builder().vehicleTrip(vehicleTrips).totalCount(Integer.valueOf(mapper.getFullCount())).build();
		return response;
	}
	
	public List<VehicleTripDetail> getTrpiDetails(String tripId){
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
			ids = jdbcTemplate.queryForList(query,String.class);
		} catch (Exception e) {
			throw new CustomException("INVALID_TRIP_FROM_REFERENCES", "INVALID_TRIP_FROM_REFERENCES");
		}
		
		return ids;
	}

}
