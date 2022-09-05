package org.egov.rn.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.validation.annotation.Validated;

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
@ToString(callSuper = true)
public class HouseholdRegistration extends Registration {

        @JsonProperty("name")
        private String name = null;

        @JsonProperty("gender")
        private String gender = null;

        @JsonProperty("dateOfBirth")
        private Long dateOfBirth = null;

        @JsonProperty("householdId")
        private String householdId = null;

        @JsonProperty("isHead")
        private Boolean isHead = null;

        @JsonProperty("md5Hash")
        private String md5Hash = null;

        public String getName() {
                return name;
        }

        public String getGender() {
                return gender;
        }

        public Long getDateOfBirth() {
                return dateOfBirth;
        }

        public String getHouseholdId() {
                return householdId;
        }

        public Boolean getHead() {
                return isHead;
        }

        public String getMd5Hash() {
                return md5Hash;
        }
}

