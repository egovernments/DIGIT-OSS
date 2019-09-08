package org.egov.egf.master.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.egov.common.domain.model.Auditable;
import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.model.Bank;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BankEntity extends AuditableEntity
{
    public static final String TABLE_NAME = "egf_bank";
    public static final String SEQUENCE_NAME = "seq_egf_bank";
    private String id;
    private String code;
    private String name;
    private String description;
    private Boolean active;
    private String type;

    public Bank toDomain() {
        Bank bank = new Bank();
        super.toDomain(bank);
        bank.setId(this.id);
        bank.setCode(this.code);
        bank.setName(this.name);
        bank.setDescription(this.description);
        bank.setActive(this.active);
        bank.setType(this.type);
        return bank;
    }

    public BankEntity toEntity(Bank bank) {
        super.toEntity((Auditable) bank);
        this.id = bank.getId();
        this.code = bank.getCode();
        this.name = bank.getName();
        this.description = bank.getDescription();
        this.active = bank.getActive();
        this.type = bank.getType();
        return this;
    }

}
