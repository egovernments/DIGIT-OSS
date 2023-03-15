package org.egov.waterconnection.web.models.collection;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.waterconnection.web.models.AuditDetails;
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
    // TODO some of the fields are mandatory in yml, lets discuss billDetail and billAccountDetail also for more clarity

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
	  private StatusEnum status = null;

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
