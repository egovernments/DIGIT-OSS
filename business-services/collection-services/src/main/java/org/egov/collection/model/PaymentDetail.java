package org.egov.collection.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.collection.model.enums.PaymentDetailStatusEnum;
import org.egov.collection.model.enums.PaymentStatusEnum;
import org.egov.collection.web.contract.Bill;

import javax.validation.constraints.Size;
import java.math.BigDecimal;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
public class PaymentDetail {

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

    @Size(max=64)
    @JsonProperty("receiptNumber")
    private String receiptNumber;

    @Size(max=64)
    @JsonProperty("businessService")
    private String businessService;

    @Size(max=64)
    @JsonProperty("billId")
    private String billId;

    @JsonProperty("bill")
    private Bill bill;

    @JsonProperty("additionalDetails")
    private Object additionalDetails;

    @Size(max=64)
    @JsonProperty("paymentDetailStatus")
    private PaymentDetailStatusEnum paymentDetailStatus;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails;

}
