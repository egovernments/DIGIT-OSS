package org.egov.wscalculation.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Validated
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class BulkBillReq {

	@JsonProperty("RequestInfo")
	@NotNull
	private RequestInfo requestInfo;

	@Valid
	@NotNull
	@JsonProperty("BulkBillCriteria")
	private BulkBillCriteria bulkBillCriteria;

}