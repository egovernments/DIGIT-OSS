package org.egov.pg.models;

import lombok.*;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

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
