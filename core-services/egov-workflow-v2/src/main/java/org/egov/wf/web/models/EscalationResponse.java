package org.egov.wf.web.models;


import com.fasterxml.jackson.annotation.JsonProperty;
import org.egov.common.contract.response.ResponseInfo;

import javax.validation.Valid;
import java.util.List;

public class EscalationResponse {

    @JsonProperty("ResponseInfo")
    private ResponseInfo responseInfo;

    @JsonProperty("businessIds")
    private List<String> businessIds;


}
