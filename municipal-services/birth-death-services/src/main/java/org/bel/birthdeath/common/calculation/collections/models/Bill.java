package org.bel.birthdeath.common.calculation.collections.models;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.bel.birthdeath.common.model.AuditDetails;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Bill {

	  @JsonProperty("id")
	  @Valid
	  private String id = null;

	  @JsonProperty("mobileNumber")
	  @Valid
	  private String mobileNumber = null;

	  @JsonProperty("paidBy")
	  @Valid
	  private String paidBy = null;

	  @JsonProperty("payerName")
	  @Valid
	  private String payerName = null;

	  @JsonProperty("payerAddress")
	  @Valid
	  private String payerAddress = null;

	  @JsonProperty("payerEmail")
	  @Valid
	  private String payerEmail = null;

	  @JsonProperty("payerId")
	  @Valid
	  private String payerId = null;

	  @JsonProperty("status")
	  @Valid
	  private StatusEnum status = null;

	  @JsonProperty("reasonForCancellation")
	  @Valid
 	  private String reasonForCancellation = null;

	  @JsonProperty("isCancelled")
	  @Valid
	  private Boolean isCancelled = null;

	  @JsonProperty("additionalDetails")
	  @Valid
	  private JsonNode additionalDetails = null;

	  @JsonProperty("billDetails")
	  @Valid
	  private List<BillDetail> billDetails = null;

	  @JsonProperty("tenantId")
	  @Valid
	  private String tenantId = null;

	  @JsonProperty("auditDetails")
	  @Valid
	  private AuditDetails auditDetails = null;

	  @JsonProperty("collectionModesNotAllowed")
	  @Valid
	  private List<String> collectionModesNotAllowed = null;

	  @JsonProperty("partPaymentAllowed")
	  @Valid
	  private Boolean partPaymentAllowed = null;

	  @JsonProperty("isAdvanceAllowed")
	  @Valid
	  private Boolean isAdvanceAllowed;

	  @JsonProperty("minimumAmountToBePaid")
	  @Valid
	  private BigDecimal minimumAmountToBePaid = null;

	  @JsonProperty("businessService")
	  @Valid
	  private String businessService = null;

	  @JsonProperty("totalAmount")
	  @Valid
	  private BigDecimal totalAmount = null;

	  @JsonProperty("consumerCode")
	  @Valid
	  private String consumerCode = null;

	  @JsonProperty("billNumber")
	  @Valid
	  private String billNumber = null;

	  @JsonProperty("billDate")
	  @Valid
	  private Long billDate = null;

	  @JsonProperty("amountPaid")
	  @Valid
	  private BigDecimal amountPaid;



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

	public static boolean contains(String test) {
		for (StatusEnum val : StatusEnum.values()) {
			if (val.name().equalsIgnoreCase(test)) {
				return true;
			}
		}
		return false;
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
