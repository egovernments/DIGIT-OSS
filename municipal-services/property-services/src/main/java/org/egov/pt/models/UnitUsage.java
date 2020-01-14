package org.egov.pt.models;

import java.math.BigDecimal;

import org.egov.pt.models.enums.OccupancyType;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * UnitUsage
 */

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnitUsage {

	@JsonProperty("unitId")
	private String unitId;

	@JsonProperty("usageCategory")
	private String usageCategory;

	@JsonProperty("occupancyType")
	private OccupancyType occupancyType;

	@JsonProperty("occupancyDate")
	private BigDecimal occupancyDate;

	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("additionalDetails")
	private Object additionalDetails;
}
