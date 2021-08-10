package org.egov.tlcalculator.web.models.tradelicense;


import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import lombok.*;
import org.egov.tlcalculator.web.models.AuditDetails;
import org.springframework.validation.annotation.Validated;

/**
 * A Object holds the basic data for a Trade License
 */
@ApiModel(description = "A Object holds the basic data for a Trade License")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-09-18T17:06:11.263+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
public class TradeUnit   {

        @JsonProperty("id")
        private String id;

        @JsonProperty("tenantId")
        private String tenantId = null;

        @JsonProperty("active")
        private Boolean active;

        @JsonProperty("tradeType")
        private String tradeType = null;

        @JsonProperty("uom")
        private String uom = null;

        @JsonProperty("uomValue")
        private String uomValue = null;

        @JsonProperty("auditDetails")
        private AuditDetails auditDetails = null;


}

