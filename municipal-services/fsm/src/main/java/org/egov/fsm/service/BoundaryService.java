package org.egov.fsm.service;

import java.util.LinkedHashMap;
import java.util.List;

import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.repository.ServiceRequestRepository;
import org.egov.fsm.util.FSMErrorConstants;
import org.egov.fsm.web.model.FSM;
import org.egov.fsm.web.model.FSMRequest;
import org.egov.fsm.web.model.RequestInfoWrapper;
import org.egov.fsm.web.model.location.Boundary;
import org.egov.tracer.model.CustomException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BoundaryService {

	private ServiceRequestRepository serviceRequestRepository;

	private ObjectMapper mapper;

	private FSMConfiguration config;

	@Autowired
	public BoundaryService(ServiceRequestRepository serviceRequestRepository, ObjectMapper mapper,
			FSMConfiguration config) {
		this.serviceRequestRepository = serviceRequestRepository;
		this.mapper = mapper;
		this.config = config;
	}

	/**
	 * Enriches the locality object by calling the location service
	 * 
	 * @param request
	 *            FSMRequest for create
	 * @param hierarchyTypeCode
	 *            HierarchyTypeCode of the boundaries
	 */
	public void getAreaType(FSMRequest request, String hierarchyTypeCode) throws CustomException {
		if (request.getFsm() == null) {
			return;
		}
		FSM fsm = request.getFsm();

		String tenantId = request.getFsm().getTenantId();

		if (fsm.getAddress() == null || fsm.getAddress().getLocality() == null) {
			throw new CustomException(FSMErrorConstants.INVALID_ADDRES, "The address or locality cannot be null");
		}
			

		StringBuilder uri = new StringBuilder(config.getLocationHost());
		uri.append(config.getLocationContextPath()).append(config.getLocationEndpoint());
		uri.append("?").append("tenantId=").append(tenantId);
		
		if (hierarchyTypeCode != null) {
			uri.append("&").append("hierarchyTypeCode=").append(hierarchyTypeCode);
		}
		uri.append("&").append("boundaryType=").append("Locality");
		uri.append("&").append("codes=").append(fsm.getAddress().getLocality().getCode());

		RequestInfoWrapper wrapper = RequestInfoWrapper.builder().requestInfo(request.getRequestInfo()).build();
		LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri, wrapper);
		
		if (CollectionUtils.isEmpty(responseMap)) {
			throw new CustomException(FSMErrorConstants.BOUNDARY_ERROR,
					"The response from location service is empty or null");
		}
			
		String jsonString = new JSONObject(responseMap).toString();

		DocumentContext context = JsonPath.parse(jsonString);

		List<Boundary> boundaryResponse = context.read("$..boundary[?(@.code==\"{}\")]".replace("{}",fsm.getAddress().getLocality().getCode()));

		if (boundaryResponse != null &&  CollectionUtils.isEmpty((boundaryResponse) )) {
			log.debug("The boundary data was not found");
			throw new CustomException(FSMErrorConstants.BOUNDARY_MDMS_DATA_ERROR, "The boundary data was not found");
		}
			

		Boundary boundary = mapper.convertValue(boundaryResponse.get(0), Boundary.class);
		
		if (boundary.getName() == null) {
			
			throw new CustomException(FSMErrorConstants.INVALID_BOUNDARY_DATA,
					"The boundary data for the code " + fsm.getAddress().getLocality().getCode() + " is not available");
		}
			

		fsm.getAddress().setLocality(boundary);

	}

}
