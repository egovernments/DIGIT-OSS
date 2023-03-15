package org.egov.egf.master.persistence.entity;

import org.egov.common.domain.model.Auditable;
import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.model.FinancialStatus;

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
public class FinancialStatusEntity extends AuditableEntity {
	public static final String TABLE_NAME = "egf_financialstatus";
	private String id;
	private String moduleType;
	private String code;
	private String name;
	private String description;

	public FinancialStatus toDomain() {
		FinancialStatus financialStatus = new FinancialStatus();
		super.toDomain(financialStatus);
		financialStatus.setId(this.id);
		financialStatus.setModuleType(this.moduleType);
		financialStatus.setCode(this.code);
		financialStatus.setName(this.name);
		financialStatus.setDescription(this.description);
		return financialStatus;
	}

	public FinancialStatusEntity toEntity(FinancialStatus financialStatus) {
		super.toEntity((Auditable) financialStatus);
		this.id = financialStatus.getId();
		this.moduleType = financialStatus.getModuleType();
		this.code = financialStatus.getCode();
		this.name = financialStatus.getName();
		this.description = financialStatus.getDescription();
		return this;
	}

}
