package org.egov.collection.model;

import java.math.BigDecimal;
import java.util.List;

import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class LegacyReceiptHeader {
    
    public static final String SEQ_LEGACY_RECEIPT_HEADER = "SEQ_LEGACY_RECEIPT_HEADER";
    
    
    @NotNull
    private Long id;
    
    private Long legacyReceiptId;
    
    @NotNull
    private String receiptNo;
    
    @NotNull
    private Long receiptDate;
    
    private String department;
    
    private String serviceCode;
    
    private String serviceName;
    
    private String consumerNo;
    
    private String consumerName;
    
    private BigDecimal totalAmount;
    
    private BigDecimal advanceAmount; 
    
    private List<LegacyReceiptDetails> legacyReceiptDetails;
    
    private BigDecimal adjustmentAmount;
    
    private String consumerAddress;
    
    private String payeeName;
    
    private String instrumentType;
    
    private Long instrumentDate;
    
    private String instrumentNo;
    
    private String bankName;
    
    private String manualreceiptnumber;
    
    private Long manualreceiptDate;
    @NotNull
    private String tenantId;
    
    private String remarks;

}
