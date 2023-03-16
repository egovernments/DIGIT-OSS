package org.egov.fsm.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.LinkedHashMap;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.repository.FSMRepository;
import org.egov.fsm.repository.ServiceRequestRepository;
import org.egov.fsm.util.FSMConstants;
import org.egov.fsm.util.FSMErrorConstants;
import org.egov.fsm.web.model.AuditDetails;
import org.egov.fsm.web.model.FSM;
import org.egov.fsm.web.model.FSMRequest;
import org.egov.fsm.web.model.RequestInfoWrapper;
import org.egov.fsm.web.model.Workflow;
import org.egov.fsm.web.model.vehicle.trip.VehicleTrip;
import org.egov.fsm.web.model.vehicle.trip.VehicleTripDetail;
import org.egov.fsm.web.model.vehicle.trip.VehicleTripDetail.StatusEnum;
import org.egov.fsm.web.model.vehicle.trip.VehicleTripRequest;
import org.egov.fsm.web.model.vehicle.trip.VehicleTripResponse;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class VehicleTripService {
	@Autowired
	private FSMConfiguration config;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private FSMRepository fsmRepository;

	public void scheduleVehicleTrip(FSMRequest fsmRequest, FSM oldFsmResult) {
		FSM fsm = fsmRequest.getFsm();
		boolean increaseTrip = false;
		Integer remainingNumberOfTrips = fsm.getNoOfTrips();
		Integer oldNumberOfTrips = 0;

		if (oldFsmResult == null) {
			oldNumberOfTrips = 0;
			increaseTrip = true;
		} else {
			increaseTrip = true;
			oldNumberOfTrips = oldFsmResult.getNoOfTrips();
		}
		if (FSMConstants.FSM_PAYMENT_PREFERENCE_POST_PAY.equalsIgnoreCase(fsmRequest.getFsm().getPaymentPreference())
				&& fsmRequest.getWorkflow().getAction().equalsIgnoreCase(FSMConstants.WF_ACTION_SCHEDULE)) {
			postPayRequestForTripUpdate(remainingNumberOfTrips, increaseTrip, fsmRequest, fsm);
		} 

		 else if (fsmRequest.getWorkflow().getAction().equalsIgnoreCase(FSMConstants.WF_ACTION_UPDATE)) {

				prePayRequestForTripUpdate(remainingNumberOfTrips, increaseTrip, fsmRequest, fsm, oldNumberOfTrips);

			}
	}

	private void prePayRequestForTripUpdate(Integer remainingNumberOfTrips, boolean increaseTrip, FSMRequest fsmRequest,
			FSM fsm, Integer oldNumberOfTrips) {

		String vehicleId = null;

		List<VehicleTrip> vehicleTripsForApplication = getVehicleTrips(fsmRequest, null, false);

		if (!CollectionUtils.isEmpty(vehicleTripsForApplication)) {
			vehicleId = vehicleTripsForApplication.get(0).getVehicle().getId();

		}
		if (vehicleId != fsmRequest.getFsm().getVehicleId()) {

			decreaseTripWhileUpdate(fsmRequest, fsm, oldNumberOfTrips);
			increaseUpdateTripDetails(fsmRequest.getFsm().getNoOfTrips(), fsmRequest, fsm);
		} else {

			List<VehicleTripDetail> vehicleTripDetails = fsmRepository.getTrpiDetails(fsm.getApplicationNo(), 0);
			log.info("vehicleTripDetails :: " + vehicleTripDetails.size());
			if (!vehicleTripDetails.isEmpty() && oldNumberOfTrips < fsm.getNoOfTrips()) {
				remainingNumberOfTrips = fsm.getNoOfTrips() - oldNumberOfTrips;
				increaseTrip = true;
			} else if (!vehicleTripDetails.isEmpty() && oldNumberOfTrips > fsm.getNoOfTrips()) {
				remainingNumberOfTrips = oldNumberOfTrips - fsm.getNoOfTrips();
				increaseTrip = false;
			} else if (!vehicleTripDetails.isEmpty() && oldNumberOfTrips.equals(fsm.getNoOfTrips())) {
				remainingNumberOfTrips = 0;
				increaseTrip = true;
			} else if ((vehicleTripDetails.isEmpty() && oldNumberOfTrips.equals(fsm.getNoOfTrips()))
					|| (vehicleTripDetails.isEmpty() && oldNumberOfTrips > fsm.getNoOfTrips())) {
				remainingNumberOfTrips = fsm.getNoOfTrips();
				increaseTrip = true;
			}
			increaseOrDecreaseTrip(remainingNumberOfTrips, increaseTrip, fsmRequest, fsm);
		}
	}

	private void postPayRequestForTripUpdate(Integer remainingNumberOfTrips, boolean increaseTrip,
			FSMRequest fsmRequest, FSM fsm) {
		increaseOrDecreaseTrip(remainingNumberOfTrips, increaseTrip, fsmRequest, fsm);
	}

	private void increaseOrDecreaseTrip(Integer remainingNumberOfTrips, boolean increaseTrip, FSMRequest fsmRequest,
			FSM fsm) {
		log.debug("remainingNumberOfTrips :: " + remainingNumberOfTrips + " increaseTrip ::" + increaseTrip);
		try {
			if (remainingNumberOfTrips != 0 && increaseTrip) {
				increaseUpdateTripDetails(remainingNumberOfTrips, fsmRequest, fsm);
			}
			if (!increaseTrip) {
				decreaseTripWhileUpdate(fsmRequest, fsm, remainingNumberOfTrips);
			}

		} catch (IllegalArgumentException e) {
			throw new CustomException(FSMErrorConstants.ILLEGAL_ARGUMENT_EXCEPTION,
					FSMConstants.OBJECTMAPPER_CONVERT_IN_USER_CALL);
		}
	}

	private void increaseUpdateTripDetails(Integer remainingNumberOfTrips, FSMRequest fsmRequest, FSM fsm) {
		StringBuilder createUri = new StringBuilder(config.getVehicleHost()).append(config.getVehicleTripContextPath())
				.append(config.getVehicleTripCreateEndpoint());
		org.egov.common.contract.request.User tripOwner = org.egov.common.contract.request.User.builder().build();
		BeanUtils.copyProperties(fsm.getDso().getOwner(), tripOwner);
		List<VehicleTrip> vehicleTripsList = new ArrayList<>();
		while (remainingNumberOfTrips > 0) {
			remainingNumberOfTrips--;
			VehicleTrip vehicleTrip = VehicleTrip.builder()
					.businessService(FSMConstants.VEHICLETRIP_BUSINESSSERVICE_NAME).tenantId(fsm.getTenantId())
					.tripOwner(tripOwner).vehicle(fsm.getVehicle()).build();
			VehicleTripDetail tripDetail = VehicleTripDetail.builder().referenceNo(fsm.getApplicationNo())
					.referenceStatus(FSMConstants.WF_DISPOSAL_IN_PROGRESS).tenantId(fsm.getTenantId())
					.volume(Double.valueOf(fsmRequest.getFsm().getVehicleCapacity()))
					.itemStartTime(Calendar.getInstance().getTimeInMillis())
					.itemEndTime(Calendar.getInstance().getTimeInMillis() + 100000).build();
			List<VehicleTripDetail> tripDetails = new ArrayList<>();
			tripDetails.add(tripDetail);
			vehicleTrip.setTripDetails(tripDetails);
			vehicleTripsList.add(vehicleTrip);
		}
		VehicleTripResponse vehicleTripResponse = new VehicleTripResponse();
		updateCreatedVehicleTrip(fsmRequest, vehicleTripResponse, vehicleTripsList, createUri);

	}

	private void updateCreatedVehicleTrip(FSMRequest fsmRequest, VehicleTripResponse vehicleTripResponse,
			List<VehicleTrip> vehicleTripsList, StringBuilder createUri) {
		log.debug("WORKFLOW ACTION==> " + fsmRequest.getWorkflow().getAction());

		if (fsmRequest.getWorkflow().getAction().equalsIgnoreCase(FSMConstants.WF_ACTION_UPDATE)) {
			log.debug("Vehicle Trip Request call ::" + vehicleTripResponse);
			VehicleTripRequest tripRequest = VehicleTripRequest.builder().vehicleTrip(vehicleTripsList)
					.requestInfo(fsmRequest.getRequestInfo())
					.workflow(Workflow.builder().action(FSMConstants.TRIP_READY_FOR_DISPOSAL).build()).build();
			serviceRequestRepository.fetchResult(createUri, tripRequest);

		}

	}

	private void decreaseTripWhileUpdate(FSMRequest fsmRequest, FSM fsm, Integer remainingNumberOfTrips) {
		log.debug("fsmRequest.getWorkflow().getAction()-->" + fsmRequest.getWorkflow().getAction());
		List<VehicleTripDetail> vehicleTripDetails = fsmRepository.getTrpiDetails(fsm.getApplicationNo(),
				remainingNumberOfTrips);
		if (vehicleTripDetails != null && !vehicleTripDetails.isEmpty()) {
			List<VehicleTrip> vehicleTripList = new ArrayList<>();
			AuditDetails auditDetails = new AuditDetails();
			Long time = System.currentTimeMillis();
			for (int i = 0; i < vehicleTripDetails.size(); i++) {

				VehicleTrip vehicleTrip = new VehicleTrip();
				auditDetails.setLastModifiedBy(fsmRequest.getRequestInfo().getUserInfo().getUuid());
				auditDetails.setLastModifiedTime(time);

				vehicleTripDetails.get(i).setStatus(StatusEnum.INACTIVE);
				vehicleTripDetails.get(i).setAuditDetails(auditDetails);

				vehicleTrip.setId(vehicleTripDetails.get(i).getTrip_id());
				vehicleTrip.setStatus(org.egov.fsm.web.model.vehicle.trip.VehicleTrip.StatusEnum.INACTIVE);
				vehicleTrip.setTripDetails(vehicleTripDetails);
				vehicleTrip.setAuditDetails(auditDetails);
				vehicleTripList.add(vehicleTrip);
			}
			fsmRepository.updateVehicleToInActive(vehicleTripList);
		}

	}

	public void vehicleTripReadyForDisposal(FSMRequest fsmRequest) {

		List<VehicleTrip> scheduledTrips = getVehicleTrips(fsmRequest, "SCHEDULED", true);
		if (scheduledTrips == null) {
			throw new CustomException(FSMErrorConstants.FSM_INVALID_ACTION,
					"Trip Not scheduled for this application yet!");
		} else {

			List<VehicleTrip> vehicleTripList = new ArrayList<>();
			scheduledTrips.forEach(scheduledTrip -> {

				VehicleTripDetail scheduledTripDetail = scheduledTrip.getTripDetails().get(0);
				scheduledTripDetail.setReferenceStatus(FSMConstants.WF_ACTION_COMPLETE);
				scheduledTripDetail.setVolume(fsmRequest.getFsm().getWasteCollected());
				scheduledTripDetail.setItemStartTime(Calendar.getInstance().getTimeInMillis());
				scheduledTripDetail.setItemEndTime(Calendar.getInstance().getTimeInMillis() + 100000);

				vehicleTripList.add(scheduledTrip);
			});

			StringBuilder uri = new StringBuilder(config.getVehicleHost()).append(config.getVehicleTripContextPath())
					.append(config.getVehicleTripUpdateEndpoint());
			VehicleTripRequest tripRequest = VehicleTripRequest.builder().vehicleTrip(vehicleTripList)
					.requestInfo(fsmRequest.getRequestInfo())
					.workflow(Workflow.builder().action(FSMConstants.TRIP_READY_FOR_DISPOSAL).build()).build();

			try {
				serviceRequestRepository.fetchResult(uri, tripRequest);

			} catch (IllegalArgumentException e) {
				throw new CustomException(FSMErrorConstants.ILLEGAL_ARGUMENT_EXCEPTION,
						FSMConstants.OBJECTMAPPER_CONVERT_IN_USER_CALL);
			}

		}
	}

	/**
	 * returns the vehicle trips with the appplicationNo of FSM or with the status
	 * of VehicleTrip
	 * 
	 * @param fsmRequest        vehicle with the vehicleid of the fsm
	 * @param applicationStatus - if not null, vehicletrip with the fsm application
	 *                          will be fetched. other wise the vehicletrips with
	 *                          the status
	 * @param all               - if TRUE then applicationNo of FSM and
	 *                          applicationStatus of VehicleTrip both are considered
	 *                          to query. other wise only status if present or
	 *                          applicationNo if status not present
	 * @return
	 */
	public List<VehicleTrip> getVehicleTrips(FSMRequest fsmRequest, String applicationStatus, boolean all) {
		FSM fsm = fsmRequest.getFsm();

		StringBuilder uri = new StringBuilder(config.getVehicleHost()).append(config.getVehicleTripContextPath())
				.append(config.getVehicleTripSearchEndpoint());
		uri.append("?tenantId=").append(fsm.getTenantId());
		if (all == Boolean.FALSE) {
			uri.append("&refernceNos=").append(fsm.getApplicationNo());
		} else {

			uri.append("&vehicleIds=").append(fsm.getVehicleId());
			if (all == Boolean.TRUE) {
				if (!StringUtils.isEmpty(applicationStatus)) {
					uri.append("&applicationStatus=").append(applicationStatus);
				}
				uri.append("&refernceNos=").append(fsm.getApplicationNo());

			} else {
				if (!StringUtils.isEmpty(applicationStatus)) {
					uri.append("&applicationStatus=").append(applicationStatus);
				} else {
					uri.append("&refernceNos=").append(fsm.getApplicationNo());
				}
			}
		}
		try {

			LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri,
					RequestInfoWrapper.builder().requestInfo(fsmRequest.getRequestInfo()).build());

			VehicleTripResponse vehicleTripResponse = mapper.convertValue(responseMap, VehicleTripResponse.class);
			if (vehicleTripResponse != null && vehicleTripResponse.getVehicleTrip() != null
					&& !vehicleTripResponse.getVehicleTrip().isEmpty()) {
				return vehicleTripResponse.getVehicleTrip();
			}
			return new ArrayList<>();
		} catch (IllegalArgumentException e) {
			throw new CustomException(FSMErrorConstants.ILLEGAL_ARGUMENT_EXCEPTION,
					FSMConstants.OBJECTMAPPER_CONVERT_IN_USER_CALL);
		}
	}

	public void updateVehicleTrip(FSMRequest fsmRequest) {

		List<VehicleTrip> vehicleTripsForApplication = getVehicleTrips(fsmRequest, null, true);

		if (!CollectionUtils.isEmpty(vehicleTripsForApplication)) {
			List<VehicleTrip> vehicleTripList = new ArrayList<>();
			vehicleTripsForApplication.forEach(vehicleTrip -> {
				VehicleTripDetail vehicleTripDetail = vehicleTrip.getTripDetails().get(0);
				vehicleTripDetail.setReferenceStatus(FSMConstants.WF_ACTION_COMPLETE);
				vehicleTripDetail.setVolume(fsmRequest.getFsm().getWasteCollected());
				vehicleTripList.add(vehicleTrip);
			});

			StringBuilder uri = new StringBuilder(config.getVehicleHost()).append(config.getVehicleTripContextPath())
					.append(config.getVehicleTripUpdateEndpoint());
			VehicleTripRequest tripRequest = VehicleTripRequest.builder().vehicleTrip(vehicleTripList)
					.requestInfo(fsmRequest.getRequestInfo())
					.workflow(Workflow.builder().action(FSMConstants.UPDATE_ONLY_VEHICLE_TRIP_RECORD).build()).build();
			try {
				serviceRequestRepository.fetchResult(uri, tripRequest);

			} catch (IllegalArgumentException e) {
				throw new CustomException(FSMErrorConstants.ILLEGAL_ARGUMENT_EXCEPTION,
						FSMConstants.OBJECTMAPPER_CONVERT_IN_USER_CALL);
			}
		}
	}
}