package org.egov.egf.instrument.persistence.entity;

import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.instrument.domain.model.SurrenderReason;

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
public class SurrenderReasonEntity extends AuditableEntity {
    public static final String TABLE_NAME = "egf_surrenderreason";
    private String id;
    private String name;
    private String description;

    public SurrenderReason toDomain() {
        SurrenderReason surrenderReason = new SurrenderReason();
        super.toDomain(surrenderReason);
        surrenderReason.setId(id);
        surrenderReason.setName(name);
        surrenderReason.setDescription(description);
        return surrenderReason;
    }

    public SurrenderReasonEntity toEntity(SurrenderReason surrenderReason) {
        super.toEntity(surrenderReason);
        id = surrenderReason.getId();
        name = surrenderReason.getName();
        description = surrenderReason.getDescription();
        return this;
    }

}
