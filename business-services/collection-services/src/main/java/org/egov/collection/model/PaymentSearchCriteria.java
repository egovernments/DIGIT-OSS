package org.egov.collection.model;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PaymentSearchCriteria {


    private List<String> ids;

    private List<String> billIds;

    private String tenantId;

    private List<String> receiptNumbers;

    private String status;



}
