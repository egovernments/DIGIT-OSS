package org.bel.birthdeath.common.calculation.collections.models;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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
public class Payment {

    @Size(max=64)
    @JsonProperty("id")
    @Valid
    private String id;

    @NotNull
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

    @Size(max=128)
    @JsonProperty("transactionNumber")
    @Valid
    private String transactionNumber;

    @JsonProperty("transactionDate")
    @Valid
    private Long transactionDate;

    @NotNull
    @JsonProperty("paymentMode")
    @Valid
    private String paymentMode;

    
    @JsonProperty("instrumentDate")
    @Valid
    private Long instrumentDate;

    @Size(max=128)
    @JsonProperty("instrumentNumber")
    @Valid
    private String instrumentNumber;

    @JsonProperty("instrumentStatus")
    @Valid
    private String instrumentStatus;

    @Size(max=64)
    @JsonProperty("ifscCode")
    @Valid
    private String ifscCode;

    @JsonProperty("auditDetails")
    @Valid
    private AuditDetails auditDetails;

    @JsonProperty("additionalDetails")
    @Valid
    private JsonNode additionalDetails;

    @JsonProperty("paymentDetails")
    @Valid
    private List<PaymentDetail> paymentDetails;

    @Size(max=128)
    @NotNull
    @JsonProperty("paidBy")
    @Valid
    private String paidBy = null;

    @Size(max=64)
    @NotNull
    @JsonProperty("mobileNumber")
    @Valid
    private String mobileNumber = null;

    @Size(max=128)
    @JsonProperty("payerName")
    @Valid
    private String payerName = null;

    @Size(max=1024)
    @JsonProperty("payerAddress")
    @Valid
    private String payerAddress = null;

    @Size(max=64)
    @JsonProperty("payerEmail")
    @Valid
    private String payerEmail = null;

    @Size(max=64)
    @JsonProperty("payerId")
    @Valid
    private String payerId = null;

    @JsonProperty("paymentStatus")
    @Valid
    private String paymentStatus;


    public Payment addpaymentDetailsItem(PaymentDetail paymentDetail) {
        if (this.paymentDetails == null) {
            this.paymentDetails = new ArrayList<>();
        }
        this.paymentDetails.add(paymentDetail);
        return this;
    }




}
