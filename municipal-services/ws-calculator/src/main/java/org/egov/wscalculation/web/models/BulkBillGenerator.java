package org.egov.wscalculation.web.models;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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