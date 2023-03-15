package org.egov.pt.models;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.SafeHtml;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UnitUsage {

	@SafeHtml
	@JsonProperty("id")
	private String id;

	@SafeHtml
	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("unitId")
	@SafeHtml
	@NotNull
	private String unitId;

	@JsonProperty("usageCategory")
	@SafeHtml
	@NotNull
	private String usageCategory;

	@JsonProperty("occupancyType")
	@SafeHtml
	@NotNull
	private String occupancyType;

	@JsonProperty("occupancyDate")
	private Long occupancyDate;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;

}
