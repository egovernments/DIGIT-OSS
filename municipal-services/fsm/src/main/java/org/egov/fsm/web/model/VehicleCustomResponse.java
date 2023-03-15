package org.egov.fsm.web.model;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.egov.common.contract.response.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VehicleCustomResponse {

    @JsonProperty("responseInfo")
    private ResponseInfo responseInfo = null;

    @JsonProperty("applicationStatusCount")
    @Valid
    private List<Map<String, Object>> applicationStatusCount = null;

    @JsonProperty("applicationIds")
    @Valid
    private List<String> applicationIdList = null;

}