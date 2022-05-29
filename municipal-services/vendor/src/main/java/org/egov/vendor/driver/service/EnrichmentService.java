package org.egov.vendor.driver.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.egov.common.contract.request.RequestInfo;
import org.egov.vendor.config.VendorConfiguration;
import org.egov.vendor.driver.repository.DriverRepository;
import org.egov.vendor.driver.web.model.Driver;
import org.egov.vendor.driver.web.model.DriverRequest;
import org.egov.vendor.driver.web.model.DriverSearchCriteria;
import org.egov.vendor.driver.web.util.DriverUtil;
import org.egov.vendor.service.BoundaryService;
import org.egov.vendor.service.UserService;
import org.egov.vendor.web.model.AuditDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EnrichmentService {

	@Autowired
	private VendorConfiguration config;

	@Autowired
	private DriverUtil driverUtil;

	@Autowired
	private DriverRepository driverRepository;

	@Autowired
	private BoundaryService boundaryService;

	@Autowired
	private UserService userService;

	/**
	 * enriches the request object for create, assigns random ids for vedor,
	 * vehicles and drivers and audit details
	 * 
	 * @param vendorRequest
	 */

	public void enrichCreate(DriverRequest driverRequest) {
		Driver driver = driverRequest.getDriver();
		RequestInfo requestInfo = driverRequest.getRequestInfo();
		driver.setStatus(Driver.StatusEnum.ACTIVE);
		AuditDetails auditDetails = null;
		if (requestInfo.getUserInfo() != null && requestInfo.getUserInfo().getUuid() != null) {
			auditDetails = driverUtil.getAuditDetails(requestInfo.getUserInfo().getUuid(), true);
			driverRequest.getDriver().setAuditDetails(auditDetails);
		}
		driver.setId(UUID.randomUUID().toString());

	}

	/**
	 * enrich the Driver update request with the required data
	 * 
	 * @param mdmsData
	 */
	public void enrichUpdate(DriverRequest driverRequest) {
		RequestInfo requestInfo = driverRequest.getRequestInfo();
		AuditDetails auditDetails = null;
		if (requestInfo.getUserInfo() != null && requestInfo.getUserInfo().getUuid() != null) {
			auditDetails = driverUtil.getAuditDetails(requestInfo.getUserInfo().getUuid(), false);
			auditDetails.setCreatedBy(driverRequest.getDriver().getAuditDetails().getCreatedBy());
			auditDetails.setCreatedTime(driverRequest.getDriver().getAuditDetails().getCreatedTime());
			driverRequest.getDriver().setAuditDetails(auditDetails);
		}

//		if (driverRequest.getDriver().getAddress() != null) {
//			driverRequest.getDriver().getAddress().setAuditDetails(auditDetails);
//			if (driverRequest.getDriver().getAddress().getGeoLocation() != null
//					&& StringUtils.isEmpty(driverRequest.getDriver().getAddress().getGeoLocation().getId()))
//				driverRequest.getDriver().getAddress().getGeoLocation().setId(UUID.randomUUID().toString());
//		} else {
//			throw new CustomException(DriverErrorConstants.INVALID_ADDRES, " Address is mandatory");
//		}

	}

	public void enrichDriverSearch(List<Driver> driverList, RequestInfo requestInfo, String tenantId) {

		driverList.forEach(driver -> {
			DriverSearchCriteria driverSearchCriteria = new DriverSearchCriteria();
			List<String> ownerIds = new ArrayList<String>();
			ownerIds.add(driver.getOwnerId());
			driverSearchCriteria.setIds(ownerIds);
			driverSearchCriteria.setTenantId(tenantId);
			// UserDetailResponse userResponse = userService.getUsers(driverSearchCriteria,
			// requestInfo);
//			if(userResponse != null && !CollectionUtils.isEmpty(userResponse.getUser())) {
//				driver.setOwner(userResponse.getUser().get(0));
//			}

//			addDrivers(requestInfo, vendor, tenantId);
//			addVehicles(requestInfo, vendor, tenantId);
//			boundaryService.getAreaType(DriverRequest.builder().driver(driver).build(), config.getHierarchyTypeCode());
		});
	}

}
