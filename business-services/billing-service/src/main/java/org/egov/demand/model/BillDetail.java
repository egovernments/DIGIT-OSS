package org.egov.demand.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * BillDetail
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BillDetail {

	@JsonProperty("id")
	private String id;

	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("demandId")
	private String demandId;

	@JsonProperty("bill")
	private String bill;

	@JsonProperty("businessService")
	private String businessService;

	@JsonProperty("billNumber")
	private String billNumber;

	@JsonProperty("billDate")
	private Long billDate;

	@JsonProperty("consumerCode")
	private String consumerCode;

	@JsonProperty("consumerType")
	private String consumerType;

	@JsonProperty("expiryDate")
	private Long expiryDate;

	@JsonProperty("minimumAmount")
	private BigDecimal minimumAmount;

	@JsonProperty("totalAmount")
	private BigDecimal totalAmount;

	@JsonProperty("fromPeriod")
	private Long fromPeriod;

	@JsonProperty("toPeriod")
	private Long toPeriod;

	@JsonProperty("collectedAmount")
	private BigDecimal collectedAmount;

	@JsonProperty("collectionModesNotAllowed")
	@Valid
	private List<String> collectionModesNotAllowed;

	@JsonProperty("partPaymentAllowed")
	private Boolean partPaymentAllowed;

	@JsonProperty("isAdvanceAllowed")
	private Boolean isAdvanceAllowed;

	@JsonProperty("additionalDetails")
	private Object additionalDetails;

	@JsonProperty("billAccountDetails")
	@Valid
	@Default
	private List<BillAccountDetail> billAccountDetails = new ArrayList<>();

	/**
	 * status if the bill detail
	 */
	public enum StatusEnum {
		CREATED("CREATED"),

		CANCELLED("CANCELLED"),

		INSTRUMENT_BOUNCED("INSTRUMENT_BOUNCED");

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

	@JsonProperty("status")
	private StatusEnum status;

	public BillDetail addCollectionModesNotAllowedItem(String collectionModesNotAllowedItem) {
		if (this.collectionModesNotAllowed == null) {
			this.collectionModesNotAllowed = new ArrayList<>();
		}
		this.collectionModesNotAllowed.add(collectionModesNotAllowedItem);
		return this;
	}

	public BillDetail addBillAccountDetailsItem(BillAccountDetail billAccountDetailsItem) {
		if (this.billAccountDetails == null) {
			this.billAccountDetails = new ArrayList<>();
		}
		if (!this.billAccountDetails.contains(billAccountDetailsItem))
			this.billAccountDetails.add(billAccountDetailsItem);
		return this;
	}

}
