package org.egov.user.avm.developer.entity;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DevDetail {

	private String CIN_Number;
	private String companyName;
	private String dateOfCorporation;
	private String registeredAddress;
	private String email;
	private String mobileNumber;
	private String GST_Number;	
	private List<ShareholdingPattens> shareHoldingPatterens;
	private List<DirectorsInformation> directorsInformation;	
	private List<AddRemoveAuthoizedUsers> addRemoveAuthoizedUsers;	
	private List<CapacityDevelopAColony> capacityDevelopAColony;	
	private List<DetailsDocuments> detailsDocuments;	
	private List<LicencesPermissionGrantedToDeveloper> licencesPermissionGrantedToDeveloper;
}
