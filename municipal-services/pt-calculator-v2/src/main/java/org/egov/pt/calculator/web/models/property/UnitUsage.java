package org.egov.pt.calculator.web.models.property;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Details of unit usage for a period.
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-05-11T14:12:44.497+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UnitUsage   {
        @JsonProperty("usage")
        private String usage;

        @JsonProperty("fromDate")
        private Long fromDate;

        @JsonProperty("toDate")
        private Long toDate;

              /**
   * end date for the unit usage.
   */
  public enum OccupancyTypeEnum {
    OWNER("Owner"),
    
    TENANT("Tenant");

    private String value;

    OccupancyTypeEnum(String value) {
      this.value = value;
    }

    @Override
    @JsonValue
    public String toString() {
      return String.valueOf(value);
    }

    @JsonCreator
    public static OccupancyTypeEnum fromValue(String text) {
      for (OccupancyTypeEnum b : OccupancyTypeEnum.values()) {
        if (String.valueOf(b.value).equals(text)) {
          return b;
        }
      }
      return null;
    }
  }

        @JsonProperty("occupancyType")
        private OccupancyTypeEnum occupancyType;


}

