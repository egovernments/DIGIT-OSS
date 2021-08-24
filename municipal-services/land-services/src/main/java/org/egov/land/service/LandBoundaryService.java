package org.egov.land.service;

import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.egov.land.config.LandConfiguration;
import org.egov.land.repository.ServiceRequestRepository;
import org.egov.land.util.LandConstants;
import org.egov.land.web.models.Boundary;
import org.egov.land.web.models.LandInfoRequest;
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
public class LandBoundaryService {

	private ServiceRequestRepository serviceRequestRepository;

	private ObjectMapper mapper;

	private LandConfiguration config;

	@Autowired
	public LandBoundaryService(ServiceRequestRepository serviceRequestRepository, ObjectMapper mapper,
			LandConfiguration config) {
		this.serviceRequestRepository = serviceRequestRepository;
		this.mapper = mapper;
		this.config = config;
	}

	/**
	 * Enriches the locality object by calling the location service
	 * 
	 * @param request
	 *            LandRequest for create
	 * @param hierarchyTypeCode
	 *            HierarchyTypeCode of the boundaries
	 */
	@SuppressWarnings("rawtypes")
	public void getAreaType(LandInfoRequest request, String hierarchyTypeCode) {
		log.info("LAND info Request:::::"+request.toString());
		String tenantId = request.getLandInfo().getTenantId();
		log.info("LAND INFO toString():::"+request.getLandInfo().toString());
		log.info("tenantID::"+tenantId);
		LinkedList<String> localities = new LinkedList<>();

		if (request.getLandInfo().getAddress() == null || request.getLandInfo().getAddress().getLocality() == null)
			throw new CustomException(LandConstants.INVALID_ADDRESS, "The address or locality cannot be null");
		log.info("LAND ADDRESS:::"+request.getLandInfo().getAddress().toString());
		localities.add(request.getLandInfo().getAddress().getLocality().getCode());
		log.info("Locality Code::::"+request.getLandInfo().getAddress().getLocality().getCode());

		StringBuilder uri = new StringBuilder(config.getLocationHost());
		uri.append(config.getLocationContextPath()).append(config.getLocationEndpoint());
		uri.append("?").append("tenantId=").append(tenantId);
		if (hierarchyTypeCode != null)
			uri.append("&").append("hierarchyTypeCode=").append(hierarchyTypeCode);
		uri.append("&").append("boundaryType=").append("Locality");

		if (!CollectionUtils.isEmpty(localities)) {
			uri.append("&").append("codes=");
			for (int i = 0; i < localities.size(); i++) {
				uri.append(localities.get(i));
				if (i != localities.size() - 1)
					uri.append(",");
			}
		}
		LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri, request.getRequestInfo());
		if (CollectionUtils.isEmpty(responseMap))
			throw new CustomException(LandConstants.BOUNDARY_ERROR, "The response from location service is empty or null");
		String jsonString = new JSONObject(responseMap).toString();
		log.info("JSON String::::"+jsonString);

		Map<String, String> propertyIdToJsonPath = getJsonpath(request);
		
		for(Map.Entry<String, String> props :propertyIdToJsonPath.entrySet())
			log.info("propertyIdToJsonPath::KEY"+props.getKey()+"::Values::"+props.getValue());
		

		DocumentContext context = JsonPath.parse(jsonString);
		log.info("Context STring"+context.jsonString());
		log.info("LAND info ID:::"+request.getLandInfo().getId());
		List<String> boundaryObject = context.read(propertyIdToJsonPath.get(request.getLandInfo().getId()));

		if (boundaryObject != null && CollectionUtils.isEmpty((boundaryObject)))
			throw new CustomException(LandConstants.BOUNDARY_MDMS_DATA_ERROR, "The boundary data was not found");

		Boundary boundary = mapper.convertValue(boundaryObject.get(0), Boundary.class);
		if (boundary.getName() == null)
			throw new CustomException(LandConstants.INVALID_BOUNDARY_DATA, "The boundary data for the code "
					+ request.getLandInfo().getAddress().getLocality().getCode() + " is not available");
		request.getLandInfo().getAddress().setLocality(boundary);

	}

	/**
	 * Prepares map of landInfoId to jsonpath which contains the code of the
	 * land
	 * 
	 * @param request
	 *            landRequest for create
	 * @return Map of landInfoId to jsonPath with land locality code
	 */
	private Map<String, String> getJsonpath(LandInfoRequest request) {
		Map<String, String> idToJsonPath = new LinkedHashMap<>();
		String jsonpath = "$..boundary[?(@.code==\"{}\")]";
		log.info("Landinfo:::"+request.getLandInfo().getId()+":::Locality"+request.getLandInfo().getAddress().getLocality().getCode());
		idToJsonPath.put(request.getLandInfo().getId(),
				jsonpath.replace("{}", request.getLandInfo().getAddress().getLocality().getCode()));

		return idToJsonPath;
	}

}
