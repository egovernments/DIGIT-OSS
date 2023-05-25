package org.egov.demand.model;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Bill
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Bill {
	
	@JsonProperty("id")
	private String id;

	@JsonProperty("mobileNumber")
	private String mobileNumber;

	@JsonProperty("payerName")
	private String payerName;

	@JsonProperty("payerAddress")
	private String payerAddress;

	@JsonProperty("payerEmail")
	private String payerEmail;

	@JsonProperty("isActive")
	private Boolean isActive;

	@JsonProperty("isCancelled")
	private Boolean isCancelled;

	@JsonProperty("additionalDetails")
	private Object additionalDetails;

	@JsonProperty("taxAndPayments")
	@Valid
	private List<TaxAndPayment> taxAndPayments;

	@JsonProperty("billDetails")
	@Valid
	@Default
	private List<BillDetail> billDetails = new ArrayList<>();

	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;

	
	public Bill addBillDetailsItem(BillDetail billDetailsItem) {
		if (this.billDetails == null) {
			this.billDetails = new ArrayList<>();
		}
		this.billDetails.add(billDetailsItem);
		return this;
	}

}