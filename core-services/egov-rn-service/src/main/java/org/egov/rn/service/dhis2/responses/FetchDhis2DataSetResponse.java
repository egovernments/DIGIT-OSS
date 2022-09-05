package org.egov.rn.service.dhis2.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.egov.rn.service.dhis2.requests.DHis2Dataset;

import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class FetchDhis2DataSetResponse {
    @JsonProperty("dataSets")
    private List<DHis2Dataset> dataSets = new ArrayList<DHis2Dataset>();

    public List<DHis2Dataset> getDataSets() {
        return dataSets;
    }

    public void setDataSets(List<DHis2Dataset> dataSets) {
        this.dataSets = dataSets;
    }

}
