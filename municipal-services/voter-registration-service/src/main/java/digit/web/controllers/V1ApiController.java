package digit.web.controllers;


import digit.utils.ResponseInfoFactory;
import digit.web.models.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import digit.service.VoterRegistrationService;
import digit.web.models.coremodels.RequestInfoWrapper;
import digit.web.models.coremodels.VoterApplicationSearchCriteria;
import io.swagger.annotations.*;
import org.egov.common.contract.response.ResponseInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import javax.validation.Valid;
    import javax.servlet.http.HttpServletRequest;

@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-05-22T11:09:12.469+05:30")

    @Controller
    @RequestMapping("/voter-services")
    public class V1ApiController{

        private final ObjectMapper objectMapper;

        private final HttpServletRequest request;

        private VoterRegistrationService voterRegistrationService;

        @Autowired
        private ResponseInfoFactory responseInfoFactory;

        @Autowired
        public V1ApiController(ObjectMapper objectMapper, HttpServletRequest request, VoterRegistrationService voterRegistrationService) {
            this.objectMapper = objectMapper;
            this.request = request;
            this.voterRegistrationService = voterRegistrationService;
        }

                @RequestMapping(value="/v1/registration/_create", method = RequestMethod.POST)
                public ResponseEntity<VoterRegistrationResponse> v1RegistrationCreatePost(@ApiParam(value = "Details for the new Voter Registration Application(s) + RequestInfo meta data." ,required=true )  @Valid @RequestBody VoterRegistrationRequest voterRegistrationRequest) {
                    List<VoterRegistrationApplication> applications = voterRegistrationService.registerVtRequest(voterRegistrationRequest);
                    ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(voterRegistrationRequest.getRequestInfo(), true);
                    VoterRegistrationResponse response = VoterRegistrationResponse.builder().voterRegistrationApplications(applications).responseInfo(responseInfo).build();
                    return new ResponseEntity<>(response, HttpStatus.OK);
                }

                @RequestMapping(value="/v1/registration/_search", method = RequestMethod.POST)
                public ResponseEntity<VoterRegistrationResponse> v1RegistrationSearchPost(@RequestBody RequestInfoWrapper requestInfoWrapper, @Valid @ModelAttribute VoterApplicationSearchCriteria voterApplicationSearchCriteria) {
                    List<VoterRegistrationApplication> applications = voterRegistrationService.searchVtApplications(requestInfoWrapper.getRequestInfo(), voterApplicationSearchCriteria);
                    ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true);
                    VoterRegistrationResponse response = VoterRegistrationResponse.builder().voterRegistrationApplications(applications).responseInfo(responseInfo).build();
                    return new ResponseEntity<>(response,HttpStatus.OK);
                }

                @RequestMapping(value="/v1/registration/_update", method = RequestMethod.POST)
                public ResponseEntity<VoterRegistrationResponse> v1RegistrationUpdatePost(@ApiParam(value = "Details for the new (s) + RequestInfo meta data." ,required=true )  @Valid @RequestBody VoterRegistrationRequest voterRegistrationRequest) {
                    VoterRegistrationApplication application = voterRegistrationService.updateVtApplication(voterRegistrationRequest);
                    ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(voterRegistrationRequest.getRequestInfo(), true);
                    VoterRegistrationResponse response = VoterRegistrationResponse.builder().voterRegistrationApplications(Collections.singletonList(application)).responseInfo(responseInfo).build();
                    return new ResponseEntity<>(response, HttpStatus.OK);
                }

        }
