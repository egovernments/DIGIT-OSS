package org.egov.web.models;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.egov.web.models.enums.Category;
import org.egov.web.models.enums.Purpose;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Bucket {

    @JsonProperty("taxHeadCode")
    private String taxHeadCode = null;

    @JsonProperty("category")
    private Category category = null;

    @JsonProperty("amount")
    private BigDecimal amount = null;

    @JsonProperty("adjustedAmount")
    private BigDecimal adjustedAmount = null;

    @JsonProperty("priority")
    private Integer priority = null;

    @JsonProperty("purpose")
    private Purpose purpose = null;

    @JsonProperty("entityId")
    private String entityId = null;

}
