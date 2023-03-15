package org.egov.egf.instrument.persistence.entity;

import org.egov.egf.instrument.domain.model.DishonorReason;
import org.egov.egf.instrument.domain.model.DishonorReasonSearch;
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

public class DishonorReasonSearchEntity extends DishonorReasonEntity {
    private String ids;
    private String sortBy;
    private Integer pageSize;
    private Integer offset;

    @Override
    public DishonorReason toDomain() {
    	DishonorReason dishonorReason = new DishonorReason();
        super.toDomain(dishonorReason);
        return dishonorReason;
    }

    public DishonorReasonSearchEntity toEntity(DishonorReasonSearch dishonorReasonSearch) {
        super.toEntity(dishonorReasonSearch);
        pageSize = dishonorReasonSearch.getPageSize();
        offset = dishonorReasonSearch.getOffset();
        sortBy = dishonorReasonSearch.getSortBy();
        ids = dishonorReasonSearch.getIds();
        return this;
    }

}