package org.egov.boundary.web.contract;

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Size;

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
		@Size(max = 4)
		@JsonProperty("code")
	    private String code;
	    @Size(max = 256)
		@JsonProperty("name")
	    private String name;
	    @Size(max = 10)
		@JsonProperty("districtCode")
	    private String districtCode ;
	    @Size(max = 50)
		@JsonProperty("districtName")
	    private String districtName ;
	    @Size(max = 50)
		@JsonProperty("grade")
	    private String grade ;
	    @Size(max = 128)
		@JsonProperty("domainURL")
	    private String domainURL;
	    @Size(max = 50)
		@JsonProperty("regionName")
	    private String regionName ;
	@NotEmpty
	@Size(max = 256)
	@JsonProperty("tenantId")
	private String tenantId;
}