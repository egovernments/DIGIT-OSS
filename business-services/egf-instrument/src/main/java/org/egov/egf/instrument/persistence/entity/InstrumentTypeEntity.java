package org.egov.egf.instrument.persistence.entity;

import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.instrument.domain.model.InstrumentType;

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
public class InstrumentTypeEntity extends AuditableEntity {
    public static final String TABLE_NAME = "egf_instrumenttype";
    private String id;
    private String name;
    private String description;
    private Boolean active;

    public InstrumentType toDomain() {
        InstrumentType instrumentType = new InstrumentType();
        super.toDomain(instrumentType);
        instrumentType.setId(id);
        instrumentType.setName(name);
        instrumentType.setDescription(description);
        instrumentType.setActive(active);
        return instrumentType;
    }

    public InstrumentTypeEntity toEntity(InstrumentType instrumentType) {
        super.toEntity(instrumentType);
        id = instrumentType.getId();
        name = instrumentType.getName();
        description = instrumentType.getDescription();
        active = instrumentType.getActive();
        return this;
    }

}
