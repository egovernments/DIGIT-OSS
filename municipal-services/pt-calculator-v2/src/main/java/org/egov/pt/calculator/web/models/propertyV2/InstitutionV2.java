package org.egov.pt.calculator.web.models.propertyV2;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

/**
 * InstitutionV2
 */

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstitutionV2 {

	@JsonProperty("id")
	private String id;

	@JsonProperty("tenantId")
	private String tenantId;
	
	@JsonProperty("name")	
	private String name;

	@JsonProperty("type")
	private String type;

	@JsonProperty("designation")
	private String designation;

	@JsonProperty("nameOfAuthorizedPerson")
	private String nameOfAuthorizedPerson;

	@JsonProperty("additionalDetails")
	private Object additionalDetails;
}
