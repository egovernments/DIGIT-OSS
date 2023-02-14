package digit.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.validation.annotation.Validated;

/**
 * TaxAndPayment
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-11-04T14:15:45.774+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaxAndPayment {
    @JsonProperty("businessService")
    private String businessService = null;

    @JsonProperty("taxAmount")
    private String taxAmount = null;

    @JsonProperty("amountPaid")
    private String amountPaid = null;


}

