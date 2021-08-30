package org.egov.egf.master.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.egov.common.domain.model.Auditable;
import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.model.AccountCodePurpose;
import org.egov.egf.master.domain.model.ChartOfAccount;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChartOfAccountEntity extends AuditableEntity
{
    public static final String TABLE_NAME = "egf_chartofaccount";
    public static final String SEQUENCE_NAME = "seq_egf_chartofaccount";
    private String id;
    private String glcode;
    private String name;
    private String accountCodePurposeId;
    private String description;
    private Boolean isActiveForPosting;
    private String parentId;
    private Character type;
    private Long classification;
    private Boolean functionRequired;
    private Boolean budgetCheckRequired;
    private String majorCode;
    private Boolean isSubLedger;

    public ChartOfAccount toDomain() {
        ChartOfAccount chartOfAccount = new ChartOfAccount();
        super.toDomain(chartOfAccount);
        chartOfAccount.setId(this.id);
        chartOfAccount.setGlcode(this.glcode);
        chartOfAccount.setName(this.name);
        chartOfAccount.setAccountCodePurpose(AccountCodePurpose.builder().id(accountCodePurposeId).build());
        chartOfAccount.setDescription(this.description);
        chartOfAccount.setIsActiveForPosting(this.isActiveForPosting);
        chartOfAccount.setParentId(ChartOfAccount.builder().id(parentId).build());
        chartOfAccount.setType(this.type);
        chartOfAccount.setClassification(this.classification);
        chartOfAccount.setFunctionRequired(this.functionRequired);
        chartOfAccount.setBudgetCheckRequired(this.budgetCheckRequired);
        chartOfAccount.setMajorCode(this.majorCode);
        chartOfAccount.setIsSubLedger(this.isSubLedger);
        return chartOfAccount;
    }

    public ChartOfAccountEntity toEntity(ChartOfAccount chartOfAccount) {
        super.toEntity((Auditable) chartOfAccount);
        this.id = chartOfAccount.getId();
        this.glcode = chartOfAccount.getGlcode();
        this.name = chartOfAccount.getName();
        this.accountCodePurposeId = chartOfAccount.getAccountCodePurpose() != null ? chartOfAccount.getAccountCodePurpose()
                .getId() : null;
        this.description = chartOfAccount.getDescription();
        this.isActiveForPosting = chartOfAccount.getIsActiveForPosting();
        this.parentId = chartOfAccount.getParentId() != null ? chartOfAccount.getParentId().getId() : null;
        this.type = chartOfAccount.getType();
        this.classification = chartOfAccount.getClassification();
        this.functionRequired = chartOfAccount.getFunctionRequired();
        this.budgetCheckRequired = chartOfAccount.getBudgetCheckRequired();
        this.majorCode = chartOfAccount.getMajorCode();
        this.isSubLedger = chartOfAccount.getIsSubLedger();
        return this;
    }

}
