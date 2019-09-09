package org.egov.collection.model;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LegacyReceiptDetails {
    public static final Object SEQ_LEGACY_RECEIPT_DETAILS = "seq_legacy_receipt_details";

    @NotNull
    private Long id;

    private String billNo;

    private Long billId;

    private Long billYear;

    private Long taxId;
    @NotNull
    private Long billDate;

    private String description;

    private BigDecimal currDemand;

    private BigDecimal arrDemand;

    private BigDecimal currCollection;

    private BigDecimal arrCollection;

    private BigDecimal currBalance;

    private BigDecimal arrBalance;

    @NotNull
    private Long receiptHeaderId;
    @NotNull
    private String tenantid;
}