package org.egov.swcalculation.web.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.egov.common.contract.request.RequestInfo;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkBillGenerator {

	private RequestInfo requestInfo;

	private List<Demand> createDemands;

	private List<Demand> updateDemands;

	private MigrationCount migrationCount;
}