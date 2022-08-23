package org.egov.rn.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.validation.annotation.Validated;

/**
 * org.egov.rn.web.models.web.User
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-08-23T14:53:48.053+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User   {
        @JsonProperty("tenantId")
        private String tenantId = null;

        @JsonProperty("uuid")
        private String uuid = null;

        @JsonProperty("userName")
        private String userName = null;

        @JsonProperty("name")
        private String name = null;

        @JsonProperty("mobileNumber")
        private String mobileNumber = null;

        @JsonProperty("emailId")
        private String emailId = null;


}

