package org.egov.pgr.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import org.springframework.validation.annotation.Validated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

import javax.validation.Valid;

/**
 * Representation of a address. Indiavidual APIs may choose to extend from this using allOf if more details needed to be added in their case. 
 */
@ApiModel(description = "Representation of a address. Indiavidual APIs may choose to extend from this using allOf if more details needed to be added in their case. ")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2020-07-15T11:35:33.568+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Address   {
        @JsonProperty("tenantId")
        private String tenantId = null;

        @JsonProperty("doorNo")
        private String doorNo = null;

        @JsonProperty("plotNo")
        private String plotNo = null;

        @JsonProperty("id")
        private String id = null;

        @JsonProperty("landmark")
        private String landmark = null;

        @JsonProperty("city")
        private String city = null;

        @JsonProperty("district")
        private String district = null;

        @JsonProperty("region")
        private String region = null;

        @JsonProperty("state")
        private String state = null;

        @JsonProperty("country")
        private String country = null;

        @JsonProperty("pincode")
        private String pincode = null;

        @JsonProperty("additionDetails")
        private Object additionDetails = null;

        @JsonProperty("buildingName")
        private String buildingName = null;

        @JsonProperty("street")
        private String street = null;

        @Valid
        @JsonProperty("locality")
        private Boundary locality = null;

        @JsonProperty("geoLocation")
        private GeoLocation geoLocation = null;


}

