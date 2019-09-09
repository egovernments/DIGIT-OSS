package org.egov.egf.master.persistence.entity;

import org.egov.common.domain.model.Auditable;
import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.model.AccountCodePurpose;

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
public class AccountCodePurposeEntity extends AuditableEntity {
	public static final String TABLE_NAME = "egf_accountcodepurpose";
	public static final String SEQUENCE_NAME = "seq_egf_accountcodepurpose";
	private String id;
	private String name;

	public AccountCodePurpose toDomain() {
		AccountCodePurpose accountCodePurpose = new AccountCodePurpose();
		super.toDomain(accountCodePurpose);
		accountCodePurpose.setId(this.id);
		accountCodePurpose.setName(this.name);
		return accountCodePurpose;
	}

	public AccountCodePurposeEntity toEntity(AccountCodePurpose accountCodePurpose) {
		super.toEntity((Auditable) accountCodePurpose);
		this.id = accountCodePurpose.getId();
		this.name = accountCodePurpose.getName();
		return this;
	}

}
