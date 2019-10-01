package org.egov.collection.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.egov.collection.model.enums.PaymentDetailStatusEnum;
import org.egov.collection.model.enums.PaymentStatusEnum;
import org.egov.collection.web.contract.Bill;

import java.math.BigDecimal;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDetail {

    @JsonProperty("id")
    private String id;

    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("totalDue")
    private BigDecimal totalDue;

    @JsonProperty("totalAmountPaid")
    private BigDecimal totalAmountPaid;

    @JsonProperty("receiptNumber")
    private String receiptNumber;

    @JsonProperty("businessService")
    private String businessService;

    @JsonProperty("billId")
    private String billId;

    @JsonProperty("bill")
    private Bill bill;

    @JsonProperty("additionalDetails")
    private Object additionalDetails;

    @JsonProperty("paymentDetailStatus")
    private PaymentDetailStatusEnum paymentDetailStatus;

}
