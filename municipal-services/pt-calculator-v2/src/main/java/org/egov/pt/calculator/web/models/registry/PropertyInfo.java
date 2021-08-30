package org.egov.pt.calculator.web.models.registry;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.egov.pt.calculator.web.models.property.Address;
import org.egov.pt.calculator.web.models.property.PropertyInfo.StatusEnum;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyInfo {

	@JsonProperty("id")
	private String id;

	@JsonProperty("propertyId")
	private String propertyId;

	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("accountId")
	private String accountId;

	@JsonProperty("oldPropertyId")
	private String oldPropertyId;

	@JsonProperty("status")
	private StatusEnum status;

	@JsonProperty("address")
	@NotNull
	private Address address;

	@JsonProperty("parentProperties")
	private List<String> parentProperties;
}
