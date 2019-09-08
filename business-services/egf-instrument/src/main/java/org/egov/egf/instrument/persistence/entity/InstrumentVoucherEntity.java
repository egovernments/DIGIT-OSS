package org.egov.egf.instrument.persistence.entity;

import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.instrument.domain.model.Instrument;
import org.egov.egf.instrument.domain.model.InstrumentVoucher;

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
public class InstrumentVoucherEntity extends AuditableEntity {
    public static final String TABLE_NAME = "egf_instrumentvoucher";
    private String id;
    private String instrumentId;
    private String voucherHeaderId;
    private String receiptHeaderId;

    public InstrumentVoucher toDomain() {
        InstrumentVoucher instrumentVoucher = new InstrumentVoucher();
        super.toDomain(instrumentVoucher);
        instrumentVoucher.setInstrument(Instrument.builder().id(instrumentId).build());
        instrumentVoucher.setVoucherHeaderId(voucherHeaderId);
        instrumentVoucher.setReceiptHeaderId(receiptHeaderId);
        return instrumentVoucher;
    }

    public InstrumentVoucherEntity toEntity(InstrumentVoucher instrumentVoucher) {
        super.toEntity(instrumentVoucher);
        instrumentId = instrumentVoucher.getInstrument() != null ? instrumentVoucher.getInstrument().getId()
                : null;
        voucherHeaderId = instrumentVoucher.getVoucherHeaderId();
        receiptHeaderId = instrumentVoucher.getReceiptHeaderId();
        return this;
    }

}
