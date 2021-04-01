package org.egov.egf.instrument.persistence.entity;

import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.instrument.domain.model.DishonorReason;
import org.egov.egf.instrument.domain.model.Instrument;

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
public class DishonorReasonEntity extends AuditableEntity {
    public static final String TABLE_NAME = "egf_instrumentdishonor";
    private String id;
    private String reason;
    private String remarks;
    private String instrumentid;
    private String reversalVoucherId;
    private Long dishonorDate;

    public DishonorReason toDomain() {
        DishonorReason dishonorReason = new DishonorReason();
        super.toDomain(dishonorReason);
        dishonorReason.setId(id);
        dishonorReason.setReason(reason);
        dishonorReason.setRemarks(remarks);
        dishonorReason.setInstrument(instrumentid);
        dishonorReason.setReversalVoucherId(reversalVoucherId);
        dishonorReason.setDishonorDate(dishonorDate);
        return dishonorReason;
    }

    public DishonorReasonEntity toEntity(DishonorReason dishonorReason) {
        super.toEntity(dishonorReason);
        id = dishonorReason.getId();
        reason = dishonorReason.getReason();
        remarks = dishonorReason.getRemarks();
        instrumentid = dishonorReason.getInstrument();
        reversalVoucherId = dishonorReason.getReversalVoucherId();
        dishonorDate = dishonorReason.getDishonorDate();
        return this;
    }

}
