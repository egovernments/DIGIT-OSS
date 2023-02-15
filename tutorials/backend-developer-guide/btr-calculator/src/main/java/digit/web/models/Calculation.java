package digit.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.validation.annotation.Validated;

/**
 * Calculation
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-11-04T14:15:45.774+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Calculation {
    @JsonProperty("applicationNumber")
    private String applicationNumber = null;

    @JsonProperty("totalAmount")
    private Double totalAmount = null;

    @JsonProperty("tenantId")
    private String tenantId = null;


}

