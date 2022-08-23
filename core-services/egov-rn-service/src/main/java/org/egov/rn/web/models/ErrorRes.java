package org.egov.rn.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;

import java.util.ArrayList;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

/**
 * All APIs will return org.egov.rn.web.models.web.ErrorRes in case of failure which will carry org.egov.rn.web.models.web.ResponseInfo as metadata and org.egov.rn.web.models.web.Error object as actual representation of error. In case of bulk apis, some apis may chose to return the array of org.egov.rn.web.models.web.Error objects to indicate individual failure.
 */
@ApiModel(description = "All APIs will return org.egov.rn.web.models.web.ErrorRes in case of failure which will carry org.egov.rn.web.models.web.ResponseInfo as metadata and org.egov.rn.web.models.web.Error object as actual representation of error. In case of bulk apis, some apis may chose to return the array of org.egov.rn.web.models.web.Error objects to indicate individual failure.")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-08-23T14:53:48.053+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ErrorRes   {
        @JsonProperty("org.egov.rn.web.models.web.ResponseInfo")
        private ResponseInfo responseInfo = null;

        @JsonProperty("Errors")
        @Valid
        private List<Error> errors = null;


        public ErrorRes addErrorsItem(Error errorsItem) {
            if (this.errors == null) {
            this.errors = new ArrayList<>();
            }
        this.errors.add(errorsItem);
        return this;
        }

}

