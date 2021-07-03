package org.egov.pt.calculator.web.models.propertyV2;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.egov.pt.calculator.web.models.property.AuditDetails;

import javax.validation.constraints.NotNull;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UnitUsage {

	@JsonProperty("id")
	@NotNull
	private String id;

	@JsonProperty("tenantId")
	@NotNull
	private String tenantId;

	@JsonProperty("unitId")
	@NotNull
	private String unitId;

	@JsonProperty("usageCategory")
	private String usageCategory;

	@JsonProperty("occupancyType")
	@NotNull
	private String occupancyType;

	@JsonProperty("occupancyDate")
	@NotNull
	private Long occupancyDate;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;

}
