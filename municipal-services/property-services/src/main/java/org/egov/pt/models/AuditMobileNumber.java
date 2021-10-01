package org.egov.pt.models;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class AuditMobileNumber {
	
	@JsonProperty("uuid")
	private String uuid;
	
	@JsonProperty("createdby")
	private String createdby;
	
	@JsonProperty("createdtime")
	private Date createdtime;
	
	@JsonProperty("lastmodifiedby")
	private String lastmodifiedby;
	
	@JsonProperty("lastmodifiedtime")
	private Date lastmodifiedtime;
	
	@JsonProperty("mobilenumber")
	private String mobilenumber;
	
	
	public boolean equals(AuditMobileNumber obj) {
		
		return (this.getUuid().equalsIgnoreCase(obj.getUuid()) && this.getCreatedby().equalsIgnoreCase(obj.getCreatedby()) && this.getCreatedtime().toString().equalsIgnoreCase(obj.getCreatedtime().toString())
				&& this.getLastmodifiedby().equalsIgnoreCase(obj.getLastmodifiedby()) && this.getLastmodifiedtime().toString().equalsIgnoreCase(obj.getLastmodifiedtime().toString()) && this.getMobilenumber().equalsIgnoreCase(obj.getMobilenumber()));
	}

}
