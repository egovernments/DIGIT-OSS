package org.egov.echallancalculation.web.models.demand;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;
import lombok.Builder.Default;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * BillDetail
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillDetail {

    @JsonProperty("id")
    private String id;

    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("demandId")
    private String demandId;

    @JsonProperty("billId")
    private String billId;

    @JsonProperty("expiryDate")
    private Long expiryDate;

    @JsonProperty("amount")
    private BigDecimal amount;

    @JsonProperty("fromPeriod")
    private Long fromPeriod;

    @JsonProperty("toPeriod")
    private Long toPeriod;

    @JsonProperty("additionalDetails")
    private Object additionalDetails;

    @JsonProperty("billAccountDetails")
    @Valid
    private List<BillAccountDetail> billAccountDetails;

    public BillDetail addBillAccountDetailsItem(BillAccountDetail billAccountDetailsItem) {
        if (this.billAccountDetails == null) {
            this.billAccountDetails = new ArrayList<>();
        }
        if (!this.billAccountDetails.contains(billAccountDetailsItem))
            this.billAccountDetails.add(billAccountDetailsItem);
        return this;
    }
}
