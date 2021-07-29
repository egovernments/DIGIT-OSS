package org.egov.tlcalculator.web.models.demand;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.*;
import org.egov.tlcalculator.web.models.AuditDetails;
import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Bill
 */
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

	@JsonProperty("additionalDetails")
	private Object additionalDetails;

	@JsonProperty("billDetails")
	@Valid
	private List<BillDetail> billDetails;

	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;

	/**
	 * status of the bill .
	 */
	public enum StatusEnum {

		ACTIVE("ACTIVE"),

		CANCELLED("CANCELLED"),

		PAID("PAID"),

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

}
