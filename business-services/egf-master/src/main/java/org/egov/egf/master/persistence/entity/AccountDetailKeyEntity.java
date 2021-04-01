package org.egov.egf.master.persistence.entity;

import org.egov.common.domain.model.Auditable;
import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.model.AccountDetailKey;
import org.egov.egf.master.domain.model.AccountDetailType;

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
public class AccountDetailKeyEntity extends AuditableEntity
{
    public static final String TABLE_NAME = "egf_accountdetailkey";
    public static final String SEQUENCE_NAME = "seq_egf_accountdetailkey";
    private String id;
    private String key;
    private String accountDetailTypeId;

    public AccountDetailKey toDomain() {
        AccountDetailKey accountDetailKey = new AccountDetailKey();
        super.toDomain(accountDetailKey);
        accountDetailKey.setId(this.id);
        accountDetailKey.setKey(this.key);
        accountDetailKey.setAccountDetailType(AccountDetailType.builder().id(accountDetailTypeId).build());
        return accountDetailKey;
    }

    public AccountDetailKeyEntity toEntity(AccountDetailKey accountDetailKey) {
        super.toEntity((Auditable) accountDetailKey);
        this.id = accountDetailKey.getId();
        this.key = accountDetailKey.getKey();
        this.accountDetailTypeId = accountDetailKey.getAccountDetailType() != null ? accountDetailKey.getAccountDetailType()
                .getId() : null;
        return this;
    }

}
