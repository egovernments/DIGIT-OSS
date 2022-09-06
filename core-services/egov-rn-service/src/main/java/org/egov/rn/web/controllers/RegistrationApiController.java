package org.egov.rn.web.controllers;

import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.egov.rn.service.RegistrationService;
import org.egov.rn.web.models.RegistrationData;
import org.egov.rn.web.models.RegistrationDetails;
import org.egov.rn.web.models.RegistrationRequest;
import org.egov.rn.web.models.RegistrationResponse;
import org.egov.rn.web.utils.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-08-23T14:53:48.053+05:30")

@Controller
@Slf4j
@RequestMapping("/registration/v1")
public class RegistrationApiController {

    private final RegistrationService registrationService;

    @Autowired
    public RegistrationApiController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @RequestMapping(value = "/_create", method = RequestMethod.POST)
    public ResponseEntity<RegistrationResponse> registrationV1CreatePost(@ApiParam(value = "Details of the registration and org.egov.rn.web.models.web.RequestInfo meta data.", required = true)
                                                                             @Valid @RequestBody RegistrationRequest registrationRequest) {
        log.info("Request received on controller with payload {}", registrationRequest);
        RegistrationDetails registrationDetails = registrationService.register(registrationRequest);
        log.info("Returning registration details {}", registrationDetails);
        return ResponseEntity.ok(RegistrationResponse.builder()
                        .responseInfo(ModelMapper.map(registrationRequest.getRequestInfo(), true))
                .registrationDetails(registrationDetails).build());
    }

    @RequestMapping(value = "/_list/{registrationId}", method = RequestMethod.GET)
    public ResponseEntity<RegistrationData> getRegistrationById(@PathVariable("registrationId") String registrationId) {
        RegistrationData registrationData = registrationService.getRegistrationBy(registrationId);
        return ResponseEntity.ok(registrationData);
    }

    @RequestMapping(value = "/_list", method = RequestMethod.GET)
    public ResponseEntity<List<RegistrationData>> getAllRegistration() {
        return ResponseEntity.ok(registrationService.getAllRegistration());
    }

    @RequestMapping(value = "/_search", method = RequestMethod.GET)
    public ResponseEntity<List<RegistrationData>> getResgistrationOnCriteria(@RequestParam(required = true) Long lastModifiedTime) {
        return ResponseEntity.ok(registrationService.getRegistrationPast(lastModifiedTime));
    }

}
