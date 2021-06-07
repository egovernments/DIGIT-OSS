package org.egov.web.models.enums;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.egov.common.contract.request.RequestInfo;
import org.egov.web.models.Demand;

import javax.validation.Valid;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DemandApportionRequest {


    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo = null;


    @JsonProperty("tenantId")
    private String tenantId = null;

    @JsonProperty("Demands")
    @Valid
    private List<Demand> demands = null;





}
