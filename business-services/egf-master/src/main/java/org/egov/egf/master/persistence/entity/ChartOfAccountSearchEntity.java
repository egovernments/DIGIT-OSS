package org.egov.egf.master.persistence.entity;

import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.ChartOfAccountSearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class ChartOfAccountSearchEntity extends ChartOfAccountEntity {
	private String ids;
	private String sortBy;
	private Integer pageSize;
	private Integer offset;
	private String glcodes;
	
	public ChartOfAccount toDomain() {
		ChartOfAccount chartOfAccount = new ChartOfAccount();
		super.toDomain(chartOfAccount);
		return chartOfAccount;
	}

	public ChartOfAccountSearchEntity toEntity(ChartOfAccountSearch chartOfAccountSearch) {
		super.toEntity((ChartOfAccount) chartOfAccountSearch);
		this.pageSize = chartOfAccountSearch.getPageSize();
		this.offset = chartOfAccountSearch.getOffset();
		this.sortBy = chartOfAccountSearch.getSortBy();
		this.ids = chartOfAccountSearch.getIds();
		this.glcodes = chartOfAccountSearch.getGlcodes();
		return this;
	}

}