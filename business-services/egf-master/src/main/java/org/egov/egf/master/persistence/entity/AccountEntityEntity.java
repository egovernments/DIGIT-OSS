package org.egov.egf.master.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.egov.common.domain.model.Auditable;
import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.model.AccountEntity;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountEntityEntity extends AuditableEntity
{
    public static final String TABLE_NAME = "egf_accountentity";
    public static final String SEQUENCE_NAME = "seq_egf_accountentitymaster";
    private String id;
    private String accountDetailTypeId;
    private String code;
    private String name;
    private Boolean active;
    private String description;

    public AccountEntity toDomain() {
        AccountEntity accountEntity = new AccountEntity();
        super.toDomain(accountEntity);
        accountEntity.setId(this.id);
        accountEntity.setAccountDetailType(AccountDetailType.builder().id(accountDetailTypeId).build());
        accountEntity.setCode(this.code);
        accountEntity.setName(this.name);
        accountEntity.setActive(this.active);
        accountEntity.setDescription(this.description);
        return accountEntity;
    }

    public AccountEntityEntity toEntity(AccountEntity accountEntity) {
        super.toEntity((Auditable) accountEntity);
        this.id = accountEntity.getId();
        this.accountDetailTypeId = accountEntity.getAccountDetailType() != null ? accountEntity.getAccountDetailType().getId()
                : null;
        this.code = accountEntity.getCode();
        this.name = accountEntity.getName();
        this.active = accountEntity.getActive();
        this.description = accountEntity.getDescription();
        return this;
    }

}
