package org.egov.egf.master.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.egov.egf.master.domain.model.Bank;
import org.egov.egf.master.domain.model.BankSearch;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class BankSearchEntity extends BankEntity {
    private String ids;
    private String sortBy;
    private Integer pageSize;
    private Integer offset;

    public Bank toDomain() {
        Bank bank = new Bank();
        super.toDomain(bank);
        return bank;
    }

    public BankSearchEntity toEntity(BankSearch bankSearch) {
        super.toEntity((Bank) bankSearch);
        this.pageSize = bankSearch.getPageSize();
        this.offset = bankSearch.getOffset();
        this.sortBy = bankSearch.getSortBy();
        this.ids = bankSearch.getIds();
        return this;
    }

} 