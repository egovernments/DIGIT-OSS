package org.egov.fsm.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.LinkedHashMap;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.repository.ServiceRequestRepository;
import org.egov.fsm.util.FSMConstants;
import org.egov.fsm.util.FSMErrorConstants;
import org.egov.fsm.web.model.FSM;
import org.egov.fsm.web.model.FSMRequest;
import org.egov.fsm.web.model.RequestInfoWrapper;
import org.egov.fsm.web.model.Workflow;
import org.egov.fsm.web.model.vehicle.trip.VehicleTrip;
import org.egov.fsm.web.model.vehicle.trip.VehicleTripDetail;
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

	public void scheduleVehicleTrip(FSMRequest fsmRequest) {

//		SAN-1024: Commenting out this code as now a vehicle can have multiple trips assigned from different applications waiting for 
		// disposal at the same time
//		if (FSMConstants.FSM_PAYMENT_PREFERENCE_POST_PAY.equalsIgnoreCase(fsmRequest.getFsm().getPaymentPreference())
//				&& fsmRequest.getWorkflow().getAction().equalsIgnoreCase(FSMConstants.WF_ACTION_SCHEDULE)) {
//			List<VehicleTrip> existingVehicleTrips = getVehicleTrips(fsmRequest, "WAITING_FOR_DISPOSAL", false);
//			if (existingVehicleTrips != null) {
//				throw new CustomException(FSMErrorConstants.FSM_INVALID_ACTION,
//						"VehicleTrip Waiting for Disposal of Application No: "
//								+ existingVehicleTrips.get(0).getTripDetails().get(0).getReferenceNo()
//								+ ", Cannot complete this FSM Application No "
//								+ fsmRequest.getFsm().getApplicationNo());
//			}
//
//		}
		FSM fsm = fsmRequest.getFsm();
		StringBuilder createUri = new StringBuilder(config.getVehicleHost()).append(config.getVehicleTripContextPath())
				.append(config.getVehicleTripCreateEndpoint());
		org.egov.common.contract.request.User tripOwner = org.egov.common.contract.request.User.builder().build();
		BeanUtils.copyProperties(fsm.getDso().getOwner(), tripOwner);

		List<VehicleTrip> vehicleTripsList = new ArrayList<VehicleTrip>();
		int numberOfTrips = fsm.getNoOfTrips();
		while (numberOfTrips > 0) {
			numberOfTrips--;
			VehicleTrip vehicleTrip = new VehicleTrip();
			VehicleTripDetail tripDetail = new VehicleTripDetail();
			if (FSMConstants.FSM_PAYMENT_PREFERENCE_POST_PAY
					.equalsIgnoreCase(fsmRequest.getFsm().getPaymentPreference())
					&& fsmRequest.getWorkflow().getAction().equalsIgnoreCase(FSMConstants.WF_ACTION_SCHEDULE)) {

				vehicleTrip = VehicleTrip.builder().businessService(FSMConstants.VEHICLETRIP_BUSINESSSERVICE_NAME)
						.tenantId(fsm.getTenantId()).tripOwner(tripOwner).vehicle(fsm.getVehicle()).build();
				tripDetail = VehicleTripDetail.builder().referenceNo(fsm.getApplicationNo())
						.referenceStatus(FSMConstants.WF_DISPOSAL_IN_PROGRESS).tenantId(fsm.getTenantId())
						.volume(Double.valueOf(fsmRequest.getFsm().getVehicleCapacity()))
						.itemStartTime(Calendar.getInstance().getTimeInMillis())
						.itemEndTime(Calendar.getInstance().getTimeInMillis() + 100000).build();
			} else {
				vehicleTrip = VehicleTrip.builder().businessService(FSMConstants.VEHICLETRIP_BUSINESSSERVICE_NAME)
						.tenantId(fsm.getTenantId()).tripOwner(tripOwner).vehicle(fsm.getVehicle()).build();
				tripDetail = VehicleTripDetail.builder().referenceNo(fsm.getApplicationNo())
						.referenceStatus(fsm.getApplicationStatus()).tenantId(fsm.getTenantId())
						.volume(fsm.getWasteCollected()).build();
			}

			List<VehicleTripDetail> tripDetails = new ArrayList<VehicleTripDetail>();
			tripDetails.add(tripDetail);
			vehicleTrip.setTripDetails(tripDetails);
			vehicleTripsList.add(vehicleTrip);
			log.debug(" prepared request for vehicleTripsList ::" + vehicleTripsList);
		}

		try {
			if (FSMConstants.FSM_PAYMENT_PREFERENCE_POST_PAY
					.equalsIgnoreCase(fsmRequest.getFsm().getPaymentPreference())
					&& fsmRequest.getWorkflow().getAction().equalsIgnoreCase(FSMConstants.WF_ACTION_SCHEDULE)) {

				VehicleTripRequest tripRequest = VehicleTripRequest.builder().vehicleTrip(vehicleTripsList)
						.requestInfo(fsmRequest.getRequestInfo())
						.workflow(Workflow.builder().action(FSMConstants.TRIP_READY_FOR_DISPOSAL).build()).build();

				serviceRequestRepository.fetchResult(createUri, tripRequest);

			} else {
				serviceRequestRepository.fetchResult(createUri, VehicleTripRequest.builder()
						.vehicleTrip(vehicleTripsList).requestInfo(fsmRequest.getRequestInfo()).build());

			}

		} catch (IllegalArgumentException e) {
			throw new CustomException("IllegalArgumentException", "ObjectMapper not able to convertValue in userCall");
		}
	}

	public void vehicleTripReadyForDisposal(FSMRequest fsmRequest) {

//		SAN-1024: Commenting out this code as now a vehicle can have multiple trips assigned from different applications waiting for 
		// disposal at the same time
//		List<VehicleTrip> existingVehicleTrips = getVehicleTrips(fsmRequest, "WAITING_FOR_DISPOSAL",false);
//		
//		if(existingVehicleTrips != null ) {
//			throw new CustomException(FSMErrorConstants.FSM_INVALID_ACTION,
//					"VehicleTrip Waiting for Disposal of Application No "
//							+ existingVehicleTrips.get(0).getTripDetails().get(0).getReferenceNo()
//							+ ", Cannot complete this FSM Application No " + fsmRequest.getFsm().getApplicationNo());
//		}else {
		List<VehicleTrip> scheduledTrips = getVehicleTrips(fsmRequest, "SCHEDULED", true);
		if (scheduledTrips == null) {
			throw new CustomException(FSMErrorConstants.FSM_INVALID_ACTION,
					"Trip Not scheduled for this application yet!");
		} else {

			List<VehicleTrip> vehicleTripList = new ArrayList<VehicleTrip>();
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
				LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri, tripRequest);

			} catch (IllegalArgumentException e) {
				throw new CustomException("IllegalArgumentException",
						"ObjectMapper not able to convertValue in userCall");
			}

		}
	}

	// }
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

		try {

			LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri,
					RequestInfoWrapper.builder().requestInfo(fsmRequest.getRequestInfo()).build());

			VehicleTripResponse vehicleTripResponse = mapper.convertValue(responseMap, VehicleTripResponse.class);
			if (vehicleTripResponse != null && vehicleTripResponse.getVehicleTrip() != null
					&& vehicleTripResponse.getVehicleTrip().size() > 0) {
				return vehicleTripResponse.getVehicleTrip();
			}
			return null;
		} catch (IllegalArgumentException e) {
			throw new CustomException("IllegalArgumentException", "ObjectMapper not able to convertValue in userCall");
		}
	}

	public void updateVehicleTrip(FSMRequest fsmRequest) {

		// List<VehicleTrip> existingVehicleTrips = getVehicleTrips(fsmRequest,
		// "WAITING_FOR_DISPOSAL",false);

//		if(existingVehicleTrips != null ) {
//			throw new CustomException(FSMErrorConstants.FSM_INVALID_ACTION,
//					"VehicleTrip Waiting for Disposal of Application No "
//							+ existingVehicleTrips.get(0).getTripDetails().get(0).getReferenceNo()
//							+ ", Cannot complete this FSM Application No " + fsmRequest.getFsm().getApplicationNo());
//		}else {
		List<VehicleTrip> vehicleTripsForApplication = getVehicleTrips(fsmRequest, null, true);

		if (!CollectionUtils.isEmpty(vehicleTripsForApplication)) {
			List<VehicleTrip> vehicleTripList = new ArrayList<VehicleTrip>();
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
				LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri, tripRequest);

			} catch (IllegalArgumentException e) {
				throw new CustomException("IllegalArgumentException",
						"ObjectMapper not able to convertValue in userCall");
			}
		}
	}
}
