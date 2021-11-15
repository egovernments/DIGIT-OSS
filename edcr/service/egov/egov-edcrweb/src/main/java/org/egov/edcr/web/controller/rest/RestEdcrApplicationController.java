/*
 * eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) <2017>  eGovernments Foundation
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
 *      Further, all user interfaces, including but not limited to citizen facing interfaces,
 *         Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *         derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *      For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *      For any further queries on attribution, including queries on brand guidelines,
 *         please contact contact@egovernments.org
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

package org.egov.edcr.web.controller.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.egov.common.entity.dcr.helper.ErrorDetail;
import org.egov.common.entity.edcr.Plan;
import org.egov.commons.mdms.BpaMdmsUtil;
import org.egov.commons.mdms.config.MdmsConfiguration;
import org.egov.commons.mdms.validator.MDMSValidator;
import org.egov.edcr.contract.ComparisonDetail;
import org.egov.edcr.contract.ComparisonRequest;
import org.egov.edcr.contract.ComparisonResponse;
import org.egov.edcr.contract.EdcrDetail;
import org.egov.edcr.contract.EdcrRequest;
import org.egov.edcr.contract.EdcrResponse;
import org.egov.edcr.contract.PlanResponse;
import org.egov.edcr.entity.ApplicationType;
import org.egov.edcr.service.EdcrRestService;
import org.egov.edcr.service.EdcrValidator;
import org.egov.edcr.service.OcComparisonService;
import org.egov.edcr.service.PlanService;
import org.egov.infra.microservice.contract.RequestInfoWrapper;
import org.egov.infra.microservice.contract.ResponseInfo;
import org.egov.infra.microservice.models.RequestInfo;
import org.egov.infra.microservice.models.UserInfo;
import org.egov.infra.utils.FileStoreUtils;
import org.egov.infra.utils.StringUtils;
import org.egov.infra.web.rest.error.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

@RestController
@RequestMapping(value = "/rest/dcr")
public class RestEdcrApplicationController {

    private static final String INVALID_JSON_FORMAT = "Invalid JSON Data";
    private static final String INCORRECT_REQUEST = "INCORRECT_REQUEST";
    private static final String DIGIT_DCR = "Digit DCR";
    private static final String USER_INFO_HEADER_NAME = "x-user-info";
    
    private static final Logger LOGGER = LoggerFactory.getLogger(RestEdcrApplicationController.class);

    @Autowired
    private EdcrRestService edcrRestService;

    @Autowired
    private PlanService planService;

    @Autowired
    protected FileStoreUtils fileStoreUtils;

    @Autowired
    private MdmsConfiguration mdmsConfiguration;

    @Autowired
    private MDMSValidator mDMSValidator;

    @Autowired
    private BpaMdmsUtil bpaMdmsUtil;

    @Autowired
    private OcComparisonService ocComparisonService;

    @Autowired
    private EdcrValidator edcrValidator;

    @PostMapping(value = "/scrutinizeplan", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> scrutinizePlan(@RequestBody MultipartFile planFile,
            @RequestParam String edcrRequest) {
        EdcrDetail edcrDetail = new EdcrDetail();
        EdcrRequest edcr = new EdcrRequest();
        boolean isValid = isValidJson(edcrRequest);
        if (!isValid) {
            ErrorResponse error = new ErrorResponse(INCORRECT_REQUEST, INVALID_JSON_FORMAT,
                    HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
        try {
            edcr = new ObjectMapper().readValue(edcrRequest, EdcrRequest.class);
            ErrorDetail edcRes = edcrValidator.validate(edcr);
            if (edcRes != null && StringUtils.isNotBlank(edcRes.getErrorMessage()))
                return new ResponseEntity<>(edcRes, HttpStatus.BAD_REQUEST);
            ErrorDetail errorResponses = (edcrRestService.validateEdcrRequest(edcr, planFile));
            if (errorResponses != null)
                return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);
            else {
                edcrDetail = edcrRestService.createEdcr(edcr, planFile, new HashMap<>());
            }

        } catch (IOException e) {
            ErrorResponse error = new ErrorResponse(INCORRECT_REQUEST, e.getLocalizedMessage(),
                    HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
        return getSuccessResponse(Arrays.asList(edcrDetail), edcr.getRequestInfo());
    }

    @PostMapping(value = "/scrutinizeocplan", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> scrutinizeOccupancyPlan(@RequestBody MultipartFile planFile,
            @RequestParam String edcrRequest) {
        EdcrDetail edcrDetail = new EdcrDetail();
        EdcrRequest edcr = new EdcrRequest();
        boolean isValid = isValidJson(edcrRequest);
        if (!isValid) {
            ErrorResponse error = new ErrorResponse(INCORRECT_REQUEST, INVALID_JSON_FORMAT,
                    HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
        try {
            edcr = new ObjectMapper().readValue(edcrRequest, EdcrRequest.class);
            ErrorDetail edcRes = edcrValidator.validate(edcr);
            if (edcRes != null && StringUtils.isNotBlank(edcRes.getErrorMessage()))
                return new ResponseEntity<>(edcRes, HttpStatus.BAD_REQUEST);
            ErrorDetail errorResponses = (edcrRestService.validateEdcrOcRequest(edcr, planFile));

            if (errorResponses != null)
                return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);
            else {
                edcr.setAppliactionType(ApplicationType.OCCUPANCY_CERTIFICATE.toString());

                edcrDetail = edcrRestService.createEdcr(edcr, planFile, new HashMap<>());
            }

        } catch (IOException e) {
            ErrorResponse error = new ErrorResponse(INCORRECT_REQUEST, e.getLocalizedMessage(),
                    HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
        return getSuccessResponse(Arrays.asList(edcrDetail), edcr.getRequestInfo());
    }

    @PostMapping(value = "/scrutinize", consumes = { MediaType.APPLICATION_JSON_UTF8_VALUE,
            MediaType.MULTIPART_FORM_DATA_VALUE }, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> scrutinize(@RequestPart("planFile") MultipartFile planFile,
            @RequestParam("edcrRequest") String edcrRequest, final HttpServletRequest request) {
        String userInfo = request.getHeader(USER_INFO_HEADER_NAME);
        LOGGER.info("###User Info####"+userInfo);
        EdcrDetail edcrDetail = new EdcrDetail();
        EdcrRequest edcr = new EdcrRequest();
        if (!isValidJson(edcrRequest) || (userInfo != null && !isValidJson(userInfo))) {
            ErrorResponse error = new ErrorResponse(INCORRECT_REQUEST, INVALID_JSON_FORMAT,
                    HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
        try {
            List<ErrorDetail> errorResponses = new ArrayList<ErrorDetail>();
            edcr = new ObjectMapper().readValue(edcrRequest, EdcrRequest.class);
            if(userInfo != null) {
                UserInfo userInfoReq = new ObjectMapper().readValue(userInfo, UserInfo.class);
                UserInfo enrichUser = new UserInfo();
                enrichUser.setId(userInfoReq.getId());
                enrichUser.setUuid(userInfoReq.getUuid());
                enrichUser.setMobile(userInfoReq.getMobile());
                enrichUser.setTenantId(userInfoReq.getTenantId());
                edcr.getRequestInfo().setUserInfo(enrichUser);
            }
            ErrorDetail edcRes = edcrValidator.validate(edcr);
            if (edcRes != null && StringUtils.isNotBlank(edcRes.getErrorMessage()))
                return new ResponseEntity<>(edcRes, HttpStatus.BAD_REQUEST);
            List<ErrorDetail> errors = edcrRestService.validateEdcrMandatoryFields(edcr);
            if (!errors.isEmpty())
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);

            String applicationType = edcr.getAppliactionType();
            String serviceType = edcr.getApplicationSubType();
            Map<String, List<Object>> masterData = new HashMap<>();
            Boolean mdmsEnabled = mdmsConfiguration.getMdmsEnabled();
            if (mdmsEnabled != null && mdmsEnabled) {
                Object mdmsData = bpaMdmsUtil.mDMSCall(new RequestInfo(), edcr.getTenantId());
                HashMap<String, String> data = new HashMap<>();
                data.put("applicationType", applicationType);
                data.put("serviceType", serviceType);
                masterData = mDMSValidator.getAttributeValues(mdmsData, "BPA");
                List<ErrorDetail> mdmsErrors = mDMSValidator.validateMdmsData(masterData, data);
                if (!mdmsErrors.isEmpty())
                    return new ResponseEntity<>(mdmsErrors, HttpStatus.BAD_REQUEST);

                if ("BUILDING_OC_PLAN_SCRUTINY".equalsIgnoreCase(applicationType)) {
                    edcr.setAppliactionType(ApplicationType.OCCUPANCY_CERTIFICATE.toString());
                    errorResponses = edcrRestService.validateScrutinizeOcRequest(edcr, planFile);
                } else if ("BUILDING_PLAN_SCRUTINY".equalsIgnoreCase(applicationType)) {
                    ErrorDetail validateEdcrRequest = edcrRestService.validateEdcrRequest(edcr, planFile);
                    if (validateEdcrRequest != null)
                        errorResponses = Arrays.asList(validateEdcrRequest);

                    edcr.setAppliactionType(ApplicationType.PERMIT.toString());
                }

            } else {
                if ("BUILDING_OC_PLAN_SCRUTINY".equalsIgnoreCase(applicationType)) {
                    edcr.setAppliactionType(ApplicationType.OCCUPANCY_CERTIFICATE.toString());
                    errorResponses = (edcrRestService.validateScrutinizeOcRequest(edcr, planFile));
                } else if ("BUILDING_PLAN_SCRUTINY".equalsIgnoreCase(applicationType)) {
                    ErrorDetail validateEdcrRequest = edcrRestService.validateEdcrRequest(edcr, planFile);
                    if (validateEdcrRequest != null)
                        errorResponses = Arrays.asList(validateEdcrRequest);

                    edcr.setAppliactionType(ApplicationType.PERMIT.toString());
                }
            }

            if (!errorResponses.isEmpty())
                return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);
            else {
                edcrDetail = edcrRestService.createEdcr(edcr, planFile, masterData);
            }

        } catch (IOException e) {
            ErrorResponse error = new ErrorResponse(INCORRECT_REQUEST, e.getLocalizedMessage(),
                    HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
        return getSuccessResponse(Arrays.asList(edcrDetail), edcr.getRequestInfo());
    }

    @PostMapping(value = "/scrutinydetails", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> scrutinyDetails(@ModelAttribute EdcrRequest edcrRequest,
            @RequestBody @Valid RequestInfoWrapper requestInfoWrapper) {
        ErrorDetail edcReqRes = edcrValidator.validate(edcrRequest);
        if (edcReqRes != null && StringUtils.isNotBlank(edcReqRes.getErrorMessage()))
            return new ResponseEntity<>(edcReqRes, HttpStatus.BAD_REQUEST);
        ErrorDetail edcRes = edcrValidator.validate(requestInfoWrapper);
        if (edcRes != null && StringUtils.isNotBlank(edcRes.getErrorMessage()))
            return new ResponseEntity<>(edcRes, HttpStatus.BAD_REQUEST);
        List<EdcrDetail> edcrDetail = edcrRestService.fetchEdcr(edcrRequest, requestInfoWrapper);
        Integer count = edcrRestService.fetchCount(edcrRequest, requestInfoWrapper);
        if (!edcrDetail.isEmpty() && edcrDetail.get(0).getErrors() != null) {
            return new ResponseEntity<>(edcrDetail.get(0).getErrors(), HttpStatus.OK);
        } else {
            return getSuccessResponse(edcrDetail, requestInfoWrapper.getRequestInfo(), count);
        }
    }

    @PostMapping(value = "/extractplan", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> planDetails(@RequestBody MultipartFile planFile,
            @RequestParam String edcrRequest) {
        Plan plan = new Plan();
        EdcrRequest edcr = new EdcrRequest();
        boolean isValid = isValidJson(edcrRequest);
        if (!isValid) {
            ErrorResponse error = new ErrorResponse(INCORRECT_REQUEST, INVALID_JSON_FORMAT,
                    HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
        try {
            edcr = new ObjectMapper().readValue(edcrRequest, EdcrRequest.class);
            ErrorDetail edcRes = edcrValidator.validate(edcr);
            if (edcRes != null && StringUtils.isNotBlank(edcRes.getErrorMessage()))
                return new ResponseEntity<>(edcRes, HttpStatus.BAD_REQUEST);
            ErrorDetail errorResponses = edcrRestService.validatePlanFile(planFile);
            if (errorResponses != null)
                return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);
            else {
                plan = planService.extractPlan(edcr, planFile);
            }
        } catch (IOException e) {
            ErrorResponse error = new ErrorResponse(INCORRECT_REQUEST, e.getLocalizedMessage(),
                    HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        String jsonRes = "";
        try {
            jsonRes = mapper.writeValueAsString(plan);
        } catch (JsonProcessingException e) {
            return new ResponseEntity<>(e, HttpStatus.BAD_REQUEST);
        }
        return getPlanSuccessResponse(jsonRes, edcr.getRequestInfo());
    }

    @GetMapping("/downloadfile")
    public ResponseEntity<InputStreamResource> download(@RequestParam final String fileStoreId) {
        return fileStoreUtils.fileAsResponseEntity(fileStoreId, DIGIT_DCR, true);
    }

    private ResponseEntity<?> getSuccessResponse(List<EdcrDetail> edcrDetails, RequestInfo requestInfo) {
        EdcrResponse edcrRes = new EdcrResponse();
        edcrRes.setEdcrDetail(edcrDetails);
        ResponseInfo responseInfo = edcrRestService.createResponseInfoFromRequestInfo(requestInfo, true);
        edcrRes.setResponseInfo(responseInfo);
        return new ResponseEntity<>(edcrRes, HttpStatus.OK);

    }
    
    private ResponseEntity<?> getSuccessResponse(List<EdcrDetail> edcrDetails, RequestInfo requestInfo, Integer count) {
        EdcrResponse edcrRes = new EdcrResponse();
        edcrRes.setEdcrDetail(edcrDetails);
        edcrRes.setCount(count);
        ResponseInfo responseInfo = edcrRestService.createResponseInfoFromRequestInfo(requestInfo, true);
        edcrRes.setResponseInfo(responseInfo);
        return new ResponseEntity<>(edcrRes, HttpStatus.OK);

    }

    private ResponseEntity<?> getPlanSuccessResponse(String jsonRes, RequestInfo requestInfo) {
        PlanResponse planRes = new PlanResponse();
        Plan plan;
        try {
            plan = new ObjectMapper().readValue(jsonRes, Plan.class);
        } catch (IOException e) {
            return new ResponseEntity<>(e, HttpStatus.BAD_REQUEST);
        }
        planRes.setPlan(plan);
        ResponseInfo responseInfo = edcrRestService.createResponseInfoFromRequestInfo(requestInfo, true);
        planRes.setResponseInfo(responseInfo);
        return new ResponseEntity<>(planRes, HttpStatus.OK);
    }

    @ExceptionHandler(Exception.class)
    public final ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        String errorDesc;
        if (ex.getLocalizedMessage() == null)
            errorDesc = String.valueOf(ex).length() <= 200 ? String.valueOf(ex).substring(0, String.valueOf(ex).length())
                    : String.valueOf(ex).substring(1, 200);
        else
            errorDesc = ex.getMessage();
        ErrorResponse error = new ErrorResponse("Internal Server Error", errorDesc,
                HttpStatus.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping(value = "/occomparison", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> ocComparisonReport(@ModelAttribute ComparisonRequest comparisonRequest,
            @RequestBody @Valid RequestInfoWrapper requestInfoWrapper) {
        ErrorDetail comparision = edcrValidator.validate(comparisonRequest);
        if (comparision != null && StringUtils.isNotBlank(comparision.getErrorMessage()))
            return new ResponseEntity<>(comparision, HttpStatus.BAD_REQUEST);
        ErrorDetail edcRes = edcrValidator.validate(requestInfoWrapper);
        if (edcRes != null && StringUtils.isNotBlank(edcRes.getErrorMessage()))
            return new ResponseEntity<>(edcRes, HttpStatus.BAD_REQUEST);

        List<ErrorDetail> errors = ocComparisonService.validateEdcrMandatoryFields(comparisonRequest);
        if (!errors.isEmpty())
            return new ResponseEntity<>(errors, HttpStatus.OK);

        ComparisonDetail comparisonDetail = ocComparisonService.process(comparisonRequest);

        if (comparisonDetail.getErrors() != null && !comparisonDetail.getErrors().isEmpty())
            return new ResponseEntity<>(comparisonDetail.getErrors(), HttpStatus.OK);

        return getComparisonSuccessResponse(comparisonDetail, requestInfoWrapper.getRequestInfo());
    }

    private ResponseEntity<?> getComparisonSuccessResponse(ComparisonDetail comparisonDetail, RequestInfo requestInfo) {
        ComparisonResponse comparisonResponse = new ComparisonResponse();
        comparisonResponse.setComparisonDetail(comparisonDetail);
        ResponseInfo responseInfo = edcrRestService.createResponseInfoFromRequestInfo(requestInfo, true);
        comparisonResponse.setResponseInfo(responseInfo);
        return new ResponseEntity<>(comparisonResponse, HttpStatus.OK);

    }

    private static boolean isValidJson(String json) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            objectMapper.readTree(json);
        } catch (IOException e) {
            return false;
        }
        return true;
    }

}