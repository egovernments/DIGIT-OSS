package org.egov.vendor.driver.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.vendor.driver.repository.DriverRepository;
import org.egov.vendor.driver.web.model.Driver;
import org.egov.vendor.driver.web.model.DriverRequest;
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
	private DriverRepository driverRepository;

//	@Autowired
//	private DriverValidator driverValidator;


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
		Object mdmsData = util.mDMSCall(requestInfo, tenantId);
		//vendorValidator.validateCreateOrUpdateRequest(driverRequest, mdmsData,true);
		enrichmentService.enrichCreate(driverRequest);
		driverRepository.save(driverRequest);
		return driverRequest.getDriver();

	}
}
