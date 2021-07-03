package org.egov.tl.web.models;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.egov.tl.web.models.Boundary;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

/**
 * Representation of a address. Indiavidual APIs may choose to extend from this using allOf if more details needed to be added in their case. 
 */
@ApiModel(description = "Representation of a address. Indiavidual APIs may choose to extend from this using allOf if more details needed to be added in their case. ")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-09-18T17:06:11.263+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Address   {

        @Size(max=64)
        @SafeHtml
        @JsonProperty("id")
        private String id;

        @Size(max=64)
        @SafeHtml
        @JsonProperty("tenantId")
        private String tenantId = null;

        @Size(max=64)
        @SafeHtml
        @JsonProperty("doorNo")
        private String doorNo = null;

        @JsonProperty("latitude")
        private Double latitude = null;

        @JsonProperty("longitude")
        private Double longitude = null;

        @Size(max=64)
        @SafeHtml
        @JsonProperty("addressId")
        private String addressId = null;

        @Size(max=64)
        @SafeHtml
        @JsonProperty("addressNumber")
        private String addressNumber = null;

        @Size(max=64)
        @SafeHtml
        @JsonProperty("type")
        private String type = null;

        @SafeHtml
        @JsonProperty("addressLine1")
        private String addressLine1 = null;

        @Size(max=256)
        @SafeHtml
        @JsonProperty("addressLine2")
        private String addressLine2 = null;

        @Size(max=64)
        @SafeHtml
        @JsonProperty("landmark")
        private String landmark = null;

        @Size(max=64)
        @SafeHtml
        @JsonProperty("city")
        private String city = null;

        @Size(max=64)
        @SafeHtml
        @JsonProperty("pincode")
        private String pincode = null;

        @Size(max=64)
        @SafeHtml
        @JsonProperty("detail")
        private String detail = null;

        @Size(max=64)
        @SafeHtml
        @JsonProperty("buildingName")
        private String buildingName = null;

        @Size(max=64)
        @SafeHtml
        @JsonProperty("street")
        private String street = null;

        @Valid
        @JsonProperty("locality")
        private Boundary locality = null;


}

