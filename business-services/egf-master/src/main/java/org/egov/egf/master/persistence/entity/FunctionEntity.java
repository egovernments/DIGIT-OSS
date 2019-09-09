package org.egov.egf.master.persistence.entity;

import org.egov.common.domain.model.Auditable;
import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.model.Function;

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
public class FunctionEntity extends AuditableEntity {
	public static final String TABLE_NAME = "egf_function";
	public static final String SEQUENCE_NAME = "seq_egf_function";
	private String id;
	private String name;
	private String code;
	private Integer level;
	private Boolean active;
	private String parentId;

	public Function toDomain() {
		Function function = new Function();
		super.toDomain(function);
		function.setId(this.id);
		function.setName(this.name);
		function.setCode(this.code);
		function.setLevel(this.level);
		function.setActive(this.active);
		function.setParentId(Function.builder().id(parentId).build());
		return function;
	}

	public FunctionEntity toEntity(Function function) {
		super.toEntity((Auditable) function);
		this.id = function.getId();
		this.name = function.getName();
		this.code = function.getCode();
		this.level = function.getLevel();
		this.active = function.getActive();
		this.parentId = function.getParentId() != null ? function.getParentId().getId() : null;
		return this;
	}

}
