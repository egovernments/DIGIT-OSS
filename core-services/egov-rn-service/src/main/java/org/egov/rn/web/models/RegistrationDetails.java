package org.egov.rn.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.validation.annotation.Validated;

/**
 * RegistrationDetails
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-08-25T14:10:15.466+05:30")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "registrationDetailsType", visible = true )
@JsonSubTypes({
  @JsonSubTypes.Type(value = HouseholdRegistrationDetails.class, name = "HouseholdRegistrationDetails"),
})

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class RegistrationDetails   {
        @JsonProperty("registrationId")
        private String registrationId = null;

        @JsonProperty("registrationDetailsType")
        private String registrationDetailsType = null;


}

