package org.egov.egf.master.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.egov.common.domain.model.Auditable;
import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.model.Functionary;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FunctionaryEntity extends AuditableEntity
{
    public static final String TABLE_NAME = "egf_functionary";
    public static final String SEQUENCE_NAME = "seq_egf_functionary";
    private String id;
    private String code;
    private String name;
    private Boolean active;

    public Functionary toDomain() {
        Functionary functionary = new Functionary();
        super.toDomain(functionary);
        functionary.setId(this.id);
        functionary.setCode(this.code);
        functionary.setName(this.name);
        functionary.setActive(this.active);
        return functionary;
    }

    public FunctionaryEntity toEntity(Functionary functionary) {
        super.toEntity((Auditable) functionary);
        this.id = functionary.getId();
        this.code = functionary.getCode();
        this.name = functionary.getName();
        this.active = functionary.getActive();
        return this;
    }

}
