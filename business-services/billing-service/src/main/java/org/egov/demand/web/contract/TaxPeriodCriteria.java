package org.egov.demand.web.contract;

import lombok.*;

import javax.validation.constraints.NotNull;

import org.egov.demand.model.enums.PeriodCycle;

import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class TaxPeriodCriteria {

    @NotNull
    private String tenantId;

    @NotNull
    private Set<String> service;
    
    private PeriodCycle periodCycle;

    private Set<String> id;

    private String code;

    private Long fromDate;

    private Long toDate;
    
    private Long date;
}
