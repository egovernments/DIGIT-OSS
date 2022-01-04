package org.egov.domain.model;


import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * This class describe the set of fields contained in RequestInfoWrapper
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestInfoWrapper {

    @JsonProperty(value = "RequestInfo")
    private RequestInfo requestInfo;

}
