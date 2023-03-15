package org.egov.wscalculation.web.models;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;

import org.egov.common.contract.request.RequestInfo;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Validated
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class AdhocTaxReq {

	@JsonProperty("RequestInfo")
	@NotNull
	private RequestInfo requestInfo;

	@JsonProperty("demandId")
	@SafeHtml
	@NotNull
	private String demandId;

	@JsonProperty("adhocrebate")
	private BigDecimal adhocrebate = null;

	@JsonProperty("adhocpenalty")
	private BigDecimal adhocpenalty = null;

	@SafeHtml
	@JsonProperty("consumerCode")
	private String consumerCode;

	@SafeHtml
	@JsonProperty("businessService")
	private String businessService;

}
