package org.egov.rb.pgr.v2.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import org.hibernate.validator.constraints.SafeHtml;
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
        @SafeHtml
        @JsonProperty("tenantId")
        private String tenantId = null;

        @SafeHtml
        @JsonProperty("doorNo")
        private String doorNo = null;

        @SafeHtml
        @JsonProperty("plotNo")
        private String plotNo = null;

        @SafeHtml
        @JsonProperty("id")
        private String id = null;

        @SafeHtml
        @JsonProperty("landmark")
        private String landmark = null;

        @SafeHtml
        @JsonProperty("city")
        private String city = null;

        @SafeHtml
        @JsonProperty("district")
        private String district = null;

        @SafeHtml
        @JsonProperty("region")
        private String region = null;

        @SafeHtml
        @JsonProperty("state")
        private String state = null;

        @SafeHtml
        @JsonProperty("country")
        private String country = null;

        @SafeHtml
        @JsonProperty("pincode")
        private String pincode = null;

        @JsonProperty("additionDetails")
        private Object additionDetails = null;

        @SafeHtml
        @JsonProperty("buildingName")
        private String buildingName = null;

        @SafeHtml
        @JsonProperty("street")
        private String street = null;

        @Valid
        @JsonProperty("locality")
        private Boundary locality = null;

        @JsonProperty("geoLocation")
        private GeoLocation geoLocation = null;


}

