package org.egov.infra.microservice.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(value = Include.NON_NULL)
public class FinancialStatusResponse {
    private List<FinancialStatus> financialStatuses;

    public List<FinancialStatus> getFinancialStatuses() {
        return financialStatuses;
    }

    public void setFinancialStatuses(List<FinancialStatus> financialStatuses) {
        this.financialStatuses = financialStatuses;
    }

}