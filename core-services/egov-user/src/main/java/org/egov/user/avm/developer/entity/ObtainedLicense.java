package org.egov.user.avm.developer.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ObtainedLicense {

	private String registeredAgreement;
	private String registeredDoc;
	
	private String technicalAssistanceAgreement;
	private String technicalAssistanceAgreementDoc;
	
	private String boardResolutionY;
	private String boardDocY;
	
	private String earlierLicY;
	private String earlierDocY;
	
	private String boardResolutionN;
	private String boardDocN;
	
	private String earlierLicN;
	private String earlierDocN;
	
	
}
