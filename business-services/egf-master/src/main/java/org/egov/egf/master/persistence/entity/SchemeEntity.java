package org.egov.egf.master.persistence.entity;

import java.util.Date;

import org.egov.common.domain.model.Auditable;
import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.model.Fund;
import org.egov.egf.master.domain.model.Scheme;

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
public class SchemeEntity extends AuditableEntity {
	public static final String TABLE_NAME = "egf_scheme";
	public static final String SEQUENCE_NAME = "seq_egf_scheme";
	private String id;
	private String fundId;
	private String code;
	private String name;
	private Date validFrom;
	private Date validTo;
	private Boolean active;
	private String description;
	private String boundary;

	public Scheme toDomain() {
		Scheme scheme = new Scheme();
		super.toDomain(scheme);
		scheme.setId(this.id);
		scheme.setFund(Fund.builder().id(fundId).build());
		scheme.setCode(this.code);
		scheme.setName(this.name);
		scheme.setValidFrom(this.validFrom);
		scheme.setValidTo(this.validTo);
		scheme.setActive(this.active);
		scheme.setDescription(this.description);
		scheme.setBoundary(this.boundary);
		return scheme;
	}

	public SchemeEntity toEntity(Scheme scheme) {
		super.toEntity((Auditable) scheme);
		this.id = scheme.getId();
		this.fundId = scheme.getFund() != null ? scheme.getFund().getId() : null;
		this.code = scheme.getCode();
		this.name = scheme.getName();
		this.validFrom = scheme.getValidFrom();
		this.validTo = scheme.getValidTo();
		this.active = scheme.getActive();
		this.description = scheme.getDescription();
		this.boundary = scheme.getBoundary();
		return this;
	}

}
