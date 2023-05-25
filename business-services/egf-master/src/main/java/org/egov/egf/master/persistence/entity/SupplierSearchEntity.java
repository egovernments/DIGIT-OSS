package org.egov.egf.master.persistence.entity;

import org.egov.egf.master.domain.model.Supplier;
import org.egov.egf.master.domain.model.SupplierSearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class SupplierSearchEntity extends SupplierEntity {
	private String ids;
	private String sortBy;
	private Integer pageSize;
	private Integer offset;

	public Supplier toDomain() {
		Supplier supplier = new Supplier();
		super.toDomain(supplier);
		return supplier;
	}

	public SupplierSearchEntity toEntity(SupplierSearch supplierSearch) {
		super.toEntity((Supplier) supplierSearch);
		this.pageSize = supplierSearch.getPageSize();
		this.offset = supplierSearch.getOffset();
		this.sortBy = supplierSearch.getSortBy();
		this.ids = supplierSearch.getIds();
		return this;
	}

}