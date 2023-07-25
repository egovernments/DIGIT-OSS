package org.egov.vendor.driver.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.egov.common.contract.request.RequestInfo;
import org.egov.vendor.driver.web.model.Driver;
import org.egov.vendor.driver.web.model.DriverRequest;
import org.egov.vendor.driver.web.model.DriverSearchCriteria;
import org.egov.vendor.service.VendorService;
import org.egov.vendor.util.VendorUtil;
import org.egov.vendor.web.model.AuditDetails;
import org.egov.vendor.web.model.Vendor;
import org.egov.vendor.web.model.VendorResponse;
import org.egov.vendor.web.model.VendorSearchCriteria;
import org.egov.vendor.web.model.user.UserDetailResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DriverEnrichmentService {

	@Autowired
	private VendorUtil vendorUtil;

	@Autowired
	private DriverUserService userService;
	
	@Autowired
	private VendorService vendorService;
	
	/**
	 * enriches the request object for create, assigns random ids for driver and audit details
	 * @param driverRequest
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
		driver.setName(driver.getOwner().getName());
		driver.setOwnerId(driver.getOwner().getUuid());

	}
	
	/**
	 *  enrich the vendor update request with the required data
	 * @param driverRequest
	*/
	public void enrichUpdate(DriverRequest driverRequest) {
		RequestInfo requestInfo = driverRequest.getRequestInfo();
		AuditDetails auditDetails = null;
		if (requestInfo.getUserInfo() != null && requestInfo.getUserInfo().getUuid() != null) {
			auditDetails = vendorUtil.getAuditDetails(requestInfo.getUserInfo().getUuid(), false);
			auditDetails.setCreatedBy(driverRequest.getDriver().getAuditDetails().getCreatedBy());
			auditDetails.setCreatedTime(driverRequest.getDriver().getAuditDetails().getCreatedTime());
			driverRequest.getDriver().setAuditDetails(auditDetails);
		}
		
		
		driverRequest.getDriver().setName(driverRequest.getDriver().getOwner().getName());
		driverRequest.getDriver().setOwnerId(driverRequest.getDriver().getOwner().getUuid());

		
	}
	
	public void enrichDriverSearch(List<Driver> driverList, RequestInfo requestInfo, String tenantId) {
		
		driverList.forEach(driver -> {
			DriverSearchCriteria driverSearchCriteria = new DriverSearchCriteria();
			List<String> ownerIds = new ArrayList<String>();
			ownerIds.add(driver.getOwnerId());
			driverSearchCriteria.setIds(ownerIds);
			driverSearchCriteria.setTenantId(tenantId);
			UserDetailResponse userResponse = userService.getUsers(driverSearchCriteria, requestInfo);
			if(userResponse != null && !CollectionUtils.isEmpty(userResponse.getUser())) {
				driver.setOwner(userResponse.getUser().get(0));
			}
			
			//addVendors(requestInfo, driver, tenantId);
			//addVehicles(requestInfo, vendor, tenantId);
			
		});
	}
	
	private void addVendors(RequestInfo requestInfo, Driver driver, String tenantId) {
				
			VendorResponse vendorSearchResult=vendorService.vendorsearch(
					VendorSearchCriteria.builder().driverIds(Arrays.asList(driver.getId()))
					.tenantId(tenantId).status(Arrays.asList("ACTIVE")).build(), requestInfo);
			
			if(vendorSearchResult!=null && vendorSearchResult.getVendor()!=null &&
					!vendorSearchResult.getVendor().isEmpty()) {
			
				Vendor vendor=vendorSearchResult.getVendor().get(0);
				vendor.setDrivers(null);
				vendor.setVehicles(null);	
				//driver.setVendor(vendor);	
			}
  }
	
	
}