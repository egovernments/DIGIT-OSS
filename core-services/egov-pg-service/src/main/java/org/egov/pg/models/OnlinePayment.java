package org.egov.pg.models;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OnlinePayment {

    private Long id;

    private String receiptHeader;

    private String paymentGatewayName;

    private Long transactionDate;

    private BigDecimal transactionAmount;

    private String transactionNumber;

    private String authorisationStatusCode;

    private String status;

    private String remarks;

    private String callBackUrl;

    private String tenantId;

    private AuditDetails auditDetails;


}
