package org.egov.fsm.service;

import java.util.ArrayList;
import java.util.List;

import org.egov.fsm.repository.FSMInboxRepository;
import org.egov.fsm.util.FSMErrorConstants;
import org.egov.fsm.web.model.vehicle.trip.VehicleTripSearchCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class FSMInboxService {

	@Autowired
	private FSMInboxRepository fsmInboxRepository;

	public List<String> fetchApplicationIds(VehicleTripSearchCriteria vehicleTripSearchCriteria) {

		if (vehicleTripSearchCriteria.getTenantId().split("\\.").length == 1) {
			throw new CustomException(FSMErrorConstants.INVALID_TENANT, " Tenant is not available");
		}
		log.info("applicationStatus() :::: "+vehicleTripSearchCriteria.getApplicationStatus());
		List<String> vehicleTripDetailList = fsmInboxRepository.fetchVehicleStateMap(vehicleTripSearchCriteria);
		if(null == vehicleTripDetailList)
			return new ArrayList<>();

		return vehicleTripDetailList;

    }

}