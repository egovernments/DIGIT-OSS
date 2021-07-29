package org.egov.pt.models.oldProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.egov.pt.models.enums.Category;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaxHeadEstimate {

    private String taxHeadCode;

    private BigDecimal estimateAmount;

    private Category category;
}
