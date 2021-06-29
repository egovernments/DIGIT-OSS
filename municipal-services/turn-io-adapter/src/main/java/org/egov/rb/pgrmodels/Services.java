package org.egov.rb.pgrmodels;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Services {
	
	
	private String serviceCode;
	
	private String description;
	
	
	@JsonProperty("addressDetail")
	private AddressDetail addressDetail;
	
	private String address;
	
	private String tenantId;
	
	private String source;
	
	private String phone;
	

}
