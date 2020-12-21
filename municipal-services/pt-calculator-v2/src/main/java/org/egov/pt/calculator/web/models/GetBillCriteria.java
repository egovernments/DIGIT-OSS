package org.egov.pt.calculator.web.models;

import java.math.BigDecimal;
import java.util.List;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetBillCriteria {
	
	private String assessmentNumber;
	
	@Default
	private BigDecimal amountExpected = BigDecimal.ZERO;

	private String propertyId;
	
	private String assessmentYear;
	
	@NotNull
	private String tenantId;
	
	private String billId;

	@NotNull
	private List<String> consumerCodes;

	private Long fromDate;

	private Long toDate;
	
}
