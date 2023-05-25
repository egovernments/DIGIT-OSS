package org.egov.demand.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandDue {

	private ConsolidatedTax consolidatedTax;
	
	private List<Demand> demands;
}
