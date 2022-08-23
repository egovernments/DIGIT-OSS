package org.egov.rn.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import org.springframework.validation.annotation.Validated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

/**
 * The request object, containing all necessary information for registering an entity and the request body metadata
 */
@ApiModel(description = "The request object, containing all necessary information for registering an entity and the request body metadata")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-08-23T14:53:48.053+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegistrationRequest   {
        @JsonProperty("requestInfo")
        private RequestInfo requestInfo = null;

        @JsonProperty("Registration")
        private Registration registration = null;


}

