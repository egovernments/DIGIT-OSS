package digit.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import lombok.*;
import org.springframework.validation.annotation.Validated;

/**
 * Criteria to calculate charges for birth registration.
 */
@ApiModel(description = "Criteria to calculate charges for birth registration.")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-11-04T14:15:45.774+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CalculationCriteria {
    @JsonProperty("birthregistrationapplication")
    private BirthRegistrationApplication birthregistrationapplication = null;

    @JsonProperty("applicationNumber")
    private String applicationNumber = null;

    @JsonProperty("tenantId")
    private String tenantId = null;


}

