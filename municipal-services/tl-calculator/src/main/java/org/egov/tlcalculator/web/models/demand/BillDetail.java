package org.egov.tlcalculator.web.models.demand;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;
import lombok.Builder.Default;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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
    private String id = null;

    @JsonProperty("tenantId")
    private String tenantId = null;

    @JsonProperty("demandId")
    private String demandId = null;

    @JsonProperty("bill")
    private String bill = null;

    @JsonProperty("businessService")
    private String businessService = null;

    @JsonProperty("billNumber")
    private String billNumber = null;

    @JsonProperty("billDate")
    private Long billDate = null;

    @JsonProperty("consumerCode")
    private String consumerCode = null;

    @JsonProperty("consumerType")
    private String consumerType = null;

    @JsonProperty("minimumAmount")
    private BigDecimal minimumAmount = null;

    @JsonProperty("totalAmount")
    @NotNull
    private BigDecimal totalAmount = null;

    @JsonProperty("amountPaid")
    @NotNull
    private BigDecimal amountPaid = null;

    @JsonProperty("fromPeriod")
    private Long fromPeriod = null;

    @JsonProperty("toPeriod")
    private Long toPeriod = null;

    @JsonProperty("collectedAmount")
    private BigDecimal collectedAmount = null;

    @JsonProperty("collectionModesNotAllowed")
    private List<String> collectionModesNotAllowed = null;

    @JsonProperty("partPaymentAllowed")
    private Boolean partPaymentAllowed = null;

    @JsonProperty("additionalDetails")
    private JsonNode additionalDetails = null;

    @JsonProperty("receiptNumber")
    private String receiptNumber = null;

    @JsonProperty("receiptDate")
    private Long receiptDate = null;

    @JsonProperty("receiptType")
    private String receiptType = null;

    @JsonProperty("channel")
    private String channel = null;

    @JsonProperty("voucherHeader")
    private String voucherHeader = null;

    @JsonProperty("boundary")
    private String boundary = null;

    @JsonProperty("reasonForCancellation")
    private String reasonForCancellation = null;

    @JsonProperty("manualReceiptNumber")
    private String manualReceiptNumber = null;

    @JsonProperty("manualReceiptDate")
    private Long manualReceiptDate = null;

    @JsonProperty("stateId")
    private String stateId = null;

    @JsonProperty("fund")
    private String fund = null;

    @JsonProperty("function")
    private String function = null;

    @JsonProperty("department")
    private String department = null;

    @JsonProperty("billAccountDetails")
    private List<BillAccountDetail> billAccountDetails = null;

    @JsonProperty("status")
    private String status = null;

    @JsonProperty("collectionType")
    private CollectionType collectionType = null;


}