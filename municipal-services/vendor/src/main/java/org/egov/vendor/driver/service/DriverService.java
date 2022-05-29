package org.egov.vendor.driver.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.vendor.driver.repository.DriverRepository;
import org.egov.vendor.driver.validator.DriverValidator;
import org.egov.vendor.driver.web.model.Driver;
import org.egov.vendor.driver.web.model.DriverRequest;
import org.egov.vendor.driver.web.model.DriverSearchCriteria;
import org.egov.vendor.driver.web.util.DriverConstants;
import org.egov.vendor.driver.web.util.DriverUtil;
import org.egov.vendor.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DriverService {

	@Autowired
	private DriverUtil util;

	@Autowired
	private DriverRepository repository;

	@Autowired
	private DriverValidator driverValidator;

	@Autowired
	private EnrichmentService enrichmentService;

	@Autowired
	private UserService userService;

//	@Autowired
//	private DriverConfiguration config;

	public Driver create(DriverRequest driverRequest) {
		RequestInfo requestInfo = driverRequest.getRequestInfo();
		String tenantId = driverRequest.getDriver().getTenantId().split("\\.")[0];
		if (driverRequest.getDriver().getTenantId().split("\\.").length == 1) {
			throw new CustomException("Invalid TenantId", " Application cannot be create at StateLevel");
		}
		// Object mdmsData = util.mDMSCall(requestInfo, tenantId);
		// vendorValidator.validateCreateOrUpdateRequest(driverRequest, mdmsData,true);
		enrichmentService.enrichCreate(driverRequest);
		repository.save(driverRequest);
		return driverRequest.getDriver();

	}

	public Driver update(DriverRequest driverRequest) {
		RequestInfo requestInfo = driverRequest.getRequestInfo();
		String tenantId = driverRequest.getDriver().getTenantId().split("\\.")[0];

		if (driverRequest.getDriver().getTenantId().split("\\.").length == 1) {
			throw new CustomException("Invalid TenantId", " Application cannot be updated at StateLevel");
		}

		if (driverRequest.getDriver() != null && driverRequest.getDriver().getId() == null) {
			throw new CustomException(DriverConstants.UPDATE_ERROR,
					"Driver Not found in the System" + driverRequest.getDriver().getName());
		}

		DriverSearchCriteria criteria = new DriverSearchCriteria();
		criteria.setTenantId(driverRequest.getDriver().getTenantId());
		criteria.setIds(Arrays.asList(driverRequest.getDriver().getId()));

		List<Driver> existingDriverResult = driversearch(criteria, requestInfo);

		if (existingDriverResult.size() <= 0) {
			throw new CustomException(DriverConstants.UPDATE_ERROR,
					"Driver Not found in the System" + driverRequest.getDriver().getName());
		}
		if (existingDriverResult.size() > 1) {
			throw new CustomException(DriverConstants.UPDATE_ERROR,
					"Found multiple application(s)" + driverRequest.getDriver().getName());
		}

		Driver oldDriver = existingDriverResult.get(0);
		if (!oldDriver.getOwnerId().equalsIgnoreCase(driverRequest.getDriver().getOwnerId())) {
			throw new CustomException(DriverConstants.UPDATE_ERROR,
					"OwnerId mismatch between the update request and existing Driver record"
							+ driverRequest.getDriver().getName());
		}

//		if (oldDriver.getOwner() != null && driverRequest.getDriver().getOwner() != null && !oldDriver.getOwner()
//				.getMobileNumber().equalsIgnoreCase(driverRequest.getDriver().getOwner().getMobileNumber())) {
//			throw new CustomException(DriverConstants.UPDATE_ERROR,
//					"Mobile number update is not allowed" + driverRequest.getDriver().getOwner().getMobileNumber());
//		};

		Object mdmsData = util.mDMSCall(requestInfo, tenantId);
		// driverValidator.validateCreateOrUpdateRequest(driverRequest, mdmsData,false);
		enrichmentService.enrichUpdate(driverRequest);
		repository.update(driverRequest);
		return driverRequest.getDriver();

	}

	public List<Driver> driversearch(DriverSearchCriteria criteria, RequestInfo requestInfo) {

		List<Driver> driverList = new LinkedList<>();
		List<String> uuids = new ArrayList<String>();
//		UserDetailResponse userDetailResponse;

		driverValidator.validateSearch(requestInfo, criteria);

//		if( criteria.getMobileNumber() !=null) {
//			userDetailResponse = userService.getOwner(criteria,requestInfo); 
//			if(userDetailResponse !=null && userDetailResponse.getUser() != null && userDetailResponse.getUser().size() >0) {
//				uuids = userDetailResponse.getUser().stream().map(User::getUuid).collect(Collectors.toList());
//				if(CollectionUtils.isEmpty(criteria.getOwnerIds())) {
//					criteria.setOwnerIds(uuids);
//				}else {
//					criteria.getOwnerIds().addAll(uuids);
//				}
//			}
//		}

//		if (!CollectionUtils.isEmpty(criteria.getVehicleRegistrationNumber())
//				|| StringUtils.hasLength(criteria.getVehicleType())
//				|| StringUtils.hasLength(criteria.getVehicleCapacity())) {
//			
//			VehicleSearchCriteria vehicleSearchCriteria=new VehicleSearchCriteria();
//			vehicleSearchCriteria = VehicleSearchCriteria.builder()
//					.registrationNumber(criteria.getVehicleRegistrationNumber())
//					.vehicleType(criteria.getVehicleType())
//					.vehicleCapacity(criteria.getVehicleCapacity())
//					.tenantId(criteria.getTenantId())
//					.status(criteria.getStatus()).build();
//			
//			List<Vehicle> vehicles = vehicleService.getVehicles(vehicleSearchCriteria,requestInfo);
//			
//			if(CollectionUtils.isEmpty(vehicles)) {
//				return new ArrayList<Vendor>();
//			}
//			if(CollectionUtils.isEmpty(criteria.getVehicleIds())) {
//				criteria.setVehicleIds(vehicles.stream().map(Vehicle::getId).collect(Collectors.toList()));
//			}else {
//				criteria.getVehicleIds().addAll(vehicles.stream().map(Vehicle::getId).collect(Collectors.toList()));
//			}
//			
//		}
//		
//		if(!CollectionUtils.isEmpty(criteria.getVehicleIds())) {
//			List<String> vendorIds  = repository.getVendorWithVehicles(criteria);
//			if(CollectionUtils.isEmpty(vendorIds)) {
//				return new ArrayList<Vendor>();
//			}else {
//				if(CollectionUtils.isEmpty(criteria.getIds())) {
//					criteria.setIds(vendorIds);
//				}else {
//					criteria.getIds().addAll(vendorIds);
//				}					
//			}
//		}

		driverList = repository.getDriverData(criteria);
		if (!driverList.isEmpty()) {
			enrichmentService.enrichDriverSearch(driverList, requestInfo, criteria.getTenantId());
		}

		if (driverList.isEmpty()) {
			return Collections.emptyList();
		}

		return driverList;

	}

}
