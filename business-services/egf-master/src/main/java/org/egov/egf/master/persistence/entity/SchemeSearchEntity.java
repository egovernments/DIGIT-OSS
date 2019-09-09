package org.egov.egf.master.persistence.entity;

import org.egov.egf.master.domain.model.Scheme;
import org.egov.egf.master.domain.model.SchemeSearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class SchemeSearchEntity extends SchemeEntity {
	private String ids;
	private String sortBy;
	private Integer pageSize;
	private Integer offset;

	public Scheme toDomain() {
		Scheme scheme = new Scheme();
		super.toDomain(scheme);
		return scheme;
	}

	public SchemeSearchEntity toEntity(SchemeSearch schemeSearch) {
		super.toEntity((Scheme) schemeSearch);
		this.pageSize = schemeSearch.getPageSize();
		this.offset = schemeSearch.getOffset();
		this.sortBy = schemeSearch.getSortBy();
		this.ids = schemeSearch.getIds();
		return this;
	}

}