package org.egov.egf.master.persistence.entity;

import lombok.Data;
import org.egov.egf.master.domain.model.RecoverySearch;

import java.util.Date;

@Data
public class RecoverySearchEntity extends RecoveryEntity {
	private Date fromDate;
	private Date toDate;
	private Integer pageSize;
	private Integer offset = 0;
	private String sortBy;

	public RecoverySearchEntity toEntity(RecoverySearch recoverySearch) {

		super.toEntity(recoverySearch);
		this.pageSize = recoverySearch.getPageSize();
		this.sortBy = recoverySearch.getSortBy();
		return this;

	}

}
