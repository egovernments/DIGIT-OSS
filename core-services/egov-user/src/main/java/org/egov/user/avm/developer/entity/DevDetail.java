package org.egov.user.avm.developer.entity;

import java.util.List;

import org.egov.user.web.contract.UserRequest;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DevDetail {


	private AddInfo addInfo;
	private UploadDocument uploadDocument;
	private List<UserRequest> addRemoveAuthoizedUsers;	
	private CapcityDevelopAColony capcityDevelopAColony;
	
	
}
