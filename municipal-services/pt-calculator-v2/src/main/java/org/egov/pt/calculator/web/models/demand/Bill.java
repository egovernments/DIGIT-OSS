package org.egov.pt.calculator.web.models.demand;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;
import lombok.Builder.Default;
import org.egov.pt.calculator.web.models.property.AuditDetails;
import org.springframework.util.CollectionUtils;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Bill
 */
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
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

	@JsonProperty("payerId")
	private String payerId = null;

	@JsonProperty("status")
	private BillStatusEnum status = null;

	@JsonProperty("reasonForCancellation")
	private String reasonForCancellation = null;

	@JsonProperty("isCancelled")
	private Boolean isCancelled = null;

	@JsonProperty("additionalDetails")
	private JsonNode additionalDetails = null;

	@JsonProperty("billDetails")
	@Valid
	private List<BillDetail> billDetails = null;

	@JsonProperty("tenantId")
	private String tenantId = null;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails = null;

	@JsonProperty("collectionModesNotAllowed")
	private List<String> collectionModesNotAllowed = null;

	@JsonProperty("partPaymentAllowed")
	private Boolean partPaymentAllowed = null;

	@JsonProperty("isAdvanceAllowed")
	private Boolean isAdvanceAllowed;

	@JsonProperty("minimumAmountToBePaid")
	private BigDecimal minimumAmountToBePaid = null;

	@JsonProperty("businessService")
	private String businessService = null;

	@JsonProperty("totalAmount")
	private BigDecimal totalAmount = null;

	@JsonProperty("consumerCode")
	private String consumerCode = null;

	@JsonProperty("billNumber")
	private String billNumber = null;

	@JsonProperty("billDate")
	private Long billDate = null;

	@JsonProperty("amountPaid")
	private BigDecimal amountPaid;



	public enum BillStatusEnum {
		ACTIVE("ACTIVE"),

		CANCELLED("CANCELLED"),

		PAID("PAID"),

		EXPIRED("EXPIRED");

		private String value;

		BillStatusEnum(String value) {
			this.value = value;
		}


		@Override
		@JsonValue
		public String toString() {
			return String.valueOf(value);
		}

		public static boolean contains(String test) {
			for (BillStatusEnum val : BillStatusEnum.values()) {
				if (val.name().equalsIgnoreCase(test)) {
					return true;
				}
			}
			return false;
		}

		@JsonCreator
		public static BillStatusEnum fromValue(String text) {
			for (BillStatusEnum b : BillStatusEnum.values()) {
				if (String.valueOf(b.value).equals(text)) {
					return b;
				}
			}
			return null;
		}

	}

	public Boolean addBillDetail(BillDetail billDetail) {

		if (CollectionUtils.isEmpty(billDetails)) {

			billDetails = new ArrayList<>();
			return billDetails.add(billDetail);
		} else {

			if (!billDetails.contains(billDetail))
				return billDetails.add(billDetail);
			else
				return false;
		}
	}


}
