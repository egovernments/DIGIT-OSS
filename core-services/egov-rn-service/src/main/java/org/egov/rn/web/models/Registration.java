package org.egov.rn.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.experimental.SuperBuilder;
import org.springframework.validation.annotation.Validated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

/**
 * org.egov.rn.web.models.web.Registration
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-08-23T14:53:48.053+05:30")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "registrationType", visible = true )
@JsonSubTypes({
  @JsonSubTypes.Type(value = Household.class, name = "org.egov.rn.web.models.web.Household"),
})

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Registration   {
        @JsonProperty("name")
        private String name = null;

              /**
   * Gets or Sets registrationType
   */
  public enum RegistrationTypeEnum {
    HOUSEHOLD("org.egov.rn.web.models.web.Household");

    private String value;

    RegistrationTypeEnum(String value) {
      this.value = value;
    }

    @Override
    @JsonValue
    public String toString() {
      return String.valueOf(value);
    }

    @JsonCreator
    public static RegistrationTypeEnum fromValue(String text) {
      for (RegistrationTypeEnum b : RegistrationTypeEnum.values()) {
        if (String.valueOf(b.value).equals(text)) {
          return b;
        }
      }
      return null;
    }
  }

        @JsonProperty("registrationType")
        private RegistrationTypeEnum registrationType = null;


}

