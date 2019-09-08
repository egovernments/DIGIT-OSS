package org.egov.tlcalculator.web.models.demand;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;

/**
 * TaxAndPayment
 */

@Getter
@Setter
@ToString
@EqualsAndHashCode(of= {"businessService"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaxAndPayment {

	@JsonProperty("businessService")
	private String businessService;

	@JsonProperty("taxAmount")
	private BigDecimal taxAmount;

	@JsonProperty("amountPaid")
	private BigDecimal amountPaid;

}
