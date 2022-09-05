package org.egov.rn.web.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiParam;
import org.egov.rn.service.DHIS2Service;
import org.egov.rn.service.dhis2.requests.CampaginDataEntryRequest;
import org.egov.rn.service.dhis2.requests.CreateCampaginRequest;
import org.egov.rn.service.dhis2.requests.DHis2Dataset;
import org.egov.rn.service.dhis2.responses.CampaginDataEntryResponse;
import org.egov.rn.service.dhis2.responses.CampaginResponse;
import org.egov.rn.service.dhis2.responses.DHis2DatasetResponse;
import org.egov.rn.service.dhis2.responses.dataentries.StoredCampaginDataEntryResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-08-23T14:53:48.053+05:30")

@Controller
@RequestMapping("/dhis2")
public class DHIS2ApiController {

    private final ObjectMapper objectMapper;

    private final HttpServletRequest request;

    private DHIS2Service dhis2Service;


    @Autowired
    public DHIS2ApiController(ObjectMapper objectMapper, HttpServletRequest request, DHIS2Service dhis2Service) {
        this.objectMapper = objectMapper;
        this.request = request;
        this.dhis2Service = dhis2Service;
    }

    @RequestMapping(value = "/v1/campaigns/_list", method = RequestMethod.GET)
    public ResponseEntity<List<CampaginResponse>> getListOfDatasets() {
        return ResponseEntity.ok(dhis2Service.getCampagins());
    }

    @RequestMapping(value = "/v1/campaigns/dhis2/_list", method = RequestMethod.GET)
    public ResponseEntity<List<DHis2Dataset>> getListOfDatasetsInDhis2Format() {
        return ResponseEntity.ok(dhis2Service.getCampaginsInDhis2Format());
    }

    @RequestMapping(value = "/v1/campaigns/_create", method = RequestMethod.POST)
    public ResponseEntity<DHis2DatasetResponse> getFromApi(@ApiParam(required = true)
                                                 @Valid @RequestBody CreateCampaginRequest campaginRequest) {
        return ResponseEntity.ok(dhis2Service.createCampaign(campaginRequest));
    }

    @RequestMapping(value = "/v1/campaigns/{campaginId}/data/_create", method = RequestMethod.POST)
    public ResponseEntity<CampaginDataEntryResponse> createDataEntryForCampagin(@ApiParam(required = true)
                                                                               @PathVariable("campaginId") String campaginId,
                                                                                @Valid @RequestBody CampaginDataEntryRequest entryRequest) {

        return ResponseEntity.ok(dhis2Service.createDataEntry(campaginId,entryRequest));
    }

    @RequestMapping(value = "/v1/campaigns/{campaginId}/data/_list", method = RequestMethod.GET)
    public ResponseEntity<StoredCampaginDataEntryResponse> getDataEntry(@RequestParam(required = true) String orgUnit,
                                                                        @RequestParam(required = true) String startDate,
                                                                        @RequestParam(required = true) String endDate,
                                                                        @PathVariable("campaginId") String campaginId){
        return ResponseEntity.ok(dhis2Service.getDhis2DataEntires(orgUnit,campaginId,startDate,endDate));
    }

    @RequestMapping(value = "/v1/forms/mappings", method = RequestMethod.GET)
    public ResponseEntity<Map<String, Object>> getFormsMappings() throws IOException {
        File file = ResourceUtils.getFile("classpath:formFieldsConfig.json");
        String config = new String(Files.readAllBytes(file.toPath()));
        Map<String, Object> mapping = new ObjectMapper().readValue(config, HashMap.class);
        return ResponseEntity.ok((Map<String, Object>)mapping.get("form"));
    }


}


