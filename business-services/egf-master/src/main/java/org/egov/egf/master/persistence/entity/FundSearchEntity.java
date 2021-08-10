package org.egov.egf.master.persistence.entity;

import java.util.Date;

import org.egov.egf.master.domain.model.FundSearch;

import lombok.Data;

@Data
public class FundSearchEntity extends FundEntity {
	private Date fromDate;
	private Date toDate;
	private Integer pageSize;
	private Integer offset = 0;
	private String sortBy;

	public FundSearchEntity toEntity(FundSearch fundSearch) {

		super.toEntity(fundSearch);
		this.pageSize = fundSearch.getPageSize();
		this.sortBy = fundSearch.getSortBy();
		return this;

	}

}
