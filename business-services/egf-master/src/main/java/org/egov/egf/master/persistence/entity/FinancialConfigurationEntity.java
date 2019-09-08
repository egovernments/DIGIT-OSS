package org.egov.egf.master.persistence.entity;

import org.egov.common.domain.model.Auditable;
import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.model.FinancialConfiguration;

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
public class FinancialConfigurationEntity extends AuditableEntity {
    
    public static final String TABLE_NAME = "egf_financialconfiguration";
    private String id;
    private String name;
    private String description;
    private String module;

    public FinancialConfiguration toDomain() {
        FinancialConfiguration financialConfiguration = new FinancialConfiguration();
        super.toDomain(financialConfiguration);
        financialConfiguration.setId(this.id);
        financialConfiguration.setName(this.name);
        financialConfiguration.setDescription(this.description);
        financialConfiguration.setModule(this.module);
        return financialConfiguration;
    }

    public FinancialConfigurationEntity toEntity(FinancialConfiguration financialConfiguration) {
        super.toEntity((Auditable) financialConfiguration);
        this.id = financialConfiguration.getId();
        this.name = financialConfiguration.getName();
        this.description = financialConfiguration.getDescription();
        this.module = financialConfiguration.getModule();
        return this;
    }

}

