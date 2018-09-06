package org.egov.egf.contract.model;

import java.io.Serializable;

public class Function implements Serializable {

	private Long id;
	private String name;
	private String code;
	private Integer Level;
	private Boolean active;
	private Long parentId;
	private AuditDetails auditDetails;
	
	public Function(){}

	public Function(Long id, String name, String code, Integer level, Boolean active, Long parentId,
			AuditDetails auditDetails) {
		this.id = id;
		this.name = name;
		this.code = code;
		Level = level;
		this.active = active;
		this.parentId = parentId;
		this.auditDetails = auditDetails;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Integer getLevel() {
		return Level;
	}

	public void setLevel(Integer level) {
		Level = level;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

	public AuditDetails getAuditDetails() {
		return auditDetails;
	}

	public void setAuditDetails(AuditDetails auditDetails) {
		this.auditDetails = auditDetails;
	}
	

}
