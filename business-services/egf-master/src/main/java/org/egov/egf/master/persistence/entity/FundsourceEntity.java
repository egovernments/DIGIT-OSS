package org.egov.egf.master.persistence.entity;

import java.math.BigDecimal;

import org.egov.common.domain.model.Auditable;
import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.model.Fundsource;

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
public class FundsourceEntity extends AuditableEntity {
    public static final String TABLE_NAME = "egf_fundsource";
    public static final String SEQUENCE_NAME = "seq_egf_fundsource";
    private String id;
    private String code;
    private String name;
    private String type;
    private String parentId;
    private BigDecimal llevel;
    private Boolean active;
    private Boolean isParent;

    public Fundsource toDomain() {
        Fundsource fundsource = new Fundsource();
        Fundsource parent = null;

        super.toDomain(fundsource);
        if (parentId != null) {
            parent = Fundsource.builder().id(parentId).build();
        }
        fundsource.setId(this.id);
        fundsource.setCode(this.code);
        fundsource.setName(this.name);
        fundsource.setType(this.type);
        fundsource.setParent(parent);
        fundsource.setLlevel(this.llevel);
        fundsource.setActive(this.active);
        fundsource.setIsParent(this.isParent);
        return fundsource;
    }

    public FundsourceEntity toEntity(Fundsource fundsource) {
        super.toEntity((Auditable) fundsource);
        this.id = fundsource.getId();
        this.code = fundsource.getCode();
        this.name = fundsource.getName();
        this.type = fundsource.getType();
        this.parentId = fundsource.getParent() != null ? fundsource.getParent().getId() : null;
        this.llevel = fundsource.getLlevel();
        this.active = fundsource.getActive();
        this.isParent = fundsource.getIsParent();
        return this;
    }

}
