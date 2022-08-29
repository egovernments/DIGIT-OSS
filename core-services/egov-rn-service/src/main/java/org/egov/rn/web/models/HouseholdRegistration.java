package org.egov.rn.web.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;

/**
 * A representation of Household
 */
@ApiModel(description = "A representation of Household")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-08-25T14:10:15.466+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class HouseholdRegistration extends Registration {
              /**
   * Gets or Sets gender
   */
  public enum GenderEnum {
    MALE("Male"),
    
    FEMALE("Female");

    private String value;

    GenderEnum(String value) {
      this.value = value;
    }

    @Override
    @JsonValue
    public String toString() {
      return String.valueOf(value);
    }

    @JsonCreator
    public static GenderEnum fromValue(String text) {
      for (GenderEnum b : GenderEnum.values()) {
        if (String.valueOf(b.value).equals(text)) {
          return b;
        }
      }
      return null;
    }
  }

        @JsonProperty("name")
        private String name = null;

        @JsonProperty("gender")
        private GenderEnum gender = null;

        @JsonProperty("dateOfBirth")
        private LocalDate dateOfBirth = null;

        @JsonProperty("householdId")
        private String householdId = null;

        @JsonProperty("isHead")
        private Boolean isHead = null;

        @JsonProperty("md5Hash")
        private String md5Hash = null;

}

