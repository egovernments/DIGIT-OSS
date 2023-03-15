package org.egov.pt.calculator.web.models;

import lombok.Builder;
import lombok.Data;
import org.egov.pt.calculator.web.models.demand.DemandDetail;

import java.math.BigDecimal;

@Data
@Builder
public class DemandDetailAndCollection {

    private String taxHeadCode;

    private DemandDetail latestDemandDetail;

    private BigDecimal taxAmountForTaxHead;

    private BigDecimal collectionAmountForTaxHead;

}
