package org.egov.rb.pgrmodels;

import org.springframework.beans.factory.annotation.Value;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class AddressDetail {

	
	private String latitude;
	
	private String longitude;
	
	private String city;
	
	private String mohalla;
	
	private String houseNoAndStreetName;
	
	private String landmark;
}
