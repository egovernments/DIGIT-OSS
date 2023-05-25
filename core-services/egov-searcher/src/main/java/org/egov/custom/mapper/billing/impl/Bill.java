package org.egov.custom.mapper.billing.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
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

	@JsonProperty("status")
	private StatusEnum status;

	@JsonProperty("totalAmount")
	private BigDecimal totalAmount;

	@JsonProperty("businessService")
	private String businessService;

	@JsonProperty("billNumber")
	private String billNumber;
	
	@JsonProperty("billDate")
	private Long billDate;

	@JsonProperty("consumerCode")
	private String consumerCode;

	@JsonProperty("collectionModesNotAllowed")
	@Valid
	private List<String> collectionModesNotAllowed;

	@JsonProperty("partPaymentAllowed")
	private Boolean partPaymentAllowed;
	
	@JsonProperty("isAdvanceAllowed")
	private Boolean isAdvanceAllowed;

	@JsonProperty("additionalDetails")
	private Object additionalDetails;

	@JsonProperty("billDetails")
	@Valid
	private List<BillDetail> billDetails;

	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("fileStoreId")
	private String fileStoreId;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;
	
	/**
	 * status of the bill .
	 */
	public enum StatusEnum {
		
		ACTIVE("ACTIVE"),

		CANCELLED("CANCELLED"),

		PAID("PAID"),
		
		PARTIALLY_PAID("PARTIALLY_PAID"),

		EXPIRED("EXPIRED");

		private String value;

		StatusEnum(String value) {
			this.value = value;
		}

		@Override
		@JsonValue
		public String toString() {
			return String.valueOf(value);
		}

		@JsonCreator
		public static StatusEnum fromValue(String text) {
			for (StatusEnum b : StatusEnum.values()) {
				if (String.valueOf(b.value).equals(text)) {
					return b;
				}
			}
			return null;
		}
	}

	public Bill addBillDetailsItem(BillDetail billDetailsItem) {
		if (this.billDetails == null) {
			this.billDetails = new ArrayList<>();
		}
		this.billDetails.add(billDetailsItem);
		return this;
	}
	
	
	//These field is not available in the Bill Contract.
	
	@JsonProperty("collectedAmount")
	private BigDecimal collectedAmount;	
	
	@JsonProperty("address")
	private Address address;	
	
	@JsonProperty("user")
	private User user;	
	

}
