package org.egov.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import org.egov.web.enums.CollectionType;
import org.egov.web.models.enums.ReceiptType;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

/**
 * BillDetail
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2019-02-25T15:07:36.183+05:30")

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
        private ReceiptType receiptType = null;

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

        @NotNull
        @JsonProperty("collectionType")
        private CollectionType collectionType = null;


}
