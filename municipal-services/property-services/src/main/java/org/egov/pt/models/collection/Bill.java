package org.egov.pt.models.collection;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.pt.models.AuditDetails;
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
    // TODO some of the fields are mandatory in yml, lets discuss billdetail and billaccountdetail also for more clarity

	  @JsonProperty("id")
	  private String id;

	  @JsonProperty("mobileNumber")
	  private String mobileNumber;

	  @JsonProperty("paidBy")
	  private String paidBy;

	  @JsonProperty("payerName")
	  private String payerName;

	  @JsonProperty("payerAddress")
	  private String payerAddress;

	  @JsonProperty("payerEmail")
	  private String payerEmail;

	  @JsonProperty("payerId")
	  private String payerId;

	  @JsonProperty("status")
	  private StatusEnum status;

	  @JsonProperty("reasonForCancellation")
 	  private String reasonForCancellation;

	  @JsonProperty("isCancelled")
	  private Boolean isCancelled;

	  @JsonProperty("additionalDetails")
	  private JsonNode additionalDetails;

	  @JsonProperty("billDetails")
	  @Valid
	  private List<BillDetail> billDetails;

	  @JsonProperty("tenantId")
	  private String tenantId;

	  @JsonProperty("auditDetails")
	  private AuditDetails auditDetails;

	  @JsonProperty("collectionModesNotAllowed")
	  private List<String> collectionModesNotAllowed;

	  @JsonProperty("partPaymentAllowed")
	  private Boolean partPaymentAllowed;

	  @JsonProperty("isAdvanceAllowed")
	  private Boolean isAdvanceAllowed;

	  @JsonProperty("minimumAmountToBePaid")
	  private BigDecimal minimumAmountToBePaid;

	  @JsonProperty("businessService")
	  private String businessService;

	  @JsonProperty("totalAmount")
	  private BigDecimal totalAmount;

	  @JsonProperty("consumerCode")
	  private String consumerCode;

	  @JsonProperty("billNumber")
	  private String billNumber;

	  @JsonProperty("billDate")
	  private Long billDate;

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
