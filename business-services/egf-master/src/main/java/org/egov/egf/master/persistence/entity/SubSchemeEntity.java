package org.egov.egf.master.persistence.entity;

import java.util.Date;

import org.egov.common.domain.model.Auditable;
import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.model.Scheme;
import org.egov.egf.master.domain.model.SubScheme;

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
public class SubSchemeEntity extends AuditableEntity {
	public static final String TABLE_NAME = "egf_subscheme";
	public static final String SEQUENCE_NAME = "seq_egf_subscheme";
	private String id;
	private String schemeId;
	private String code;
	private String name;
	private Date validFrom;
	private Date validTo;
	private Boolean active;
	private String departmentId;

	public SubScheme toDomain() {
		SubScheme subScheme = new SubScheme();
		super.toDomain(subScheme);
		subScheme.setId(this.id);
		subScheme.setScheme(Scheme.builder().id(schemeId).build());
		subScheme.setCode(this.code);
		subScheme.setName(this.name);
		subScheme.setValidFrom(this.validFrom);
		subScheme.setValidTo(this.validTo);
		subScheme.setActive(this.active);
		subScheme.setDepartmentId(this.departmentId);
		return subScheme;
	}

	public SubSchemeEntity toEntity(SubScheme subScheme) {
		super.toEntity((Auditable) subScheme);
		this.id = subScheme.getId();
		this.schemeId = subScheme.getScheme() != null ? subScheme.getScheme().getId() : null;
		this.code = subScheme.getCode();
		this.name = subScheme.getName();
		this.validFrom = subScheme.getValidFrom();
		this.validTo = subScheme.getValidTo();
		this.active = subScheme.getActive();
		this.departmentId = subScheme.getDepartmentId();
		return this;
	}

}
