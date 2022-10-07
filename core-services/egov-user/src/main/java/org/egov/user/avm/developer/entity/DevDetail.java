package org.egov.user.avm.developer.entity;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DevDetail {


	private AddInfo addInfo;
	private UploadDocument uploadDocument;
	private List<AddRemoveAuthoizedUsers> addRemoveAuthoizedUsers;	
	private CapcityDevelopAColony capcityDevelopAColony;
	
	
}
