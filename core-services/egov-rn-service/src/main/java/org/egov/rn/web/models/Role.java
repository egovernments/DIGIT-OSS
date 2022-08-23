package org.egov.rn.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import lombok.*;
import org.springframework.validation.annotation.Validated;

/**
 * minimal representation of the Roles in the system to be carried along in org.egov.rn.web.models.web.UserInfo with org.egov.rn.web.models.web.RequestInfo meta data. Actual authorization service to extend this to have more role related attributes
 */
@ApiModel(description = "minimal representation of the Roles in the system to be carried along in org.egov.rn.web.models.web.UserInfo with org.egov.rn.web.models.web.RequestInfo meta data. Actual authorization service to extend this to have more role related attributes ")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-08-23T14:53:48.053+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Role   {
        @JsonProperty("name")
        private String name = null;

        @JsonProperty("description")
        private String description = null;


}

