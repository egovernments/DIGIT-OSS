package org.egov.pg.models;

import lombok.*;

import javax.validation.constraints.NotNull;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

//class variables not used
public class InstrumentTypeProperty {

    @NotNull
    private TransactionType transactionType;
    @NotNull
    private Boolean reconciledOncreate;
    @NotNull
    private InstrumentStatus statusOnCreate;
    @NotNull
    private InstrumentStatus statusOnUpdate;
    @NotNull
    private InstrumentStatus statusOnReconcile;
}
