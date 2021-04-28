package org.egov.collection.web.contract;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class TaxAndPayment {

	@NotNull
	private String businessService;
	
	private BigDecimal taxAmount;
	
	@NotNull
	private BigDecimal amountPaid;
}
