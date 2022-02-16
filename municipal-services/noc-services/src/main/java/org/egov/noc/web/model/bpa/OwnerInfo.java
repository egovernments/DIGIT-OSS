package org.egov.noc.web.model.bpa;

import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-06-23T05:54:07.373Z[GMT]")
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class OwnerInfo {
 
	@SafeHtml
	@JsonProperty("tenantId")
	private String tenantId = null;

	@SafeHtml
	@JsonProperty("name")
	private String name = null;

	@SafeHtml
	@JsonProperty("ownerId")
	private String ownerId = null;

	@SafeHtml
	@JsonProperty("mobileNumber")
	private String mobileNumber = null;

	@JsonProperty("isPrimaryOwner")
	private Boolean isPrimaryOwner = null;
	 
    @Size(max=64)
	@SafeHtml
    @JsonProperty("uuid")
    private String uuid;
	
}
