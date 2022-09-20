package org.egov.user.avm.developer.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddRemoveAuthoizedUsers {
	
	private int serialNumber;
	private String name;
	private String mobileNumber;
	private String email;
	private String uploadPanPdf;
	private String uploadAadharPdf;
	private String uploadDigitalSignaturePdf;
	

}
