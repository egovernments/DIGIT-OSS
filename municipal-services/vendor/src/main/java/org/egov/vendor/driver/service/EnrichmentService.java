package org.egov.vendor.driver.service;

import java.util.UUID;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.vendor.config.VendorConfiguration;
import org.egov.vendor.driver.web.model.Driver;
import org.egov.vendor.driver.web.model.DriverRequest;
import org.egov.vendor.repository.VendorRepository;
import org.egov.vendor.service.BoundaryService;
import org.egov.vendor.service.UserService;
import org.egov.vendor.service.VehicleService;
import org.egov.vendor.util.VendorErrorConstants;
import org.egov.vendor.util.VendorUtil;
import org.egov.vendor.web.model.AuditDetails;
import org.egov.vendor.web.model.Vendor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EnrichmentService {

	@Autowired
	private VendorConfiguration config;

	@Autowired
	private VendorUtil vendorUtil;

	@Autowired
	private VendorRepository vendorRepository;
	
	@Autowired
	private VehicleService vehicleService;
	
	@Autowired
	private BoundaryService boundaryService;
	
	@Autowired
	private UserService userService;
	
	/**
	 * enriches the request object for create, assigns random ids for vedor, vehicles and drivers and audit details
	 * @param vendorRequest
	 */
	
	public void enrichCreate(DriverRequest driverRequest) {
		Driver driver = driverRequest.getDriver();
		RequestInfo requestInfo = driverRequest.getRequestInfo();
		driver.setStatus(Driver.StatusEnum.ACTIVE);
		AuditDetails auditDetails = null;
		if (requestInfo.getUserInfo() != null && requestInfo.getUserInfo().getUuid() != null) {
			auditDetails = vendorUtil.getAuditDetails(requestInfo.getUserInfo().getUuid(), true);
			driverRequest.getDriver().setAuditDetails(auditDetails);
		}
		driver.setId(UUID.randomUUID().toString());

//		if (driverRequest.getDriver().getAddress() != null) {
//			if (StringUtils.isEmpty(vendorRequest.getVendor().getAddress().getId()))
//				vendorRequest.getVendor().getAddress().setId(UUID.randomUUID().toString());
//			vendorRequest.getVendor().getAddress().setTenantId(vendorRequest.getVendor().getTenantId());
//			vendorRequest.getVendor().getAddress().setAuditDetails(auditDetails);
//			if (vendorRequest.getVendor().getAddress().getGeoLocation() != null
//					&& StringUtils.isEmpty(vendorRequest.getVendor().getAddress().getGeoLocation().getId()))
//				vendorRequest.getVendor().getAddress().getGeoLocation().setId(UUID.randomUUID().toString());
//		} else {
//			throw new CustomException(VendorErrorConstants.INVALID_ADDRES, " Address is mandatory");
//		}
		
		
//		if(vendorRequest.getVendor().getVehicles() != null && vendorRequest.getVendor().getVehicles().size() >0) {
//			AuditDetails finalAuditDetails = auditDetails;
//			vendorRequest.getVendor().getVehicles().forEach(vehicle->{
//				if(StringUtils.isEmpty(vehicle.getId())) {
//					vehicle.setId(UUID.randomUUID().toString());
//					vehicle.setTenantId(vendorRequest.getVendor().getTenantId());
//					vehicle.setAuditDetails(finalAuditDetails);
//				}
//			});
		}
		
		
	}

