package org.egov.rn.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiParam;
import org.egov.rn.utils.UuidProvider;
import org.egov.rn.web.models.RegistrationRequest;
import org.egov.rn.web.models.RegistrationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.UUID;

@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-08-23T14:53:48.053+05:30")

@Controller
@RequestMapping("/egov-rn-service")
public class RegistrationApiController {

    private final ObjectMapper objectMapper;

    private final HttpServletRequest request;

    private UuidProvider uuidProvider;

    @Autowired
    public RegistrationApiController(ObjectMapper objectMapper, HttpServletRequest request, UuidProvider uuidProvider) {
        this.objectMapper = objectMapper;
        this.request = request;
        this.uuidProvider = uuidProvider;
    }

    @RequestMapping(value = "/registration/v1/_create", method = RequestMethod.POST)
    public ResponseEntity<RegistrationResponse> registrationV1CreatePost(@ApiParam(value = "Details of the registration and org.egov.rn.web.models.web.RequestInfo meta data.", required = true)
                                                                             @Valid @RequestBody RegistrationRequest registrationRequest) {
        String registrationId = uuidProvider.uuid().toString();
        return ResponseEntity.ok(RegistrationResponse.builder().registrationId(registrationId).build());
    }

}
