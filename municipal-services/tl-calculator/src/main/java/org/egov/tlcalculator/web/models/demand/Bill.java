package org.egov.tlcalculator.web.models.demand;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.Builder.Default;
import org.egov.tlcalculator.web.models.AuditDetails;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

/**
 * Bill
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Bill {
	// TODO some of the fields are mandatory in yml, lets discuss billdetail and billaccountdetail also for more clarity

	@JsonProperty("id")
	private String id = null;

	@JsonProperty("mobileNumber")
	private String mobileNumber = null;

	@JsonProperty("paidBy")
	private String paidBy = null;

	@JsonProperty("payerName")
	private String payerName = null;

	@JsonProperty("payerAddress")
	private String payerAddress = null;

	@JsonProperty("payerEmail")
	private String payerEmail = null;

	@JsonProperty("isActive")
	private Boolean isActive = null;

	@JsonProperty("isCancelled")
	private Boolean isCancelled = null;

	@JsonProperty("additionalDetails")
	private Object additionalDetails = null;

	@JsonProperty("taxAndPayments")
	@Valid
	private List<TaxAndPayment> taxAndPayments = null;

	@JsonProperty("billDetails")
	@Valid
	private List<BillDetail> billDetails = null;

	@JsonProperty("tenantId")
	private String tenantId = null;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails = null;

}