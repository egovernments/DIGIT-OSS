package org.egov.pt.web.models;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Address
 */
@Validated
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Address   {

        @Size(max=64)
        @JsonProperty("id")
        private String id;

        @Size(max=256)
        @JsonProperty("tenantId")
        private String tenantId;

        @JsonProperty("latitude")
        private Double latitude;

        @JsonProperty("longitude")
        private Double longitude;

        @Size(max=64)
        @JsonProperty("addressId")
        private String addressId;

        @Size(max=64)
        @JsonProperty("addressNumber")
        private String addressNumber;

        @Size(max=64)
        @JsonProperty("type")
        private String type;

        @Size(max=1024)
        @JsonProperty("addressLine1")
        private String addressLine1;

        @Size(max=1024)
        @JsonProperty("addressLine2")
        private String addressLine2;

        @Size(max=1024)
        @JsonProperty("landmark")
        private String landmark;

        @Size(max=64)
        @JsonProperty("doorNo")
        private String doorNo;

        @NotNull
        @Size(max=1024)
        @JsonProperty("city")
        private String city;

        @Size(max=6)
        @JsonProperty("pincode")
        private String pincode;

        @Size(max=2048)
        @JsonProperty("detail")
        private String detail;

        @Size(max=1024)
        @JsonProperty("buildingName")
        private String buildingName;

        @Size(max=1024)
        @JsonProperty("street")
        private String street;

        @Valid
        @JsonProperty("locality")
        private Boundary locality;


}

