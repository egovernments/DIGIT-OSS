package egov.casemanagement.web.controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import egov.casemanagement.service.CaseService;
import egov.casemanagement.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;

@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2020-05-27T12:33:33.069+05:30")

@Controller
@RequestMapping("/case/v1")
public class CaseApiController {

    private final ObjectMapper objectMapper;

    private final HttpServletRequest request;

    private CaseService caseService;

    @Autowired
    public CaseApiController(ObjectMapper objectMapper, HttpServletRequest request, CaseService caseService) {
        this.objectMapper = objectMapper;
        this.request = request;
        this.caseService = caseService;
    }


    @RequestMapping(value = "/_create", method = RequestMethod.POST)
    public ResponseEntity<Void> createCase(@Valid @RequestBody CaseCreateRequest body) {
        caseService.createCase(body);
        return new ResponseEntity<Void>(HttpStatus.OK);
    }

    @RequestMapping(value = "/_search", method = RequestMethod.POST)
    public ResponseEntity<CaseSearchResponse> searchCases(@Valid @RequestBody CaseSearchRequest body) {

        List<ModelCase> cases =  caseService.searchCases(body);

        return new ResponseEntity<CaseSearchResponse>( new CaseSearchResponse(cases),HttpStatus.OK);
    }

    @RequestMapping(value = "/_update", method = RequestMethod.POST)
    public ResponseEntity<Void> updateCase(@Valid @RequestBody CaseUpdateRequest body) {
        caseService.updateCase(body);
        return new ResponseEntity<Void>(HttpStatus.OK);
    }

    @RequestMapping(value = "/getDefaulterCases", method = RequestMethod.POST)
    public ResponseEntity<CaseSearchResponse> getDefaulterCases(@RequestParam String tenantId) {
        List<ModelCase> cases = caseService.getDefaulterCases(tenantId);
        return new ResponseEntity<CaseSearchResponse>( new CaseSearchResponse(cases),HttpStatus.OK);
    }


}
