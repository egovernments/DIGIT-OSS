package org.egov.web.models;



import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotNull;
import org.egov.web.enums.CollectionType;
import org.egov.web.models.AuditDetails;
import org.egov.web.models.BillAccountDetail;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class BillDetail {

        @JsonProperty("id")
        private String id = null;

        @JsonProperty("tenantId")
        private String tenantId = null;

        @JsonProperty("demandId")
        private String demandId = null;

        @JsonProperty("billId")
        private String billId = null;

        @JsonProperty("amount")
        @NotNull
        private BigDecimal amount = null;

        @JsonProperty("amountPaid")
        private BigDecimal amountPaid = null;

        @NotNull
        @JsonProperty("fromPeriod")
        private Long fromPeriod = null;

        @NotNull
        @JsonProperty("toPeriod")
        private Long toPeriod = null;

        @JsonProperty("collectedAmount")
        private BigDecimal collectedAmount = null;

        @JsonProperty("additionalDetails")
        private JsonNode additionalDetails = null;

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

        @JsonProperty("manualReceiptNumber")
        private String manualReceiptNumber = null;

        @JsonProperty("manualReceiptDate")
        private Long manualReceiptDate = null;


        @JsonProperty("billAccountDetails")
        private List<BillAccountDetail> billAccountDetails = null;

        @JsonProperty("auditDetails")
        private AuditDetails auditDetails = null;


        private String billDescription;

        @NotNull
        @JsonProperty("expiryDate")
        private Long expiryDate;

        private String displayMessage;

        private Boolean callBackForApportioning;

        private String cancellationRemarks;

        public Boolean addBillAccountDetail(BillAccountDetail billAccountDetail) {

                if (CollectionUtils.isEmpty(billAccountDetails)) {

                        billAccountDetails = new ArrayList<>();
                        return billAccountDetails.add(billAccountDetail);
                } else {

                        if (!billAccountDetails.contains(billAccountDetail))
                                return billAccountDetails.add(billAccountDetail);
                        else
                                return false;
                }
        }

}