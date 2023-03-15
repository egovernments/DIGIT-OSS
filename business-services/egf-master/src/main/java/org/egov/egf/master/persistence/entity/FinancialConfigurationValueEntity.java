package org.egov.egf.master.persistence.entity;

import java.util.Date;

import org.egov.common.domain.model.Auditable;
import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.model.FinancialConfiguration;
import org.egov.egf.master.domain.model.FinancialConfigurationValue;

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
public class FinancialConfigurationValueEntity extends AuditableEntity {
    public static final String TABLE_NAME = "egf_financialconfigurationvalues";
    private String id;
    private String financialConfigurationId;
    private String value;
    private Date effectiveFrom;

    public FinancialConfigurationValue toDomain() {
        FinancialConfigurationValue financialConfigurationValue = new FinancialConfigurationValue();
        super.toDomain(financialConfigurationValue);
        financialConfigurationValue.setId(this.id);
        financialConfigurationValue
                .setFinancialConfiguration(FinancialConfiguration.builder().id(financialConfigurationId).build());
        financialConfigurationValue.setValue(this.value);
        financialConfigurationValue.setEffectiveFrom(this.effectiveFrom);
        return financialConfigurationValue;
    }

    public FinancialConfigurationValueEntity toEntity(FinancialConfigurationValue financialConfigurationValue) {
        super.toEntity((Auditable) financialConfigurationValue);
        this.id = financialConfigurationValue.getId();
        this.financialConfigurationId = financialConfigurationValue.getFinancialConfiguration() != null
                ? financialConfigurationValue.getFinancialConfiguration().getId() : null;
        this.value = financialConfigurationValue.getValue();
        this.effectiveFrom = financialConfigurationValue.getEffectiveFrom();
        return this;
    }

}
