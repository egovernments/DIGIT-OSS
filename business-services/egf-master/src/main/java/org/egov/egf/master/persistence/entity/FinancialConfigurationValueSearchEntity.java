package org.egov.egf.master.persistence.entity;

import org.egov.egf.master.domain.model.FinancialConfigurationValue;
import org.egov.egf.master.domain.model.FinancialConfigurationValueSearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class FinancialConfigurationValueSearchEntity extends FinancialConfigurationValueEntity {
    private String ids;
    private String sortBy;
    private Integer pageSize;
    private Integer offset;

    public FinancialConfigurationValue toDomain() {
        FinancialConfigurationValue financialConfigurationValue = new FinancialConfigurationValue();
        super.toDomain(financialConfigurationValue);
        return financialConfigurationValue;
    }

    public FinancialConfigurationValueSearchEntity toEntity(FinancialConfigurationValueSearch financialConfigurationValueSearch) {
        super.toEntity((FinancialConfigurationValue) financialConfigurationValueSearch);
        this.pageSize = financialConfigurationValueSearch.getPageSize();
        this.offset = financialConfigurationValueSearch.getOffset();
        this.sortBy = financialConfigurationValueSearch.getSortBy();
        this.ids = financialConfigurationValueSearch.getIds();
        return this;
    }

}