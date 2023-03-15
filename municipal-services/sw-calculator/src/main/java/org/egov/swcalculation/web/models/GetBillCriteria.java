package org.egov.swcalculation.web.models;

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
	private String connectionNumber;
	
	@Default
	private BigDecimal amountExpected = BigDecimal.ZERO;
	
	private String connectionId;
	
	private String assessmentYear;
	
	@NotNull
	private String tenantId;
	
	private String billId;

	private List<String> consumerCodes;

	private Boolean isPaymentCompleted;
	
}
