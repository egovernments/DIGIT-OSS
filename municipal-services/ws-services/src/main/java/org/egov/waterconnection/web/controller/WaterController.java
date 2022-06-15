package org.egov.waterconnection.web.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.validation.Valid;

import org.egov.waterconnection.web.models.RequestInfoWrapper;
import org.egov.waterconnection.web.models.SearchCriteria;
import org.egov.waterconnection.web.models.WaterConnection;
import org.egov.waterconnection.web.models.WaterConnectionRequest;
import org.egov.waterconnection.web.models.WaterConnectionResponse;
import org.egov.waterconnection.service.WaterService;
import org.egov.waterconnection.util.ResponseInfoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@RestController
@RequestMapping("/wc")
public class WaterController {

	@Autowired
	private WaterService waterService;

	@Autowired
	private final ResponseInfoFactory responseInfoFactory;

	@RequestMapping(value = "/_create", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<WaterConnectionResponse> createWaterConnection(
			@Valid @RequestBody WaterConnectionRequest waterConnectionRequest) {
		List<WaterConnection> waterConnection = waterService.createWaterConnection(waterConnectionRequest);
		WaterConnectionResponse response = WaterConnectionResponse.builder().waterConnection(waterConnection)
				.responseInfo(responseInfoFactory
						.createResponseInfoFromRequestInfo(waterConnectionRequest.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@RequestMapping(value = "/_search", method = RequestMethod.POST)
	public ResponseEntity<WaterConnectionResponse> search(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@Valid @ModelAttribute SearchCriteria criteria) {
		List<WaterConnection> waterConnectionList = waterService.search(criteria, requestInfoWrapper.getRequestInfo());
		Integer count = waterService.countAllWaterApplications(criteria, requestInfoWrapper.getRequestInfo());
		WaterConnectionResponse response = WaterConnectionResponse.builder().waterConnection(waterConnectionList)
				.totalCount(count)
				.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(),
						true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@RequestMapping(value = "/_update", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<WaterConnectionResponse> updateWaterConnection(
			@Valid @RequestBody WaterConnectionRequest waterConnectionRequest) {
		List<WaterConnection> waterConnection = waterService.updateWaterConnection(waterConnectionRequest);
		WaterConnectionResponse response = WaterConnectionResponse.builder().waterConnection(waterConnection)
				.responseInfo(responseInfoFactory
						.createResponseInfoFromRequestInfo(waterConnectionRequest.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	@RequestMapping(value = "/_plainsearch", method = RequestMethod.POST)
	public ResponseEntity<WaterConnectionResponse> planeSearch(
			@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@Valid @ModelAttribute SearchCriteria criteria) {
		WaterConnectionResponse response = waterService.planeSearch(criteria, requestInfoWrapper.getRequestInfo());
		response.setResponseInfo(
				responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true));
		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	@RequestMapping(value = "/_opensearch", method = RequestMethod.POST)
	public ResponseEntity<Map<String,BigDecimal>> plainsearch(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
															  @Valid @ModelAttribute SearchCriteria criteria) {
		Map<String,BigDecimal> response = new HashMap<>();
		BigDecimal totalAmount = waterService.getPaidConnections(criteria, requestInfoWrapper.getRequestInfo());
		int count = waterService.getActiveConnections(criteria, requestInfoWrapper.getRequestInfo());
		if(totalAmount != null) {
			response.put("totalAmountPaid", totalAmount);
		}
		response.put("activeConnections", BigDecimal.valueOf(count));
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}