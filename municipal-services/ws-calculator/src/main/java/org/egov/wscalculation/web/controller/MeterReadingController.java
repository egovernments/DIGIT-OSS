package org.egov.wscalculation.web.controller;

import java.util.List;

import javax.validation.Valid;

import org.egov.wscalculation.web.models.MeterConnectionRequest;
import org.egov.wscalculation.web.models.MeterReading;
import org.egov.wscalculation.web.models.MeterReadingResponse;
import org.egov.wscalculation.web.models.MeterReadingSearchCriteria;
import org.egov.wscalculation.web.models.RequestInfoWrapper;
import org.egov.wscalculation.service.MeterService;
import org.egov.wscalculation.util.ResponseInfoFactory;
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
@RequestMapping("/meterConnection")
public class MeterReadingController {
	@Autowired
	private final ResponseInfoFactory responseInfoFactory;

	@Autowired
	private MeterService meterService;

	@RequestMapping(value = "/_create", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<MeterReadingResponse> createMeterReading(
			@Valid @RequestBody MeterConnectionRequest meterConnectionRequest) {
		List<MeterReading> meterReadings = meterService.createMeterReading(meterConnectionRequest);
		MeterReadingResponse response = MeterReadingResponse.builder().meterReadings(meterReadings).responseInfo(
				responseInfoFactory.createResponseInfoFromRequestInfo(meterConnectionRequest.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);

	}
	
	@RequestMapping(value = "/_search", method = RequestMethod.POST)
	public ResponseEntity<MeterReadingResponse> search(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@Valid @ModelAttribute MeterReadingSearchCriteria criteria) {
		List<MeterReading> meterReadingLists = meterService.searchMeterReadings(criteria, requestInfoWrapper.getRequestInfo());
		MeterReadingResponse response = MeterReadingResponse.builder().meterReadings(meterReadingLists)
				.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(),
						true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
}
