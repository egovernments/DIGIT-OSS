package org.egov.egf.instrument.persistence.entity;

import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.domain.model.InstrumentTypeSearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class InstrumentTypeSearchEntity extends InstrumentTypeEntity {
    private String ids;
    private String sortBy;
    private Integer pageSize;
    private Integer offset;

    @Override
    public InstrumentType toDomain() {
        InstrumentType instrumentType = new InstrumentType();
        super.toDomain(instrumentType);
        return instrumentType;
    }

    public InstrumentTypeSearchEntity toEntity(InstrumentTypeSearch instrumentTypeSearch) {
        super.toEntity(instrumentTypeSearch);
        pageSize = instrumentTypeSearch.getPageSize();
        offset = instrumentTypeSearch.getOffset();
        sortBy = instrumentTypeSearch.getSortBy();
        ids = instrumentTypeSearch.getIds();
        return this;
    }

}