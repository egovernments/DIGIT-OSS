package org.egov.collection.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @JsonProperty("id")
    private String id;

    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("totalDue")
    private String totalDue;

    @JsonProperty("totalAmountPaid")
    private String totalAmountPaid;

    @JsonProperty("transactionNumber")
    private String transactionNumber;

    @JsonProperty("transactionDate")
    private String transactionDate;

    @JsonProperty("paymentMode")
    private String paymentMode;

    @JsonProperty("instrumentDate")
    private String instrumentDate;


    @JsonProperty("instrumentNumber")
    private String instrumentNumber;

    @JsonProperty("ifscCode")
    private String ifscCode;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails;

    @JsonProperty("additionalDetails")
    private String additionalDetails;

    @JsonProperty("paymentDetails")
    private List<PaymentDetail> paymentDetails;

    @JsonProperty("paidBy")
    private String paidBy = null;

    @JsonProperty("mobileNumber")
    private String mobileNumber = null;

    @JsonProperty("payerName")
    private String payerName = null;

    @JsonProperty("payerAddress")
    private String payerAddress = null;

    @JsonProperty("payerEmail")
    private String payerEmail = null;

    @JsonProperty("payerId")
    private String payerId = null;


}
