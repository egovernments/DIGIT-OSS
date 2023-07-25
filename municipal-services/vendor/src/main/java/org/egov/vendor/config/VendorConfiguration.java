package org.egov.vendor.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Component
public class VendorConfiguration {

	

	// Persister Config
	@Value("${persister.save.vendor.topic}")
	private String saveTopic;
	
	@Value("${persister.update.vendor.topic}")
	private String updateTopic;
	
	@Value("${persister.save.driver.topic}")
	private String saveDriverTopic;


	@Value("${persister.update.driver.topic}")
	private String updateDriverTopic;

	@Value("${persister.save.vendordrivervehicle.topic}")
	private String saveVendorVehicleDriverTopic;

	// MDMS
	@Value("${egov.mdms.host}")
	private String mdmsHost;

	@Value("${egov.mdms.search.endpoint}")
	private String mdmsEndPoint;

	// User Configuration
	@Value("${egov.user.host}")
	private String userHost;

	@Value("${egov.user.context.path}")    
	private String userContextPath;
	
	
	@Value("${egov.user.create.path}")
	private String userCreateEndpoint;

	@Value("${egov.user.search.path}")
	private String userSearchEndpoint;

	@Value("${egov.user.update.path}")
	private String userUpdateEndpoint;
	
	@Value("${egov.user.username.prefix}")
	private String usernamePrefix;
	
	// Vehicle Configuration
	@Value("${egov.vehicle.host}")
	private String vehicleHost;

	@Value("${egov.vehicle.context.path}")    
	private String vehicleContextPath;
	
	
	@Value("${egov.vehicle.create.endpoint}")
	private String vehicleCreateEndpoint;

	@Value("${egov.vehicle.search.endpoint}")
	private String vehicleSearchEndpoint;

	@Value("${egov.vehicle.update.endpoint}")
	private String vehicleUpdateEndpoint;
	
	
	@Value("${egov.hrms.host}")
	private String employeeHost;

	@Value("${egov.hrms.context.path}")    
	private String employeeContextPath;
	@Value("${egov.hrms.create.path}")
	private String employeeCreateEndpoint;

	@Value("${egov.hrms.search.path}")
	private String employeeSearchEndpoint;

	@Value("${egov.hrms.update.path}")
	private String employeeUpdateEndpoint;

	// @Value("${egov.owner.ownername.prefix}")
	private String ownernamePrefix;

	@Value("${egov.location.host}")
	private String locationHost;

	@Value("${egov.location.context.path}")
	private String locationContextPath;

	@Value("${egov.location.endpoint}")
	private String locationEndpoint;

	@Value("${egov.location.hierarchyTypeCode}")
	private String hierarchyTypeCode;


	
	
	@Value("${employee.allowed.search.params}")
	private String allowedEmployeeSearchParameters;
	
	@Value("${citizen.allowed.search.params}")
	private String allowedCitizenSearchParameters;
	

	@Value("${egov.vendorregistory.default.limit}")
	private Integer defaultLimit;

	@Value("${egov.vendorregistory.default.offset}")
	private Integer defaultOffset;

	@Value("${egov.vendorregistory.max.limit}")
	private Integer maxSearchLimit;

	@Value("${dso.role}")
	private String dsoRole;

	@Value("${dso.driver}")
	private String dsoDriver;

	@Value("${dso.role.name}")
	private String dsoRoleName;

	@Value("${dso.driver.role.name}")
	private String dsoDriverRoleName;

}
