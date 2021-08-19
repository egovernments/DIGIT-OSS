package org.egov.rb.pgr.v2.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

/**
 * Request object to fetch the report data
 */
@ApiModel(description = "Request object to fetch the report data")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2020-07-15T11:35:33.568+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ServiceRequestV2   {

        @NotNull
        @JsonProperty("RequestInfo")
        private RequestInfo requestInfo = null;

        @Valid
        @NonNull
        @JsonProperty("service")
        private Service service = null;

        @Valid
        @JsonProperty("workflow")
        private Workflow workflow = null;


}

