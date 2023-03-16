package org.egov.fsm.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.producer.Producer;
import org.egov.fsm.repository.querybuilder.FSMAuditQueryBuilder;
import org.egov.fsm.repository.querybuilder.FSMQueryBuilder;
import org.egov.fsm.repository.rowmapper.FSMAuditRowMapper;
import org.egov.fsm.repository.rowmapper.FSMRowMapper;
import org.egov.fsm.repository.rowmapper.TripDetailRowMapper;
import org.egov.fsm.util.FSMAuditUtil;
import org.egov.fsm.util.FSMConstants;
import org.egov.fsm.web.model.FSM;
import org.egov.fsm.web.model.FSMAuditSearchCriteria;
import org.egov.fsm.web.model.FSMRequest;
import org.egov.fsm.web.model.FSMResponse;
import org.egov.fsm.web.model.FSMSearchCriteria;
import org.egov.fsm.web.model.vehicle.trip.VehicleTrip;
import org.egov.fsm.web.model.vehicle.trip.VehicleTripDetail;
import org.egov.fsm.web.model.vehicle.trip.VehicleTripRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.stereotype.Repository;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class FSMRepository {

	@Autowired
	private FSMConfiguration config;

	@Autowired
	private Producer producer;

	@Autowired
	private FSMQueryBuilder fsmQueryBuilder;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private FSMRowMapper fsmRowMapper;

	@Autowired
	private FSMAuditQueryBuilder auditQueryBuilder;

	@Autowired
	private FSMAuditRowMapper auditRowMapper;

	@Autowired
	private TripDetailRowMapper detailMapper;

	public void save(FSMRequest fsmRequest) {
		producer.push(config.getSaveTopic(), fsmRequest);
	}

	public void update(FSMRequest fsmRequest, boolean isStateUpdatable) {
		RequestInfo requestInfo = fsmRequest.getRequestInfo();

		FSM fsmForStatusUpdate = null;
		FSM fsmForUpdate = null;

		FSM fsm = fsmRequest.getFsm();

		if (isStateUpdatable) {
			fsmForUpdate = fsm;
		} else {
			fsmForStatusUpdate = fsm;
		}
		if (fsmForUpdate != null)
			producer.push(config.getUpdateTopic(), new FSMRequest(requestInfo, fsmForUpdate, fsmRequest.getWorkflow()));

		if (fsmForStatusUpdate != null)
			producer.push(config.getUpdateWorkflowTopic(),
					new FSMRequest(requestInfo, fsmForStatusUpdate, fsmRequest.getWorkflow()));

	}

	public FSMResponse getFSMData(FSMSearchCriteria fsmSearchCriteria, String dsoId) {
		List<Object> preparedStmtList = new ArrayList<>();
		String query = fsmQueryBuilder.getFSMSearchQuery(fsmSearchCriteria, dsoId, preparedStmtList);
		List<FSM> fsms = jdbcTemplate.query(query, preparedStmtList.toArray(), fsmRowMapper);
		return FSMResponse.builder().fsm(fsms).totalCount(fsmRowMapper.getFullCount()).build();
	}

	public List<FSMAuditUtil> getFSMActualData(FSMAuditSearchCriteria criteria) {
		List<Object> preparedStmtList = new ArrayList<>();
		String query = auditQueryBuilder.getFSMActualDataQuery(criteria, preparedStmtList);
		return jdbcTemplate.query(query, preparedStmtList.toArray(), auditRowMapper);
	}

	public List<FSMAuditUtil> getFSMAuditData(FSMAuditSearchCriteria criteria) {
		List<Object> preparedStmtList = new ArrayList<>();
		String query = auditQueryBuilder.getFSMAuditDataQuery(criteria, preparedStmtList);
		return jdbcTemplate.query(query, preparedStmtList.toArray(), auditRowMapper);
	}

	public List<String> fetchFSMIds(@Valid FSMSearchCriteria criteria) {

		List<Object> preparedStmtList = new ArrayList<>();
		preparedStmtList.add(criteria.getOffset());
		preparedStmtList.add(criteria.getLimit());
		return jdbcTemplate.query(
				"SELECT id from eg_fsm_application ORDER BY createdtime offset " + " ? " + "limit ? ",
				preparedStmtList.toArray(), new SingleColumnRowMapper<>(String.class));
	}

	public List<FSM> getFsmPlainSearch(FSMSearchCriteria criteria) {

		if (criteria.getIds() == null || criteria.getIds().isEmpty())
			throw new CustomException("PLAIN_SEARCH_ERROR", "Search only allowed by ids!");

		List<Object> preparedStmtList = new ArrayList<>();
		String query = fsmQueryBuilder.getFSMLikeQuery(criteria, preparedStmtList);
		log.info("Query: " + query);
		log.info("PS: " + preparedStmtList);
		return jdbcTemplate.query(query, preparedStmtList.toArray(), fsmRowMapper);
	}

	public List<String> getPeriodicEligiableApplicationList(String tenantId, Long timeLimit) {

		StringBuilder baseQuery = new StringBuilder(FSMQueryBuilder.GET_PERIODIC_ELGIABLE_APPLICATIONS);
		baseQuery.append("where tenantid=? and lastmodifiedtime<? and applicationstatus=?");
		List<Object> preparedStmtList = new ArrayList<>();
		preparedStmtList.add(tenantId);
		preparedStmtList.add(new Date().getTime() - timeLimit);
		preparedStmtList.add(FSMConstants.COMPLETED);
		return jdbcTemplate.queryForList(baseQuery.toString(), String.class,
				preparedStmtList.toArray());

	}
	
	

	/***
	 * This method will return unique tenantid's
	 * 
	 * @return tenant list
	 */

	public List<String> getTenants() {
		return jdbcTemplate.query(FSMQueryBuilder.GET_UNIQUE_TENANTS,
				new SingleColumnRowMapper<>(String.class));

	}

	public List<String> getOldPeriodicApplications(String applicationNo, String tenantId) {
		StringBuilder baseQuery = new StringBuilder(FSMQueryBuilder.GET_APPLICATION_LIST);
		List<Object> preparedStmtList = new ArrayList<>();
		preparedStmtList.add(applicationNo);
		preparedStmtList.add(tenantId);
		return jdbcTemplate.queryForList(baseQuery.toString(), String.class, preparedStmtList.toArray());
	}

	public List<VehicleTripDetail> getTrpiDetails(String tripId, int numOfRecords) {
		List<VehicleTripDetail> tripDetails = null;
		List<Object> preparedStmtList = new ArrayList<>();
		String query = fsmQueryBuilder.getTripDetailSarchQuery(tripId, numOfRecords, preparedStmtList);
		log.info("query for decreseTrip:: "+numOfRecords+":: query :: "+query);
		try {
			tripDetails = jdbcTemplate.query(query, preparedStmtList.toArray(), detailMapper);
			
		} catch (Exception e) {
			log.info("INVALID_VEHICLE_TRIP_DETAILS "+e.getMessage());
			throw new CustomException("INVALID_VEHICLE_TRIP_DETAILS", "INVALID_VEHICLE_TRIP_DETAILS");
		}

		return tripDetails;
	}
/**
 * This function is to update the trip status to inactive while decreasing the trips during trip update
 * @param vehicleTripList
 */
	//commented as  vehicleTripList is handled while calling updateVehicleToInActive function
	public void updateVehicleToInActive(List<VehicleTrip> vehicleTripList) {
		if (vehicleTripList != null) {
			producer.push(config.getVehicleUpdateTripToInactive(), new VehicleTripRequest(new RequestInfo(), vehicleTripList,null));
		}
	}
	

}
