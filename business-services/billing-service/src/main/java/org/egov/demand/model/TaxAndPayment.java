package org.egov.demand.model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

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
