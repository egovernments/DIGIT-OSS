package org.egov.pt.calculator.web.models;


import lombok.Data;

@Data
public class DemandSearchCriteria {

    private String tenantId;

    private String propertyId;

    private Long fromDate;

    private Long toDate;

}
