package org.egov.egf.instrument.persistence.entity;

import java.util.Date;

import org.egov.egf.instrument.domain.model.Instrument;
import org.egov.egf.instrument.domain.model.InstrumentSearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class InstrumentSearchEntity extends InstrumentEntity {
    private String ids;
    private String sortBy;
    private Integer pageSize;
    private Integer offset;
    private String instrumentTypes;
    private String financialStatuses;
    private Date transactionFromDate;
    private Date transactionToDate;
    private String receiptIds;

    @Override
    public Instrument toDomain() {
        Instrument instrument = new Instrument();
        super.toDomain(instrument);
        return instrument;
    }

    public InstrumentSearchEntity toEntity(InstrumentSearch instrumentSearch) {
        super.toEntity(instrumentSearch);
        pageSize = instrumentSearch.getPageSize();
        offset = instrumentSearch.getOffset();
        sortBy = instrumentSearch.getSortBy();
        ids = instrumentSearch.getIds();
        financialStatuses = instrumentSearch.getFinancialStatuses();
        instrumentTypes = instrumentSearch.getInstrumentTypes();
        transactionFromDate = instrumentSearch.getTransactionFromDate();
        transactionToDate = instrumentSearch.getTransactionToDate();
        receiptIds = instrumentSearch.getReceiptIds();
        return this;
    }

}