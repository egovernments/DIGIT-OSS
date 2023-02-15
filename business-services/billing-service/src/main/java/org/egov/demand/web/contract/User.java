package org.egov.demand.web.contract;

import org.egov.demand.model.Owner;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

	private String uuid;
	private Long id;
	private String userName;
	private String type;
	private String salutation;
	private String name;
	private String gender;
	
	private String mobileNumber;
	
	private String emailId;
	private String altContactNumber;
	private String pan;
	private String aadhaarNumber;
	private String permanentAddress;
	private String permanentCity;
	private String permanentPinCode;
	private String correspondenceAddress;
	private String correspondenceCity;
	private String correspondencePinCode;
	private Boolean active;
	private String tenantId;

	public Owner toOwner(){	
		
	return Owner.builder()
			.id(id)
			.userName(userName)
			.name(name)
			.permanentAddress(this.permanentAddress)
			.mobileNumber(mobileNumber)
			.aadhaarNumber(aadhaarNumber)
			.emailId(emailId)
			.tenantId(tenantId)
			.build();
	}	
}