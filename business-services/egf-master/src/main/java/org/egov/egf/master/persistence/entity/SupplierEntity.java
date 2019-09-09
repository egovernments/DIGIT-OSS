package org.egov.egf.master.persistence.entity;

import org.egov.common.domain.model.Auditable;
import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.model.Bank;
import org.egov.egf.master.domain.model.BankAccount;
import org.egov.egf.master.domain.model.Supplier;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Builder
public class SupplierEntity extends AuditableEntity {
	public static final String TABLE_NAME = "egf_supplier";
	public static final String SEQUENCE_NAME = "seq_egf_supplier";
	private String id;
	private String code;
	private String name;
	private String address;
	private String mobile;
	private String email;
	private String description;
	private Boolean active;
	private String panNo;
	private String tinNo;
	private String registationNo;
	private String bankAccountId;
	private String ifscCode;
	private String bankId;

	public Supplier toDomain() {
		Supplier supplier = new Supplier();
		super.toDomain(supplier);
		supplier.setId(this.id);
		supplier.setCode(this.code);
		supplier.setName(this.name);
		supplier.setAddress(this.address);
		supplier.setMobile(this.mobile);
		supplier.setEmail(this.email);
		supplier.setDescription(this.description);
		supplier.setActive(this.active);
		supplier.setPanNo(this.panNo);
		supplier.setTinNo(this.tinNo);
		supplier.setRegistationNo(this.registationNo);
		supplier.setBankAccount(BankAccount.builder().id(bankAccountId).build());
		supplier.setIfscCode(this.ifscCode);
		supplier.setBank(Bank.builder().id(bankId).build());
		return supplier;
	}

	public SupplierEntity toEntity(Supplier supplier) {
		super.toEntity((Auditable) supplier);
		this.id = supplier.getId();
		this.code = supplier.getCode();
		this.name = supplier.getName();
		this.address = supplier.getAddress();
		this.mobile = supplier.getMobile();
		this.email = supplier.getEmail();
		this.description = supplier.getDescription();
		this.active = supplier.getActive();
		this.panNo = supplier.getPanNo();
		this.tinNo = supplier.getTinNo();
		this.registationNo = supplier.getRegistationNo();
		this.bankAccountId = supplier.getBankAccount() != null ? supplier.getBankAccount().getId() : null;
		this.ifscCode = supplier.getIfscCode();
		this.bankId = supplier.getBank() != null ? supplier.getBank().getId() : null;
		return this;
	}

}
