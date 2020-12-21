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
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/**
 * Instance of Service request raised for a particular service. As per extension propsed in the Service definition \&quot;attributes\&quot; carry the input values requried by metadata definition in the structure as described by the corresponding schema.  * Any one of &#39;address&#39; or &#39;(lat and lang)&#39; or &#39;addressid&#39; is mandatory 
 */
@ApiModel(description = "Instance of Service request raised for a particular service. As per extension propsed in the Service definition \"attributes\" carry the input values requried by metadata definition in the structure as described by the corresponding schema.  * Any one of 'address' or '(lat and lang)' or 'addressid' is mandatory ")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2020-07-15T11:35:33.568+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Service   {
        @JsonProperty("citizen")
        private User citizen = null;

        @JsonProperty("id")
        private String id = null;

        @NotNull
        @JsonProperty("tenantId")
        private String tenantId = null;

        @NotNull
        @JsonProperty("serviceCode")
        private String serviceCode = null;

        @JsonProperty("serviceRequestId")
        private String serviceRequestId = null;

        @JsonProperty("description")
        private String description = null;

        @JsonProperty("accountId")
        private String accountId = null;

        @Max(5)
        @Min(1)
        @JsonProperty("rating")
        private Integer rating ;

        @JsonProperty("additionalDetail")
        private Object additionalDetail = null;

        @JsonProperty("applicationStatus")
        private String applicationStatus = null;

        @NotNull
        @JsonProperty("source")
        private String source = null;

        @Valid
        @NotNull
        @JsonProperty("address")
        private Address address = null;

        @JsonProperty("auditDetails")
        private AuditDetails auditDetails = null;


}

