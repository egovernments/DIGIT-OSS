package org.egov.vendor.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.vendor.repository.VendorRepository;
import org.egov.vendor.validator.VendorValidator;
import org.egov.vendor.web.model.Vendor;
import org.egov.vendor.web.model.VendorRequest;
import org.egov.vendor.web.model.VendorSearchCriteria;
import org.egov.vendor.web.model.user.User;
import org.egov.vendor.web.model.user.UserDetailResponse;
import org.egov.vendor.web.model.vehicle.Vehicle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class VendorService {

	@Autowired
	private VendorRepository vendorRepository;

	@Autowired
	private VendorValidator vendorValidator;

	@Autowired
	private VendorRepository repository;


	@Autowired
	private EnrichmentService enrichmentService;
	
	@Autowired
	private VehicleService vehicleService;
	
	@Autowired
	private UserService userService;
	

	public Vendor create(VendorRequest vendorRequest) {
		RequestInfo requestInfo = vendorRequest.getRequestInfo();
		String tenantId = vendorRequest.getVendor().getTenantId().split("\\.")[0];
		if (vendorRequest.getVendor().getTenantId().split("\\.").length == 1) {
			throw new CustomException("Invalid TenantId", " Application cannot be create at StateLevel");
		}

		vendorValidator.validateCreate(vendorRequest);
		enrichmentService.enrichCreate(vendorRequest);
		vendorRepository.save(vendorRequest);
		return vendorRequest.getVendor();

	}

	public List<Vendor> Vendorsearch(VendorSearchCriteria criteria, RequestInfo requestInfo) {

		List<Vendor> vendorList = new LinkedList<>();
		List<String> uuids = new ArrayList<String>();
		UserDetailResponse userDetailResponse;
		
		vendorValidator.validateSearch(requestInfo, criteria);
		
		if( criteria.getMobileNumber() !=null) {
			userDetailResponse = userService.getOwner(criteria,requestInfo);
			if(userDetailResponse !=null && userDetailResponse.getUser() != null && userDetailResponse.getUser().size() >0) {
				uuids = userDetailResponse.getUser().stream().map(User::getUuid).collect(Collectors.toList());
				if(CollectionUtils.isEmpty(criteria.getOwnerIds())) {
					criteria.setOwnerIds(uuids);
				}else {
					criteria.getOwnerIds().addAll(uuids);
				}
			}
		}
		
		if(!CollectionUtils.isEmpty(criteria.getVehicleRegistrationNumber()) || StringUtils.hasLength(criteria.getVehicleType())) {
			List<Vehicle> vehicles = vehicleService.getVehicles(null, criteria.getVehicleRegistrationNumber(), criteria.getVehicleType(), requestInfo, criteria.getTenantId());
			if(CollectionUtils.isEmpty(vehicles)) {
				return new ArrayList<Vendor>();
			}
			if(CollectionUtils.isEmpty(criteria.getVehicleIds())) {
				criteria.setVehicleIds(vehicles.stream().map(Vehicle::getId).collect(Collectors.toList()));
			}else {
				criteria.getVehicleIds().addAll(vehicles.stream().map(Vehicle::getId).collect(Collectors.toList()));
			}
			
			
		}
		
		if(!CollectionUtils.isEmpty(criteria.getVehicleIds())) {
			List<String> vendorIds  = repository.getVendorWithVehicles(criteria.getVehicleIds());
			if(CollectionUtils.isEmpty(vendorIds)) {
				return new ArrayList<Vendor>();
			}else {
				if(CollectionUtils.isEmpty(criteria.getIds())) {
					criteria.setIds(vendorIds);
				}else {
					criteria.getIds().addAll(vendorIds);
				}					
			}
		}
		
		vendorList = repository.getVendorData(criteria);
		if (!vendorList.isEmpty()) {
			enrichmentService.enrichVendorSearch(vendorList, requestInfo, criteria.getTenantId());
		}
		

		if (vendorList.isEmpty()) {
			return Collections.emptyList();
		}

		return vendorList;

	}

}
