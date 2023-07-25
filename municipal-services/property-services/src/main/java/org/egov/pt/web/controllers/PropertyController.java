
package org.egov.pt.web.controllers;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.egov.common.contract.response.ResponseInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.models.oldProperty.OldPropertyCriteria;
import org.egov.pt.service.FuzzySearchService;
import org.egov.pt.service.MigrationService;
import org.egov.pt.service.PropertyEncryptionService;
import org.egov.pt.service.PropertyService;
import org.egov.pt.util.ResponseInfoFactory;
import org.egov.pt.validator.PropertyValidator;
import org.egov.pt.web.contracts.PropertyRequest;
import org.egov.pt.web.contracts.PropertyResponse;
import org.egov.pt.web.contracts.RequestInfoWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/property")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private ResponseInfoFactory responseInfoFactory;

    @Autowired
    private MigrationService migrationService;

    @Autowired
    private PropertyValidator propertyValidator;

    @Autowired
    private PropertyConfiguration configs;

    @Autowired
    FuzzySearchService fuzzySearchService;

    @Autowired
    PropertyEncryptionService propertyEncryptionService;

    @PostMapping("/_create")
    public ResponseEntity<PropertyResponse> create(@Valid @RequestBody PropertyRequest propertyRequest) {

        Property property = propertyService.createProperty(propertyRequest);
        ResponseInfo resInfo = responseInfoFactory.createResponseInfoFromRequestInfo(propertyRequest.getRequestInfo(), true);
        PropertyResponse response = PropertyResponse.builder()
                .properties(Arrays.asList(property))
                .responseInfo(resInfo)
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


    @PostMapping("/_update")
    public ResponseEntity<PropertyResponse> update(@Valid @RequestBody PropertyRequest propertyRequest) {

        Property property = propertyService.updateProperty(propertyRequest);
        ResponseInfo resInfo = responseInfoFactory.createResponseInfoFromRequestInfo(propertyRequest.getRequestInfo(), true);
        PropertyResponse response = PropertyResponse.builder()
                .properties(Arrays.asList(property))
                .responseInfo(resInfo)
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/_search")
    public ResponseEntity<PropertyResponse> search(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
                                                   @Valid @ModelAttribute PropertyCriteria propertyCriteria) {

        // If inbox search has been disallowed at config level or if inbox search is allowed but the current search is NOT, from inbox service validate the search criteria.
        if(!configs.getIsInboxSearchAllowed() || !propertyCriteria.getIsInboxSearch()){
            propertyValidator.validatePropertyCriteria(propertyCriteria, requestInfoWrapper.getRequestInfo());
        }
        
    	List<Property> properties = null;
    	Integer count = 0;
        
        if (propertyCriteria.getIsRequestForCount()) {
        	count = propertyService.count(requestInfoWrapper.getRequestInfo(), propertyCriteria);
        	
        }else {
        	 properties = propertyService.searchProperty(propertyCriteria,requestInfoWrapper.getRequestInfo());
        }
        
        PropertyResponse response = PropertyResponse.builder()
        		.responseInfo(
                        responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
        		.properties(properties)
        		.count(count)
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PostMapping("/_migration")
    public ResponseEntity<?> propertyMigration(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
                                               @Valid @ModelAttribute OldPropertyCriteria propertyCriteria) {
        long startTime = System.nanoTime();
        Map<String, String> resultMap = null;
        Map<String, String> errorMap = new HashMap<>();

        resultMap = migrationService.initiateProcess(requestInfoWrapper,propertyCriteria,errorMap);

        long endtime = System.nanoTime();
        long elapsetime = endtime - startTime;
        System.out.println("Elapsed time--->"+elapsetime);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    @RequestMapping(value = "/_plainsearch", method = RequestMethod.POST)
    public ResponseEntity<PropertyResponse> plainsearch(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
                                                        @Valid @ModelAttribute PropertyCriteria propertyCriteria) {
        List<Property> properties = propertyService.searchPropertyPlainSearch(propertyCriteria, requestInfoWrapper.getRequestInfo());
        PropertyResponse response = PropertyResponse.builder().properties(properties).responseInfo(
                responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
//	@RequestMapping(value = "/_cancel", method = RequestMethod.POST)
//	public ResponseEntity<PropertyResponse> cancel(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
//												   @Valid @ModelAttribute PropertyCancelCriteria propertyCancelCriteria) {
//
//		List<Property> properties = propertyService.cancelProperty(propertyCancelCriteria,requestInfoWrapper.getRequestInfo());
//		PropertyResponse response = PropertyResponse.builder().properties(properties).responseInfo(
//				responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
//				.build();
//		return new ResponseEntity<>(response, HttpStatus.OK);
//	}
    
    @PostMapping("/_addAlternateNumber")
    public ResponseEntity<PropertyResponse> _addAlternateNumber(@Valid @RequestBody PropertyRequest propertyRequest) {    	
        Property property = propertyService.addAlternateNumber(propertyRequest);
        ResponseInfo resInfo = responseInfoFactory.createResponseInfoFromRequestInfo(propertyRequest.getRequestInfo(), true);
        PropertyResponse response = PropertyResponse.builder()
                .properties(Arrays.asList(property))
                .responseInfo(resInfo)
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/fuzzy/_search")
    public ResponseEntity<PropertyResponse> fuzzySearch(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
                                                      @Valid @ModelAttribute PropertyCriteria fuzzySearchCriteria) {

        List<Property> properties = fuzzySearchService.getProperties(requestInfoWrapper.getRequestInfo(), fuzzySearchCriteria);
        PropertyResponse response = PropertyResponse.builder().properties(properties).responseInfo(
                responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Encrypts existing property records
     *
     * @param requestInfoWrapper RequestInfoWrapper
     * @param propertyCriteria PropertyCriteria
     * @return list of updated encrypted data
     */
    /* To be executed only once */
    @RequestMapping(value = "/_encryptOldData", method = RequestMethod.POST)
    public ResponseEntity<PropertyResponse> encryptOldData(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
                                                         @Valid @ModelAttribute PropertyCriteria propertyCriteria) {
        List<Property> properties = propertyEncryptionService.updateOldData(propertyCriteria, requestInfoWrapper.getRequestInfo());
        PropertyResponse response = PropertyResponse.builder().properties(properties).responseInfo(
                        responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
