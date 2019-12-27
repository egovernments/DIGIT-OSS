package org.egov.pt.calculator.web.models.property;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * UnitAdditionalDetails
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UnitAdditionalDetails   {


        @JsonProperty("innerDimensionsKnown")
        private boolean innerDimensionsKnown;

        //Rooms Area
        @JsonProperty("roomsArea")
        private BigDecimal roomsArea;

        //Balcony, Corridor, Kitchen, Store Room Area
        @JsonProperty("commonArea")
        private BigDecimal commonArea;

        //Garage Area
        @JsonProperty("garageArea")
        private BigDecimal garageArea;

        //Bathroom & Staircase Area
        @JsonProperty("bathroomArea")
        private BigDecimal bathroomArea;

        // //Covered Area/ Plinth Area
        // @JsonProperty("coveredArea")
        // private double coveredArea;

}

