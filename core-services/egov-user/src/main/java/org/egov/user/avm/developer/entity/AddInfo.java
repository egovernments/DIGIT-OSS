package org.egov.user.avm.developer.entity;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddInfo {

	private String CIN_Number;
	private String companyName;
	private String dateOfCorporation;
	private String registeredAddress;
	private String email;
	private String mobileNumber;
	private String GST_Number;
	
	private FinancialCapacity financialCapacity;
	
	private List<ShareholdingPattens> shareHoldingPatterens;
	private List<DirectorsInformation> directorsInformation;
	
}
