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

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.commons.model.CalendarYear;
import org.egov.commons.service.CalendarYearService;
import org.egov.commons.util.ApplicationConstants;
import org.egov.commons.web.contract.CalendarYearGetRequest;
import org.egov.commons.web.contract.CalendarYearRequest;
import org.egov.commons.web.contract.CalendarYearResponse;
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
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/calendaryears")
public class CalendarYearController {

    private static final Logger logger = LoggerFactory.getLogger(CalendarYearController.class);

    @Autowired
    private CalendarYearService calendarYearService;

    @Autowired
    private ErrorHandler errHandler;

    @Autowired
    private ResponseInfoFactory responseInfoFactory;

    @Autowired
    private ApplicationConstants applicationConstants;

    @PostMapping("_search")
    @ResponseBody
    public ResponseEntity<?> search(@ModelAttribute @Valid final CalendarYearGetRequest calendarYearGetRequest,
            final BindingResult modelAttributeBindingResult, @RequestBody @Valid final RequestInfoWrapper requestInfoWrapper,
            final BindingResult requestBodyBindingResult) {
        final RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();

        // validate input params
        if (modelAttributeBindingResult.hasErrors())
            return errHandler.getErrorResponseEntityForMissingParameters(modelAttributeBindingResult, requestInfo);

        // validate input params
        if (requestBodyBindingResult.hasErrors())
            return errHandler.getErrorResponseEntityForMissingRequestInfo(requestBodyBindingResult, requestInfo);

        // Call service
        List<CalendarYear> calendarYearsList = null;
        try {
            calendarYearsList = calendarYearService.getCalendarYears(calendarYearGetRequest);
        } catch (final Exception exception) {
            logger.error("Error while processing request " + calendarYearGetRequest, exception);
            return errHandler.getResponseEntityForUnexpectedErrors(requestInfo);
        }

        return getSuccessResponse(calendarYearsList, requestInfo);
    }

    @PostMapping("_searchfutureyears")
    @ResponseBody
    public ResponseEntity<?> searchFutureYears(@ModelAttribute @Valid final CalendarYearGetRequest calendarYearGetRequest,
            final BindingResult modelAttributeBindingResult, @RequestBody @Valid final RequestInfoWrapper requestInfoWrapper,
            final BindingResult requestBodyBindingResult) {
        final RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();

        // validate input params
        if (modelAttributeBindingResult.hasErrors())
            return errHandler.getErrorResponseEntityForMissingParameters(modelAttributeBindingResult, requestInfo);

        // validate input params
        if (requestBodyBindingResult.hasErrors())
            return errHandler.getErrorResponseEntityForMissingRequestInfo(requestBodyBindingResult, requestInfo);

        // Call service
        List<CalendarYear> calendarYearsList = null;
        try {
            calendarYearsList = calendarYearService.getFutureYears(calendarYearGetRequest);
        } catch (final Exception exception) {
            logger.error("Error while processing request " + calendarYearGetRequest, exception);
            return errHandler.getResponseEntityForUnexpectedErrors(requestInfo);
        }

        return getSuccessResponse(calendarYearsList, requestInfo);
    }

    @PostMapping(value = "_create")
    @ResponseBody
    public ResponseEntity<?> create(@RequestBody @Valid final CalendarYearRequest calendarYearRequest,
            final BindingResult errors) {

        if (errors.hasErrors()) {
            final ErrorResponse errRes = populateErrors(errors);
            return new ResponseEntity<ErrorResponse>(errRes, HttpStatus.BAD_REQUEST);
        }
        logger.info("calendarYearRequest::" + calendarYearRequest);

        final List<ErrorResponse> errorResponses = validateCalendarYearRequest(calendarYearRequest);
        if (!errorResponses.isEmpty())
            return new ResponseEntity<List<ErrorResponse>>(errorResponses, HttpStatus.BAD_REQUEST);

        final CalendarYear calendarYear = calendarYearService.pushCreateToQueue(calendarYearRequest);

        final List<CalendarYear> calendarYears = new ArrayList<>();
        calendarYears.add(calendarYear);
        return getSuccessResponse(calendarYears, calendarYearRequest.getRequestInfo());
    }

    @PostMapping(value = "/{calendarYearId}/_update")
    @ResponseBody
    public ResponseEntity<?> update(@RequestBody @Valid final CalendarYearRequest calendarYearRequest, final BindingResult errors,
            @PathVariable final Long calendarYearId) {
       
        if (errors.hasErrors()) {
            final ErrorResponse errRes = populateErrors(errors);
            return new ResponseEntity<ErrorResponse>(errRes, HttpStatus.BAD_REQUEST);
        }
        logger.info("calendarYearRequest::" + calendarYearRequest);
        calendarYearRequest.getCalendarYear().setId(calendarYearId);

        final List<ErrorResponse> errorResponses = validateCalendarYearRequest(calendarYearRequest);
        if (!errorResponses.isEmpty())
            return new ResponseEntity<List<ErrorResponse>>(errorResponses, HttpStatus.BAD_REQUEST);

        final CalendarYear calendarYear = calendarYearService.pushUpdateToQueue(calendarYearRequest);

        final List<CalendarYear> calendarYears = new ArrayList<>();
        calendarYears.add(calendarYear);
        return getSuccessResponse(calendarYears, calendarYearRequest.getRequestInfo());
    }

    private ErrorResponse populateErrors(final BindingResult errors) {
        final ErrorResponse errRes = new ErrorResponse();

        final Error error = new Error();
        error.setCode(1);
        error.setDescription("Error while binding request");
        if (errors.hasFieldErrors())
            for (final FieldError fieldError : errors.getFieldErrors())
                error.getFields().put(fieldError.getField(), fieldError.getRejectedValue());
        errRes.setError(error);
        return errRes;
    }

    /**
     * Populate Response object and returns calendarYears List
     *
     * @param calendarYearsList
     * @return
     */
    private ResponseEntity<?> getSuccessResponse(final List<CalendarYear> calendarYearsList, final RequestInfo requestInfo) {
        final CalendarYearResponse calendarYearRes = new CalendarYearResponse();
        calendarYearRes.setCalendarYear(calendarYearsList);
        final ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
        responseInfo.setStatus(HttpStatus.OK.toString());
        calendarYearRes.setResponseInfo(responseInfo);
        return new ResponseEntity<CalendarYearResponse>(calendarYearRes, HttpStatus.OK);

    }

    private List<ErrorResponse> validateCalendarYearRequest(final CalendarYearRequest calendarYearRequest) {        final List<ErrorResponse> errorResponses = new ArrayList<>();
        boolean isCalendarYearExists = false;
        boolean isCalendarYearManadatoryFeilds = true;

        final CalendarYear calendarYear = calendarYearRequest.getCalendarYear();
        if (calendarYear.getName() == null || calendarYear.getTenantId() == null || calendarYear.getStartDate() == null
                || calendarYear.getEndDate() == null
                || calendarYear.getActive() == null)
            isCalendarYearManadatoryFeilds = false;
        else if (calendarYearService.getYearByNameAndId(calendarYear.getId(),calendarYear.getName(), calendarYear.getTenantId()))
            isCalendarYearExists = true;

        if (!isCalendarYearManadatoryFeilds) {
            final ErrorResponse errorResponse = new ErrorResponse();
            final Error error = new Error();
            error.setDescription(
                    applicationConstants
                            .getErrorMessage(ApplicationConstants.MSG_CALENDARYEAR_NAME_START_END_DATE_ACTIVE_MANDATORY));
            errorResponse.setError(error);
            errorResponses.add(errorResponse);
        }

        else if (isCalendarYearExists) {
            final ErrorResponse errorResponse = new ErrorResponse();
            final Error error = new Error();
            error.setDescription(applicationConstants.getErrorMessage(ApplicationConstants.MSG_CALENDARYEAR_EXISTS));
            errorResponse.setError(error);
            errorResponses.add(errorResponse);
        }

        return errorResponses;
    }

}
