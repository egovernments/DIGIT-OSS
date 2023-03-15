package org.egov.fsm.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FSMAuditUtil {

	private String id = null;

	private String applicationNo = null;

	private String accountId = null;

	private String description = null;

	private String applicationStatus = null;

	private String source = null;

	private String sanitationtype = null;

	private String propertyUsage = null;

	private Integer noOfTrips = null;

	private String status = null;

	private String vehicleId = null;

	private String doorNo = null;

	private String plotNo = null;

	private String landmark = null;

	private String city = null;

	private String district = null;

	private String region = null;

	private String state = null;

	private String country = null;

	private String locality = null;

	private String pincode = null;

	private String buildingName = null;

	private String street = null;

	private Double latitude = null;

	private Double longitude = null;

	private Double height = null;

	private Double length = null;

	private Double width = null;

	private Double diameter = null;

	private Double distanceFromRoad = null;

	private String vehicleType = null;

	private Long possibleServiceDate = null;

	private String dsoId = null;
	
	private String slumName = null;

	private String modifiedBy = null;

	private Long modifiedTime = null;

	private String createdBy = null;

	private Long createdTime = null;
	
	private String vehicleCapacity = null;
	
	private String paymentPreference = null;
}
