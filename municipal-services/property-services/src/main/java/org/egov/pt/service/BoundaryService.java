package org.egov.pt.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.models.Locality;
import org.egov.pt.models.Property;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.web.contracts.RequestInfoWrapper;
import org.egov.tracer.model.CustomException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;

@Service
public class BoundaryService {

	@Value("${egov.location.host}")
	private String locationHost;

	@Value("${egov.location.context.path}")
	private String locationContextPath;

	@Value("${egov.location.endpoint}")
	private String locationEndpoint;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private ObjectMapper mapper;

	/**
	 * Enriches the locality object by calling the location service
	 * 
	 * @param request
	 *            PropertyRequest for create
	 * @param hierarchyTypeCode
	 *            HierarchyTypeCode of the boundaries
	 */
	public void getAreaType(Property property, RequestInfo requestInfo, String hierarchyTypeCode) {

		if (ObjectUtils.isEmpty(property))
			return;

		String tenantId = property.getTenantId();

		if (property.getAddress() == null || property.getAddress().getLocality() == null)
			throw new CustomException("INVALID ADDRESS", "The address or locality cannot be null");

		StringBuilder uri = new StringBuilder(locationHost);
		uri.append(locationContextPath).append(locationEndpoint);
		uri.append("?").append("tenantId=").append(tenantId);
		if (hierarchyTypeCode != null)
			uri.append("&").append("hierarchyTypeCode=").append(hierarchyTypeCode);

		uri.append("&").append("boundaryType=").append("Locality").append("&").append("codes=")
				.append(property.getAddress().getLocality().getCode());

		Optional<Object> response = serviceRequestRepository.fetchResult(uri, RequestInfoWrapper.builder().requestInfo(requestInfo).build());
		
		if (response.isPresent()) {
			LinkedHashMap responseMap = (LinkedHashMap) response.get();
			if (CollectionUtils.isEmpty(responseMap))
				throw new CustomException("BOUNDARY ERROR", "The response from location service is empty or null");
			String jsonString = new JSONObject(responseMap).toString();

			Map<String, String> propertyIdToJsonPath = getJsonpath(property);

			DocumentContext context = JsonPath.parse(jsonString);

			Object boundaryObject = context.read(propertyIdToJsonPath.get(property.getPropertyId()));
			if (!(boundaryObject instanceof ArrayList) || CollectionUtils.isEmpty((ArrayList) boundaryObject))
				throw new CustomException("BOUNDARY MDMS DATA ERROR", "The boundary data was not found");

			ArrayList boundaryResponse = context.read(propertyIdToJsonPath.get(property.getPropertyId()));
			Locality boundary = mapper.convertValue(boundaryResponse.get(0), Locality.class);
			if (boundary.getName() == null)
				throw new CustomException("INVALID BOUNDARY DATA", "The boundary data for the code "
						+ property.getAddress().getLocality().getCode() + " is not available");
			property.getAddress().setLocality(boundary);

		}

		// $..boundary[?(@.code=="JLC476")].area

	}

	/**
	 * Prepares map of propertyId to jsonpath which contains the code of the
	 * property
	 * 
	 * @param request
	 *            PropertyRequest for create
	 * @return Map of propertyId to jsonPath with properties locality code
	 */
	private Map<String, String> getJsonpath(Property property) {

		Map<String, String> propertyIdToJsonPath = new LinkedHashMap<>();
		String jsonpath = "$..boundary[?(@.code==\"{}\")]";
		propertyIdToJsonPath.put(property.getPropertyId(),
				jsonpath.replace("{}", property.getAddress().getLocality().getCode()));
		return propertyIdToJsonPath;
	}

}
