package org.egov.collection.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.egov.common.contract.request.RequestInfo;

@Getter
@Setter
@AllArgsConstructor
public class RequestInfoBody {

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

}