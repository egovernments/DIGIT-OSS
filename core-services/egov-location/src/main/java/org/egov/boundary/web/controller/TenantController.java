package org.egov.boundary.web.controller;

import org.egov.boundary.domain.service.TenantService;
import org.egov.boundary.web.contract.RequestInfoWrapper;
import org.egov.boundary.web.contract.TenantResponse;
import org.egov.boundary.web.contract.factory.ResponseInfoFactory;
import org.egov.boundary.web.contract.tenant.model.Tenant;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/location/v11")
public class TenantController {

    private static final Logger LOGGER = LoggerFactory.getLogger(TenantController.class);


    private final TenantService tenantService;

    @Autowired
    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }


    /**
     * Resolves a given latitude / longitude to the corresponding tenant
     *
     * @param lat               Latitude
     * @param lng               Longitude
     * @param baseTenantId      Base tenant, ideally the state
     * @param requestInfoWapper Wrapper containing the Request Info object detailing the request
     * @return 200 - Tenant data for requested lat/lng
     * 400 - Invalid Lat/Lng provided
     */
    @RequestMapping(value = "/tenant/_search", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<TenantResponse> tenantSearchPost(@RequestParam(value = "tenantId") String baseTenantId,
                                                           @RequestParam(value = "lat") final Double lat,
                                                           @RequestParam(value = "lng") final Double lng,
                                                           @Valid @RequestBody RequestInfoWrapper requestInfoWapper) {

        RequestInfo requestInfo = requestInfoWapper.getRequestInfo();
        Tenant tenant = tenantService.resolveTenant(lat, lng, baseTenantId, requestInfo);
        TenantResponse tenantResponse = new TenantResponse(getResponseInfo(requestInfo, HttpStatus.OK), tenant);
        return new ResponseEntity<>(tenantResponse, HttpStatus.OK);

    }

    private ResponseInfo getResponseInfo(RequestInfo requestInfo, HttpStatus status) {
        boolean success = status.is2xxSuccessful();
        ResponseInfo responseInfo = ResponseInfoFactory.createResponseFromRequest(requestInfo, success);
        responseInfo.setStatus(status.toString());
        return responseInfo;
    }

}
