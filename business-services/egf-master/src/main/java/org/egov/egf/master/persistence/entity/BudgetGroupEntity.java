package org.egov.egf.master.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.egov.common.domain.model.Auditable;
import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.enums.BudgetAccountType;
import org.egov.egf.master.domain.enums.BudgetingType;
import org.egov.egf.master.domain.model.BudgetGroup;
import org.egov.egf.master.domain.model.ChartOfAccount;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BudgetGroupEntity extends AuditableEntity
{
    public static final String TABLE_NAME = "egf_budgetgroup";
    public static final String SEQUENCE_NAME = "seq_egf_budgetgroup";
    private String id;
    private String name;
    private String description;
    private String majorCodeId;
    private String maxCodeId;
    private String minCodeId;
    private String accountType;
    private String budgetingType;
    private Boolean active;

    public BudgetGroup toDomain() {
        BudgetGroup budgetGroup = new BudgetGroup();
        super.toDomain(budgetGroup);
        budgetGroup.setId(this.id);
        budgetGroup.setName(this.name);
        budgetGroup.setDescription(this.description);
        budgetGroup.setMajorCode(ChartOfAccount.builder().id(majorCodeId).build());
        budgetGroup.setMaxCode(ChartOfAccount.builder().id(maxCodeId).build());
        budgetGroup.setMinCode(ChartOfAccount.builder().id(minCodeId).build());
        budgetGroup.setAccountType(BudgetAccountType.valueOf(this.accountType));
        budgetGroup.setBudgetingType(BudgetingType.valueOf(this.budgetingType));
        budgetGroup.setActive(this.active);
        return budgetGroup;
    }

    public BudgetGroupEntity toEntity(BudgetGroup budgetGroup) {
        super.toEntity((Auditable) budgetGroup);
        this.id = budgetGroup.getId();
        this.name = budgetGroup.getName();
        this.description = budgetGroup.getDescription();
        this.majorCodeId = budgetGroup.getMajorCode() != null ? budgetGroup.getMajorCode().getId() : null;
        this.maxCodeId = budgetGroup.getMaxCode() != null ? budgetGroup.getMaxCode().getId() : null;
        this.minCodeId = budgetGroup.getMinCode() != null ? budgetGroup.getMinCode().getId() : null;
        this.accountType = budgetGroup.getAccountType() != null ? budgetGroup.getAccountType().toString() : null;
        this.budgetingType = budgetGroup.getBudgetingType() != null ? budgetGroup.getBudgetingType().toString() : null;
        this.active = budgetGroup.getActive();
        return this;
    }

}
