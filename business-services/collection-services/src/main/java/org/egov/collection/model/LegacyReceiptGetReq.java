package org.egov.collection.model;

import java.util.List;

import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LegacyReceiptGetReq {
    private List<String> receiptNumbers;

    private Long fromDate;

    private String consumerNo;

    private String limit;

    private Long toDate;

    private String serviceName;

    @NotNull
    private String tenantId;

    private String sortBy;

    private String sortOrder;

}
