package org.egov.egovnationaldashboardingest.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.response.ResponseInfo;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class IngestResponse {

    @JsonProperty("ResponseInfo")
    private ResponseInfo responseInfo = null;

}
