package org.egov.tl.web.models.calculation;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import lombok.*;
import org.egov.tl.web.models.TradeLicense;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Either tradelicense object or the application number is mandatory apart from tenantid.
 */
@ApiModel(description = "Either tradelicense object or the application number is mandatory apart from tenantid.")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-09-27T14:56:03.454+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CalulationCriteria {
        @JsonProperty("tradelicense")
        @Valid
private TradeLicense tradelicense = null;

        @JsonProperty("applicationNumber")
        @Size(min=2,max=64) 
private String applicationNumber = null;

        @JsonProperty("tenantId")
        @NotNull@Size(min=2,max=256) 
private String tenantId = null;


}

