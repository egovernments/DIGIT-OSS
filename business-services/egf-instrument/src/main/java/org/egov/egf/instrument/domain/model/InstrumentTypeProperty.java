package org.egov.egf.instrument.domain.model;

import javax.validation.constraints.NotNull;

import org.egov.common.domain.model.Auditable;
import org.egov.egf.master.web.contract.FinancialStatusContract;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class InstrumentTypeProperty extends Auditable {

    private String id;
    @NotNull
    private TransactionType transactionType;
    @NotNull
    private Boolean reconciledOncreate;
    @NotNull
    private FinancialStatusContract statusOnCreate;
    @NotNull
    private FinancialStatusContract statusOnUpdate;
    @NotNull
    private FinancialStatusContract statusOnReconcile;
    @NotNull
    private InstrumentType instrumentType;

}
