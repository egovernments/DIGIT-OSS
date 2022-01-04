package org.egov.egf.master.persistence.entity;

import org.egov.egf.master.domain.model.ChartOfAccountDetail;
import org.egov.egf.master.domain.model.ChartOfAccountDetailSearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class ChartOfAccountDetailSearchEntity extends ChartOfAccountDetailEntity {
    private String ids;
    private String chartOfAccountIds;
    private String sortBy;
    private Integer pageSize;
    private Integer offset;

    public ChartOfAccountDetail toDomain() {
        ChartOfAccountDetail chartOfAccountDetail = new ChartOfAccountDetail();
        super.toDomain(chartOfAccountDetail);
        return chartOfAccountDetail;
    }

    public ChartOfAccountDetailSearchEntity toEntity(ChartOfAccountDetailSearch chartOfAccountDetailSearch) {
        super.toEntity((ChartOfAccountDetail) chartOfAccountDetailSearch);
        this.pageSize = chartOfAccountDetailSearch.getPageSize();
        this.offset = chartOfAccountDetailSearch.getOffset();
        this.sortBy = chartOfAccountDetailSearch.getSortBy();
        this.ids = chartOfAccountDetailSearch.getIds();
        this.chartOfAccountIds = chartOfAccountDetailSearch.getChartOfAccountIds();
        return this;
    }

}