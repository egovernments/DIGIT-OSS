package org.egov.pt.web.models;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import lombok.*;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import io.swagger.annotations.ApiModel;

/**
 * This is lightweight property object that can be used as reference by definitions needing property linking. Actual Property Object extends this to include more elaborate attributes of the property.
 */
@ApiModel(description = "This is lightweight property object that can be used as reference by definitions needing property linking. Actual Property Object extends this to include more elaborate attributes of the property.")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-05-11T14:12:44.497+05:30")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

    @EqualsAndHashCode(of= {"propertyId","tenantId"})
    public class PropertyInfo   {

    @Size(max=64)
    @JsonProperty("propertyId")
    public String propertyId;

    @Size(max=256)
    @JsonProperty("tenantId")
    public String tenantId;

    @Size(max=64)
    @JsonProperty("acknowldgementNumber")
    public String acknowldgementNumber;

    @Size(max=256)
    @Pattern(regexp = "^[//a-zA-Z0-9#://-]*$", message = "Invalid existing property Id. should be AlphaNumeric with -, /, #, : special characters allowed")
    @JsonProperty("oldPropertyId")
    public String oldPropertyId;

              /**
   * status of the Property
   */
    public enum StatusEnum {
    ACTIVE("ACTIVE"),

    INACTIVE("INACTIVE");

    private String value;

    StatusEnum(String value) {
      this.value = value;
    }

    @Override
    @JsonValue
    public String toString() {
      return String.valueOf(value);
    }

    @JsonCreator
    public static StatusEnum fromValue(String text) {
      for (StatusEnum b : StatusEnum.values()) {
        if (String.valueOf(b.value).equals(text)) {
          return b;
        }
      }
      return null;
    }
    }

    @JsonProperty("status")
    public StatusEnum status;

    @Valid
    @JsonProperty("address")
    public Address address;




   /* protected PropertyInfo(String propertyId, String tenantId, String acknowldgementNumber, String oldPropertyId, StatusEnum status, Address address) {
        this.propertyId = propertyId;
        this.tenantId = tenantId;
        this.acknowldgementNumber = acknowldgementNumber;
        this.oldPropertyId = oldPropertyId;
        this.status = status;
        this.address = address;
    }*/
}

