package org.egov.tlcalculator.web.models;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

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
public class Accessory   {

        @JsonProperty("id")
        private String id;

        @JsonProperty("tenantId")
        private String tenantId = null;

        @JsonProperty("active")
        private Boolean active;

        @JsonProperty("accessoryCategory")
        private String accessoryCategory = null;

        @JsonProperty("uom")
        private String uom = null;

        @JsonProperty("uomValue")
        private String uomValue = null;

        @Min(value = 0)
        @JsonProperty("count")
        private Integer count;

        @JsonProperty("auditDetails")
        private AuditDetails auditDetails = null;


}

