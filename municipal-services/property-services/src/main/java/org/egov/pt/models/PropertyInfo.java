package org.egov.pt.models;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.egov.pt.models.enums.Status;
import org.javers.core.metamodel.annotation.DiffInclude;

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
	@DiffInclude
	private String oldPropertyId;

	@JsonProperty("status")
	private Status status;

	@JsonProperty("address")
	@NotNull
	private Address address;

	@JsonProperty("parentProperties")
	private List<String> parentProperties;
}
