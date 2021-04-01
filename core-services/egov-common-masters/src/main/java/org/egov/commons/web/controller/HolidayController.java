/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.commons.web.controller;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.commons.model.Holiday;
import org.egov.commons.service.CalendarYearService;
import org.egov.commons.service.HolidayService;
import org.egov.commons.util.ApplicationConstants;
import org.egov.commons.web.contract.HolidayGetRequest;
import org.egov.commons.web.contract.HolidayRequest;
import org.egov.commons.web.contract.HolidayResponse;
import org.egov.commons.web.contract.RequestInfoWrapper;
import org.egov.commons.web.contract.factory.ResponseInfoFactory;
import org.egov.commons.web.errorhandlers.Error;
import org.egov.commons.web.errorhandlers.ErrorHandler;
import org.egov.commons.web.errorhandlers.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/holidays")
public class HolidayController {

	private static final Logger logger = LoggerFactory.getLogger(HolidayController.class);

	@Autowired
	private HolidayService holidayService;

	@Autowired
	private ErrorHandler errHandler;

	@Autowired
	private ResponseInfoFactory responseInfoFactory;

	@Autowired
	private ApplicationConstants applicationConstants;

	@Autowired
	private CalendarYearService calendarYearService;

	@PostMapping(value = "_create")
	@ResponseBody
	public ResponseEntity<?> create(@RequestBody @Valid final HolidayRequest holidayRequest, final BindingResult errors) {
		// validate header
		if (errors.hasErrors()) {
			final ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<ErrorResponse>(errRes, HttpStatus.BAD_REQUEST);
		}
		logger.info("holidayRequest::" + holidayRequest);

		final List<ErrorResponse> errorResponses = validateHolidayRequest(holidayRequest);
		if (!errorResponses.isEmpty())
			return new ResponseEntity<List<ErrorResponse>>(errorResponses, HttpStatus.BAD_REQUEST);

		final Holiday holiday = holidayService.createHoliday(holidayRequest);

		List<Holiday> holidays = new ArrayList<>();
		holidays.add(holiday);
		return getSuccessResponse(holidays, holidayRequest.getRequestInfo());
	}

	@PostMapping(value = "/{holidayId}/_update")
	@ResponseBody
	public ResponseEntity<?> update(@RequestBody @Valid final HolidayRequest holidayRequest, final BindingResult errors, @PathVariable Long holidayId) {
		// validate header
		if (errors.hasErrors()) {
			final ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<ErrorResponse>(errRes, HttpStatus.BAD_REQUEST);
		}
		logger.info("holidayRequest::" + holidayRequest);
		holidayRequest.getHoliday().setId(holidayId);

		final List<ErrorResponse> errorResponses = validateHolidayRequest(holidayRequest);
		if (!errorResponses.isEmpty())
			return new ResponseEntity<List<ErrorResponse>>(errorResponses, HttpStatus.BAD_REQUEST);

		final Holiday holiday = holidayService.createHoliday(holidayRequest);

		List<Holiday> holidays = new ArrayList<>();
		holidays.add(holiday);

		return getSuccessResponse(holidays, holidayRequest.getRequestInfo());
	}

	private List<ErrorResponse> validateHolidayRequest(final HolidayRequest holidayRequest) {
		final List<ErrorResponse> errorResponses = new ArrayList<>();
		boolean isNameYearApplicableOn = true;
		boolean isCalendarYearExists = true;
		boolean isHolidayExists = false;
		boolean isDateOutOfRange = false;

		Holiday holiday = holidayRequest.getHoliday();
		if (holiday.getName() == null || holiday.getCalendarYear() == null || holiday.getApplicableOn() == null)
			isNameYearApplicableOn = false;
		else if (!calendarYearService.getYearByName(holiday.getCalendarYear().getName(), holidayRequest.getHoliday().getTenantId()))
			isCalendarYearExists = false;
		else if (!calendarYearService.getYearByNameAndDate(holiday.getCalendarYear().getName(),
				holiday.getApplicableOn(), holidayRequest.getHoliday().getTenantId()))
			isDateOutOfRange = true;
		else if (holidayService.getHolidayByApplicableOn(holiday.getId(), holiday.getApplicableOn(), holidayRequest.getHoliday().getTenantId()))
			isHolidayExists = true;

		if (!isCalendarYearExists) {
			final ErrorResponse errorResponse = new ErrorResponse();
			final Error error = new Error();
			error.setDescription(
					applicationConstants.getErrorMessage(ApplicationConstants.MSG_HOLIDAY_CALENDARYEAR_EXISTS));
			errorResponse.setError(error);
			errorResponses.add(errorResponse);
		}

		if (isHolidayExists) {
			final ErrorResponse errorResponse = new ErrorResponse();
			final Error error = new Error();
			error.setDescription(applicationConstants.getErrorMessage(ApplicationConstants.MSG_HOLIDAY_PRESENT));
			errorResponse.setError(error);
			errorResponses.add(errorResponse);
		}

		if (isDateOutOfRange) {
			final ErrorResponse errorResponse = new ErrorResponse();
			final Error error = new Error();
			error.setDescription(applicationConstants.getErrorMessage(ApplicationConstants.MSG_HOLIDAY_DATERANGE));
			errorResponse.setError(error);
			errorResponses.add(errorResponse);
		}

		if (!isNameYearApplicableOn) {
			final ErrorResponse errorResponse = new ErrorResponse();
			final Error error = new Error();
			error.setDescription(applicationConstants
					.getErrorMessage(ApplicationConstants.MSG_HOLIDAY_NAME_YEAR_APPLICABLE_MANDATORY));
			errorResponse.setError(error);
			errorResponses.add(errorResponse);
		}

		return errorResponses;
	}

	@PostMapping("_search")
	@ResponseBody
	public ResponseEntity<?> search(@ModelAttribute @Valid HolidayGetRequest holidayGetRequest,
			BindingResult modelAttributeBindingResult, @RequestBody @Valid RequestInfoWrapper requestInfoWrapper,
			BindingResult requestBodyBindingResult) {
		RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();

		// validate input params
		if (modelAttributeBindingResult.hasErrors()) {
			return errHandler.getErrorResponseEntityForMissingParameters(modelAttributeBindingResult, requestInfo);
		}

		// validate input params
		if (requestBodyBindingResult.hasErrors()) {
			return errHandler.getErrorResponseEntityForMissingRequestInfo(requestBodyBindingResult, requestInfo);
		}

		// Call service
		List<Holiday> holidaysList = null;
		try {
			holidaysList = holidayService.getHolidays(holidayGetRequest);
		} catch (Exception exception) {
			logger.error("Error while processing request " + holidayGetRequest, exception);
			return errHandler.getResponseEntityForUnexpectedErrors(requestInfo);
		}

		return getSuccessResponse(holidaysList, requestInfo);
	}


	@PostMapping("_searchprefixsuffix")
	@ResponseBody
	public ResponseEntity<?> getPrefixSuffixHolidays(@ModelAttribute @Valid HolidayGetRequest holidayGetRequest,
									BindingResult modelAttributeBindingResult, @RequestBody @Valid RequestInfoWrapper requestInfoWrapper,
									BindingResult requestBodyBindingResult) {
		RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();

		// validate input params
		if (modelAttributeBindingResult.hasErrors()) {
			return errHandler.getErrorResponseEntityForMissingParameters(modelAttributeBindingResult, requestInfo);
		}

		// validate input params
		if (requestBodyBindingResult.hasErrors()) {
			return errHandler.getErrorResponseEntityForMissingRequestInfo(requestBodyBindingResult, requestInfo);
		}

		// Call service
		List<Holiday> holidaysList = null;
		try {
			holidaysList = holidayService.getPrefixSuffixHolidays(holidayGetRequest);
		} catch (Exception exception) {
			logger.error("Error while processing request " + holidayGetRequest, exception);
			return errHandler.getResponseEntityForUnexpectedErrors(requestInfo);
		}

		return getSuccessResponse(holidaysList, requestInfo);
	}



	/**
	 * Populate Response object and returns holidays List
	 * 
	 * @param holidaysList
	 * @return
	 */
	private ResponseEntity<?> getSuccessResponse(List<Holiday> holidaysList, RequestInfo requestInfo) {
		HolidayResponse holidayRes = new HolidayResponse();
		holidayRes.setHoliday(holidaysList);
		ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
		responseInfo.setStatus(HttpStatus.OK.toString());
		holidayRes.setResponseInfo(responseInfo);
		return new ResponseEntity<HolidayResponse>(holidayRes, HttpStatus.OK);

	}

	private ErrorResponse populateErrors(final BindingResult errors) {
		final ErrorResponse errRes = new ErrorResponse();

		final Error error = new Error();
		error.setCode(1);
		error.setDescription("Error while binding request");
		if (errors.hasFieldErrors())
			for (final FieldError fieldError : errors.getFieldErrors()) {
				error.getFields().put(fieldError.getField(), fieldError.getRejectedValue());
			}
		errRes.setError(error);
		return errRes;
	}

}
