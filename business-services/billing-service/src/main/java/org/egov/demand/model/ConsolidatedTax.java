package org.egov.demand.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsolidatedTax {

	private Double arrearsDemand;
	private Double arrearsCollection;
	private Double arrearsBalance;
	private Double currentDemand;
	private Double currentCollection;
	private Double currentBalance;
}
