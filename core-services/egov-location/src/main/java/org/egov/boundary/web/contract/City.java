package org.egov.boundary.web.contract;

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonProperty;

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
public class City {

	 	@NotEmpty
	 	@JsonProperty("id")
	    private String id;
	    @NotEmpty
		@JsonProperty("code")
	    private String code;
		@JsonProperty("name")
	    private String name;
		@JsonProperty("districtCode")
	    private String districtCode ;
		@JsonProperty("districtName")
	    private String districtName ;
		@JsonProperty("grade")
	    private String grade ;
		@JsonProperty("domainURL")
	    private String domainURL;
		@JsonProperty("regionName")
	    private String regionName ;
	@NotEmpty
	@JsonProperty("tenantId")
	private String tenantId;
}