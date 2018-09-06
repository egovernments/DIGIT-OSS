package org.egov.egf.contract.model;

import java.io.Serializable;

public class Bank implements Serializable {

	private Integer id;
	private String code;
	private String name;
	private String description;
	private Boolean active;
	private String type;
	private AuditDetails auditDetails;
	
	public Bank(){}

	public Bank(Integer id, String code, String name, String description, Boolean active, String type,
			AuditDetails auditDetails) {
		this.id = id;
		this.code = code;
		this.name = name;
		this.description = description;
		this.active = active;
		this.type = type;
		this.auditDetails = auditDetails;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Boolean isActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public AuditDetails getAuditDetails() {
		return auditDetails;
	}

	public void setAuditDetails(AuditDetails auditDetails) {
		this.auditDetails = auditDetails;
	}
	
}
