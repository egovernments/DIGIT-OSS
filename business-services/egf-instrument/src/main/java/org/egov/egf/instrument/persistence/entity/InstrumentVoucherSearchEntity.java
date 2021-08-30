package org.egov.egf.instrument.persistence.entity;

import org.egov.egf.instrument.domain.model.InstrumentVoucher;
import org.egov.egf.instrument.domain.model.InstrumentVoucherSearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class InstrumentVoucherSearchEntity extends InstrumentVoucherEntity {
    private String ids;
    private String sortBy;
    private Integer pageSize;
    private Integer offset;
    private String instruments;
    private String receiptIds;

    @Override
    public InstrumentVoucher toDomain() {
        InstrumentVoucher instrumentVoucher = new InstrumentVoucher();
        super.toDomain(instrumentVoucher);
        return instrumentVoucher;
    }

    public InstrumentVoucherSearchEntity toEntity(InstrumentVoucherSearch instrumentVoucherSearch) {
        super.toEntity(instrumentVoucherSearch);
        pageSize = instrumentVoucherSearch.getPageSize();
        offset = instrumentVoucherSearch.getOffset();
        sortBy = instrumentVoucherSearch.getSortBy();
        ids = instrumentVoucherSearch.getIds();
        instruments = instrumentVoucherSearch.getInstruments();
        receiptIds = instrumentVoucherSearch.getReceiptIds();
        return this;
    }

}