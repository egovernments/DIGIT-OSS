package org.egov.collection.web.contract;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotNull;
import java.util.List;
@Setter
@Getter
@ToString
public class ReceiptSearchGetRequest {
    private List<String> receiptNumbers;
    
    private Boolean isLegacy=false;

    private List<String> consumerCode;

    private Long fromDate;
    
    private String consumerNo;
    
    private String serviceName;
    
    private String limit;
    
    private Long toDate;

    private String collectedBy;

    private String status;

    private String paymentType;

    private String classification;

    private String businessCode;

    @NotNull
    private String tenantId;
    
    private String sortBy;
    
    private String sortOrder;

    private String transactionId;

    private List<String> manualReceiptNumbers;

    private List<String> billIds;

    private boolean receiptDetailsRequired = false;

    private Integer pageSize;

    private Integer offset;

}
