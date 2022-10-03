package org.egov.user.avm.developer.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LicencesPermissionGrantedToDeveloper {
	
	private int serialNumber;
	private String coloniesDeveloped;
	private String area;
	private String purpose;
	private String statusOfDevelopment;
	private String outstandingDues;

}
