package org.egov.egf.contract.model;

import java.io.Serializable;

import org.hibernate.validator.constraints.SafeHtml;

public class Function implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 944845081085224791L;
	private Long id;
	@SafeHtml
	private String name;
	@SafeHtml
	private String code;
	private Integer level;
	private Boolean active;
	private Long parentId;
	private AuditDetails auditDetails;

	public Function() {
	}

	public Function(final Long id, final String name, final String code, final Integer level, final Boolean active,
			final Long parentId, final AuditDetails auditDetails) {
		this.id = id;
		this.name = name;
		this.code = code;
		this.level = level;
		this.active = active;
		this.parentId = parentId;
		this.auditDetails = auditDetails;
	}

	public Long getId() {
		return id;
	}

	public void setId(final Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(final String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(final String code) {
		this.code = code;
	}

	public Integer getLevel() {
		return level;
	}

	public void setLevel(final Integer level) {
		this.level = level;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(final Boolean active) {
		this.active = active;
	}

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(final Long parentId) {
		this.parentId = parentId;
	}

	public AuditDetails getAuditDetails() {
		return auditDetails;
	}

	public void setAuditDetails(final AuditDetails auditDetails) {
		this.auditDetails = auditDetails;
	}

}
