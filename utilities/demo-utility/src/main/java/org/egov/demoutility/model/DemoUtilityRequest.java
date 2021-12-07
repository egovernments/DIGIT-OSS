package org.egov.demoutility.model;

import javax.validation.constraints.NotNull;

import org.egov.common.contract.request.RequestInfo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DemoUtilityRequest {
	
 
 private String oragnizationName;
 
 @NotNull
 private String shortCode;
 
 @NotNull
 private String email;
 
 private int setOfUsers;
 
 private String applicantName;
 
 private String mobileNo;
 
}
