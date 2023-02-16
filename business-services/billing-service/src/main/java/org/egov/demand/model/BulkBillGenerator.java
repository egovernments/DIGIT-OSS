package org.egov.demand.model;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkBillGenerator {
	
	private RequestInfo requestInfo;

	private List<Demand> createDemands;
	
	private List<Demand> updateDemands;
	
	private MigrationCount migrationCount;
}
