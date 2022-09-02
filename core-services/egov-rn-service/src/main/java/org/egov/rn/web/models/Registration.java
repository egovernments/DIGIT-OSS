package org.egov.rn.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.annotations.ApiModel;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.validation.annotation.Validated;

/**
 * A representation of registration. It can be of type Household
 */
@ApiModel(description = "A representation of registration. It can be of type Household")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-08-25T17:44:31.550+05:30")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "registrationType", visible = true )
@JsonSubTypes({
  @JsonSubTypes.Type(value = HouseholdRegistration.class, name = "HouseholdRegistration"),
})

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString
public class Registration   {
        @JsonProperty("tenantId")
        private String tenantId = null;

        @JsonProperty("registrationId")
        private String registrationId = null;

        @JsonProperty("dateOfRegistration")
        private Long dateOfRegistration = null;

        @JsonProperty("registrationType")
        private String registrationType = null;

        @JsonProperty("auditDetails")
        private AuditDetails auditDetails = null;


}

