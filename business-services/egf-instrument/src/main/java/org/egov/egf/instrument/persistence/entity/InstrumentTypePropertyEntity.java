package org.egov.egf.instrument.persistence.entity;

import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.domain.model.InstrumentTypeProperty;
import org.egov.egf.instrument.domain.model.TransactionType;
import org.egov.egf.master.web.contract.FinancialStatusContract;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Builder
public class InstrumentTypePropertyEntity extends AuditableEntity {
    public static final String TABLE_NAME = "egf_instrumenttypeproperty";
    private String id;
    private String transactionType;
    private Boolean reconciledOncreate;
    private String statusOnCreateId;
    private String statusOnUpdateId;
    private String statusOnReconcileId;
    private String instrumentTypeId;

    public InstrumentTypeProperty toDomain() {
        InstrumentTypeProperty instrumentTypeProperty = new InstrumentTypeProperty();
        super.toDomain(instrumentTypeProperty);
        instrumentTypeProperty.setTransactionType(TransactionType.valueOf(transactionType));
        instrumentTypeProperty.setReconciledOncreate(reconciledOncreate);
        instrumentTypeProperty.setStatusOnCreate(FinancialStatusContract.builder().code(statusOnCreateId).build());
        instrumentTypeProperty.setStatusOnUpdate(FinancialStatusContract.builder().code(statusOnUpdateId).build());
        instrumentTypeProperty
                .setStatusOnReconcile(FinancialStatusContract.builder().code(statusOnReconcileId).build());
        instrumentTypeProperty.setInstrumentType(InstrumentType.builder().id(instrumentTypeId).build());
        return instrumentTypeProperty;
    }

    public InstrumentTypePropertyEntity toEntity(InstrumentTypeProperty instrumentTypeProperty) {
        super.toEntity(instrumentTypeProperty);

        transactionType = instrumentTypeProperty.getTransactionType() != null
                ? instrumentTypeProperty.getTransactionType().toString() : null;

        reconciledOncreate = instrumentTypeProperty.getReconciledOncreate();
        statusOnCreateId = instrumentTypeProperty.getStatusOnCreate() != null
                ? instrumentTypeProperty.getStatusOnCreate().getCode() : null;
        statusOnUpdateId = instrumentTypeProperty.getStatusOnUpdate() != null
                ? instrumentTypeProperty.getStatusOnUpdate().getCode() : null;
        statusOnReconcileId = instrumentTypeProperty.getStatusOnReconcile() != null
                ? instrumentTypeProperty.getStatusOnReconcile().getCode() : null;

        instrumentTypeId = instrumentTypeProperty.getInstrumentType() != null
                ? instrumentTypeProperty.getInstrumentType().getId() : null;
        return this;
    }

}
