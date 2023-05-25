package org.egov.egf.instrument.persistence.entity;

import org.egov.egf.instrument.domain.model.SurrenderReason;
import org.egov.egf.instrument.domain.model.SurrenderReasonSearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class SurrenderReasonSearchEntity extends SurrenderReasonEntity {
    private String ids;
    private String sortBy;
    private Integer pageSize;
    private Integer offset;

    @Override
    public SurrenderReason toDomain() {
        SurrenderReason surrenderReason = new SurrenderReason();
        super.toDomain(surrenderReason);
        return surrenderReason;
    }

    public SurrenderReasonSearchEntity toEntity(SurrenderReasonSearch surrenderReasonSearch) {
        super.toEntity(surrenderReasonSearch);
        pageSize = surrenderReasonSearch.getPageSize();
        offset = surrenderReasonSearch.getOffset();
        sortBy = surrenderReasonSearch.getSortBy();
        ids = surrenderReasonSearch.getIds();
        return this;
    }

}