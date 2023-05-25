package org.egov.custom.mapper.billing.impl;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Address {
	
	private String  doorNo;
	
	private String  addressline1;
	
	private String  addressline2;

	private String  landmark;

	private String  city;

	private String  pincode;
	
	private String  locality;

}
