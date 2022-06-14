package org.egov.vendor.web.controller;


import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.vendor.service.VendorService;
import org.egov.vendor.util.ResponseInfoFactory;
import org.egov.vendor.util.VendorUtil;
import org.egov.vendor.web.model.RequestInfoWrapper;
import org.egov.vendor.web.model.Vendor;
import org.egov.vendor.web.model.VendorRequest;
import org.egov.vendor.web.model.VendorResponse;
import org.egov.vendor.web.model.VendorSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/v1")
public class VendorController {

	@Autowired
	private VendorService vendorService;
	
	@Autowired
	private VendorUtil vendorUtil;
	
	@Autowired
	private ResponseInfoFactory responseInfoFactory;

	
	@PostMapping(value = "/_create")
	public ResponseEntity<VendorResponse> create(@Valid @RequestBody VendorRequest vendorRequest){
		vendorUtil.defaultJsonPathConfig();		
		Vendor vendor =  vendorService.create(vendorRequest);
		List<Vendor> vendorList = new ArrayList<Vendor>();
		vendorList.add(vendor);
		VendorResponse response = VendorResponse.builder().vendor(vendorList)
				.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(vendorRequest.getRequestInfo(), true))
				.build();
		
		return new ResponseEntity<>(response,HttpStatus.OK);
		
	}
	
	@PostMapping(value = "/_update")
	public ResponseEntity<VendorResponse> update(@Valid @RequestBody VendorRequest vendorRequest){
		vendorUtil.defaultJsonPathConfig();		
		Vendor vendor =  vendorService.update(vendorRequest);
		List<Vendor> vendorList = new ArrayList<Vendor>();
		vendorList.add(vendor);
		VendorResponse response = VendorResponse.builder().vendor(vendorList)
				.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(vendorRequest.getRequestInfo(), true))
				.build();
		
		return new ResponseEntity<>(response,HttpStatus.OK);
		
	}
	
	
	
	@PostMapping(value = "/_search")
	public ResponseEntity<VendorResponse> search(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@Valid @ModelAttribute VendorSearchCriteria criteria){
		VendorResponse response = vendorService.vendorsearch(criteria, requestInfoWrapper.getRequestInfo());
		response.setResponseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true));
		return new ResponseEntity<>(response, HttpStatus.OK);
		
	}
	
	@RequestMapping(value = "/_plainsearch", method = RequestMethod.POST)
	public ResponseEntity<VendorResponse> plainsearch(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@Valid @ModelAttribute VendorSearchCriteria criteria) {
		List<Vendor> vendorList = vendorService.vendorPlainSearch(criteria,requestInfoWrapper.getRequestInfo());
		VendorResponse response = VendorResponse.builder().vendor(vendorList).responseInfo(
				responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
