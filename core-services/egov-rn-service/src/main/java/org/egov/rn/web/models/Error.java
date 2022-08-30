package org.egov.rn.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;

import java.util.ArrayList;
import java.util.List;

import lombok.*;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;

/**
 * org.egov.rn.web.models.web.Error object will be returned as a part of reponse body in conjunction with org.egov.rn.web.models.web.ResponseInfo as part of ErrorResponse whenever the request processing status in the org.egov.rn.web.models.web.ResponseInfo is FAILED. HTTP return in this scenario will usually be HTTP 400.
 */
@ApiModel(description = "org.egov.rn.web.models.web.Error object will be returned as a part of reponse body in conjunction with org.egov.rn.web.models.web.ResponseInfo as part of ErrorResponse whenever the request processing status in the org.egov.rn.web.models.web.ResponseInfo is FAILED. HTTP return in this scenario will usually be HTTP 400.")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-08-23T14:53:48.053+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Error   {
        @JsonProperty("code")
        private String code = null;

        @JsonProperty("message")
        private String message = null;

        @JsonProperty("description")
        private String description = null;

        @JsonProperty("params")
        @Valid
        private List<String> params = null;


        public Error addParamsItem(String paramsItem) {
            if (this.params == null) {
            this.params = new ArrayList<>();
            }
        this.params.add(paramsItem);
        return this;
        }

}

