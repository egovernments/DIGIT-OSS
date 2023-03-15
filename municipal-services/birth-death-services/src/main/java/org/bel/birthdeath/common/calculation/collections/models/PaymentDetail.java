package org.bel.birthdeath.common.calculation.collections.models;

import java.math.BigDecimal;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.bel.birthdeath.common.model.AuditDetails;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
public class PaymentDetail {

    @Size(max=64)
    @JsonProperty("id")
    @Valid
    private String id;

    @Size(max=64)
    @JsonProperty("tenantId")
    @Valid
    private String tenantId;

    @JsonProperty("totalDue")
    @Valid
    private BigDecimal totalDue;

    @NotNull
    @JsonProperty("totalAmountPaid")
    @Valid
    private BigDecimal totalAmountPaid;

    @Size(max=64)
    @JsonProperty("receiptNumber")
    @Valid
    private String receiptNumber;
    
    @Size(max=64)
    @JsonProperty("manualReceiptNumber")
    @Valid
    private String manualReceiptNumber;
    
    @JsonProperty("manualReceiptDate")
    @Valid
    private Long manualReceiptDate;

    @JsonProperty("receiptDate")
    @Valid
    private Long receiptDate = null;

    @JsonProperty("receiptType")
    @Valid
    private String receiptType = null;

    @JsonProperty("businessService")
    @Valid
    private String businessService;

    @NotNull
    @Size(max=64)
    @JsonProperty("billId")
    @Valid
    private String billId;

    @JsonProperty("bill")
    @Valid
    private Bill bill;

    @JsonProperty("additionalDetails")
    @Valid
    private JsonNode additionalDetails;

    @JsonProperty("auditDetails")
    @Valid
    private AuditDetails auditDetails;

}
