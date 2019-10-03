package org.egov.collection.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.egov.collection.model.enums.PaymentModeEnum;
import org.egov.collection.model.enums.PaymentStatusEnum;

import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Size(max=64)
    @JsonProperty("id")
    private String id;

    @Size(max=64)
    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("totalDue")
    private BigDecimal totalDue;

    @JsonProperty("totalAmountPaid")
    private BigDecimal totalAmountPaid;

    @Size(max=128)
    @JsonProperty("transactionNumber")
    private String transactionNumber;

    @JsonProperty("transactionDate")
    private Long transactionDate;

    @Size(max=64)
    @JsonProperty("paymentMode")
    private PaymentModeEnum paymentMode;

    @JsonProperty("instrumentDate")
    private Long instrumentDate;

    @Size(max=128)
    @JsonProperty("instrumentNumber")
    private String instrumentNumber;

    @Size(max=64)
    @JsonProperty("ifscCode")
    private String ifscCode;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails;

    @JsonProperty("additionalDetails")
    private Object additionalDetails;

    @JsonProperty("paymentDetails")
    private List<PaymentDetail> paymentDetails;

    @Size(max=128)
    @JsonProperty("paidBy")
    private String paidBy = null;

    @Size(max=64)
    @JsonProperty("mobileNumber")
    private String mobileNumber = null;

    @Size(max=128)
    @JsonProperty("payerName")
    private String payerName = null;

    @Size(max=1024)
    @JsonProperty("payerAddress")
    private String payerAddress = null;

    @Size(max=64)
    @JsonProperty("payerEmail")
    private String payerEmail = null;

    @Size(max=64)
    @JsonProperty("payerId")
    private String payerId = null;

    @Size(max=64)
    @JsonProperty("paymentStatus")
    private PaymentStatusEnum paymentStatus;




}
