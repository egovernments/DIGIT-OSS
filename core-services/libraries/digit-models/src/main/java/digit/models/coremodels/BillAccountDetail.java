package digit.models.coremodels;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;

import javax.validation.constraints.Size;
import java.math.BigDecimal;

@Setter
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class BillAccountDetail {

    @Size(max = 64)
    @JsonProperty("id")
    private String id;

    @Size(max = 64)
    @JsonProperty("tenantId")
    private String tenantId;

    @Size(max = 64)
    @JsonProperty("billDetailId")
    private String billDetailId;

    @Size(max = 64)
    @JsonProperty("demandDetailId")
    private String demandDetailId;

    @JsonProperty("order")
    private Integer order;

    @JsonProperty("amount")
    private BigDecimal amount;

    @JsonProperty("adjustedAmount")
    private BigDecimal adjustedAmount;

    @JsonProperty("isActualDemand")
    private Boolean isActualDemand;

    @Size(max = 64)
    @JsonProperty("taxHeadCode")
    private String taxHeadCode;

    @JsonProperty("additionalDetails")
    private JsonNode additionalDetails;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails;
}
