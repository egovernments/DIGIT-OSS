package org.egov.pt.calculator.web.models.propertyV2;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.Valid;
import java.util.List;

/**
 * This is lightweight property object that can be used as reference by
 * definitions needing property linking. Actual PropertyV2 Object extends this to
 * include more elaborate attributes of the property.
 */

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PropertyInfoV2 {

	@JsonProperty("id")
	private String id;

	@JsonProperty("propertyId")
	private String propertyId;

	@JsonProperty("surveyId")
	private String surveyId;

	@JsonProperty("linkedProperties")
	@Valid
	private List<String> linkedProperties;

	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("accountId")
	private String accountId;

	@JsonProperty("oldPropertyId")
	private String oldPropertyId;

	@JsonProperty("status")
	private String status;

	@JsonProperty("address")
	private AddressV2 address;
}
