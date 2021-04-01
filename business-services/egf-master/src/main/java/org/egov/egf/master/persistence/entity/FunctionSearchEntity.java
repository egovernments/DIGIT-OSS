package org.egov.egf.master.persistence.entity;

import org.egov.egf.master.domain.model.Function;
import org.egov.egf.master.domain.model.FunctionSearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class FunctionSearchEntity extends FunctionEntity {
	private String ids;
	private String sortBy;
	private Integer pageSize;
	private Integer offset;

	public Function toDomain() {
		Function function = new Function();
		super.toDomain(function);
		return function;
	}

	public FunctionSearchEntity toEntity(FunctionSearch functionSearch) {
		super.toEntity((Function) functionSearch);
		this.pageSize = functionSearch.getPageSize();
		this.offset = functionSearch.getOffset();
		this.sortBy = functionSearch.getSortBy();
		this.ids = functionSearch.getIds();
		return this;
	}

}