package org.egov.infra.microservice.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RemittanceResponse {

    @JsonProperty("Remittance")
    private List<Remittance> remittances;

    public List<Remittance> getRemittances() {
        return remittances;
    }

    public void setRemittances(List<Remittance> remittances) {
        this.remittances = remittances;
    }

}
