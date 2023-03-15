package org.egov.egf.master.persistence.entity;

import org.egov.common.domain.model.Auditable;
import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.enums.BankAccountType;
import org.egov.egf.master.domain.model.BankAccount;
import org.egov.egf.master.domain.model.BankBranch;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.Fund;

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
public class BankAccountEntity extends AuditableEntity {
	public static final String TABLE_NAME = "egf_bankaccount";
	public static final String SEQUENCE_NAME = "seq_egf_bankaccount";
	private String id;
	private String bankBranchId;
	private String chartOfAccountId;
	private String fundId;
	private String accountNumber;
	private String accountType;
	private String description;
	private Boolean active;
	private String payTo;
	private String type;

	public BankAccount toDomain() {
		BankAccount bankAccount = new BankAccount();
		super.toDomain(bankAccount);
		bankAccount.setId(this.id);
		bankAccount.setBankBranch(BankBranch.builder().id(bankBranchId).build());
		bankAccount.setChartOfAccount(ChartOfAccount.builder().id(chartOfAccountId).build());
		bankAccount.setFund(Fund.builder().id(fundId).build());
		bankAccount.setAccountNumber(this.accountNumber);
		bankAccount.setAccountType(this.accountType);
		bankAccount.setDescription(this.description);
		bankAccount.setActive(this.active);
		bankAccount.setPayTo(this.payTo);
		bankAccount.setType(BankAccountType.valueOf(this.type));
		return bankAccount;
	}

	public BankAccountEntity toEntity(BankAccount bankAccount) {
		super.toEntity((Auditable) bankAccount);
		this.id = bankAccount.getId();
		this.bankBranchId = bankAccount.getBankBranch() != null ? bankAccount.getBankBranch().getId() : null;
		this.chartOfAccountId = bankAccount.getChartOfAccount() != null ? bankAccount.getChartOfAccount().getId()
				: null;
		this.fundId = bankAccount.getFund() != null ? bankAccount.getFund().getId() : null;
		this.accountNumber = bankAccount.getAccountNumber();
		this.accountType = bankAccount.getAccountType();
		this.description = bankAccount.getDescription();
		this.active = bankAccount.getActive();
		this.payTo = bankAccount.getPayTo();
		this.type = bankAccount.getType() != null ? bankAccount.getType().toString() : null;
		return this;
	}

}
