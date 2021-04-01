package org.egov.wscalculation.web.models;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaxPeriod {

	private String id;

	@NotNull
	private String tenantId;

	@NotNull
	private Long fromDate;

	@NotNull
	private Long toDate;
	
	@NotNull
	private PeriodCycle periodCycle;

	@NotNull
	private String service;
	
	@NotNull
	private String code;

	private String financialYear;

	private AuditDetails auditDetail;
}
