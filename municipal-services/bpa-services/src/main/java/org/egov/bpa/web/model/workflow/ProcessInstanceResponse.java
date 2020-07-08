package org.egov.bpa.web.model.workflow;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.response.ResponseInfo;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

/**
 * Contract class to send response. Array of TradeLicense items are used in case of search results or response for create, whereas single TradeLicense item is used for update
 */
@ApiModel(description = "Contract class to send response. Array of TradeLicense items are used in case of search results or response for create, whereas single TradeLicense item is used for update")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-12-04T11:26:25.532+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProcessInstanceResponse {
        @JsonProperty("ResponseInfo")
        private ResponseInfo responseInfo;

        @JsonProperty("ProcessInstances")
        @Valid
        private List<ProcessInstance> processInstances;


        public ProcessInstanceResponse addProceInstanceItem(ProcessInstance proceInstanceItem) {
            if (this.processInstances == null) {
            this.processInstances = new ArrayList<>();
            }
        this.processInstances.add(proceInstanceItem);
        return this;
        }

}

