package org.egov.vehicle.trip.service;

import java.util.LinkedHashMap;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.vehicle.config.VehicleConfiguration;
import org.egov.vehicle.repository.ServiceRequestRepository;
import org.egov.vehicle.trip.web.model.PlantMapping;
import org.egov.vehicle.trip.web.model.PlantMappingResponse;
import org.egov.vehicle.web.model.RequestInfoWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class VehicleTripFSMService {

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private VehicleConfiguration vehicleConfiguration;

	public PlantMapping getPlantMapping(RequestInfo requestInfo, String tenantId, String employeeUuid) {
		StringBuilder url = new StringBuilder(vehicleConfiguration.getFsmHost())
				.append(vehicleConfiguration.getFsmPlantmapContextPath())
				.append(vehicleConfiguration.getFsmPlantmapSearchEndpoint()).append("?tenantId=").append(tenantId)
				.append("&employeeUuid=").append(employeeUuid);
		try {

			LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(url,
					new RequestInfoWrapper(requestInfo));
			PlantMappingResponse plantMappingResponse = mapper.convertValue(responseMap, PlantMappingResponse.class);
			if (null != plantMappingResponse && !CollectionUtils.isEmpty(plantMappingResponse.getPlantMapping())) {
				return plantMappingResponse.getPlantMapping().get(0);
			} else {
				return null;
			}

		} catch (IllegalArgumentException e) {
			throw new CustomException("IllegalArgumentException", "ObjectMapper  cannot convert to plantmapping");
		}

	}
}
