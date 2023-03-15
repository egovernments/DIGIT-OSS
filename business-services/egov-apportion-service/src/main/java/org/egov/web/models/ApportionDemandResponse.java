package org.egov.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import org.egov.common.contract.response.ResponseInfo;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class ApportionDemandResponse {


    @JsonProperty("ResponseInfo")
    private ResponseInfo responseInfo = null;

    @JsonProperty("tenantId")
    private String tenantId = null;

    @JsonProperty("demands")
    @Valid
    private List<Demand> demands = null;


    public ApportionDemandResponse addDemandsItem(Demand demand) {
        if (this.demands == null) {
            this.demands = new ArrayList<>();
        }
        this.demands.add(demand);
        return this;
    }

}
