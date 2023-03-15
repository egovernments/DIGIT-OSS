package org.egov.pt.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.validator.constraints.SafeHtml;

/**
 * Institution
 */

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Institution {

	@SafeHtml
	@JsonProperty("id")
	private String id;

	@SafeHtml
	@JsonProperty("tenantId")
	private String tenantId;

	@SafeHtml
	@JsonProperty("name")	
	private String name;

	@SafeHtml
	@JsonProperty("type")
	private String type;

	@SafeHtml
	@JsonProperty("designation")
	private String designation;

	@SafeHtml
	@JsonProperty("nameOfAuthorizedPerson")
	private String nameOfAuthorizedPerson;

	@JsonProperty("additionalDetails")
	private Object additionalDetails;
}
