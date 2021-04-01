package org.egov.boundary.web.controller;

import org.egov.boundary.domain.service.MdmsService;
import org.egov.boundary.web.contract.GeographicalResponse;
import org.egov.boundary.web.contract.Geography;
import org.egov.boundary.web.contract.RequestInfoWrapper;
import org.egov.boundary.web.contract.factory.ResponseInfoFactory;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Handles all requests related to Geographical boundaries by providing appropriate GeoJson and other information
 */

@RestController
@RequestMapping("/location/v11")
public class GeographicalController {

    private static final Logger LOGGER = LoggerFactory.getLogger(GeographicalController.class);


    private final MdmsService mdmsService;

    @Autowired
    public GeographicalController(MdmsService mdmsService) {
        this.mdmsService = mdmsService;
    }

    /**
     * Handles all Geographical information requests associated with a Tenant Id.
     * <p>
     * Http Status code is set based on MDMS Service response.
     * 400 when tenant Id is invalid
     *
     * @param tenantId          State or District, formatted tenant id
     * @param filter            Optional json path filters to be applied
     * @param requestInfoWapper Wrapper containing the Request Info object detailing the request
     * @return Geographical data for requested tenant id, if exists.
     */
    @RequestMapping(value = "/geography/_search", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<GeographicalResponse> geographySearchPost(@RequestParam(value = "tenantId") String tenantId,
                                                                    @RequestParam(value = "filter", required = false) final String
                                                                            filter,
                                                                    @Valid @RequestBody RequestInfoWrapper requestInfoWapper) {

        RequestInfo requestInfo = requestInfoWapper.getRequestInfo();

        Optional<List<Geography>> geographies = mdmsService.fetchGeography(tenantId, filter, requestInfo);

        ResponseInfo responseInfo = getResponseInfo(requestInfo, HttpStatus.OK);
        GeographicalResponse response = new GeographicalResponse(responseInfo, geographies.orElseGet(Collections::emptyList));

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private ResponseInfo getResponseInfo(RequestInfo requestInfo, HttpStatus status) {
        boolean success = status.is2xxSuccessful();
        ResponseInfo responseInfo = ResponseInfoFactory.createResponseFromRequest(requestInfo, success);
        responseInfo.setStatus(status.toString());
        return responseInfo;
    }


}
