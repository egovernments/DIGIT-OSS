package org.egov.infra.microservice.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TaxHeadMasterResponse {

    @JsonProperty("ResponseInfo")
    private ResponseInfo responseInfo;

    @JsonProperty("TaxHeadMasters")
    private List<TaxHeadMaster> taxHeadMasters = new ArrayList<>();

    public ResponseInfo getResponseInfo() {
        return responseInfo;
    }

    public void setResponseInfo(ResponseInfo responseInfo) {
        this.responseInfo = responseInfo;
    }

    public List<TaxHeadMaster> getTaxHeadMasters() {
        return taxHeadMasters;
    }

    public void setTaxHeadMasters(List<TaxHeadMaster> taxHeadMasters) {
        this.taxHeadMasters = taxHeadMasters;
    }

}
