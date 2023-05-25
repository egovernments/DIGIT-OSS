package org.egov.infra.admin.master.entity;

import java.io.Serializable;

public class RoleT implements Serializable{

	private Long id;
    private String name;
    private String code;
    private String tenantId;
	public RoleT(Long id, String name, String code, String tenantId) {
		super();
		this.id = id;
		this.name = name;
		this.code = code;
		this.tenantId = tenantId;
	}
	public RoleT() {}
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
	public String getTenantId() {
		return tenantId;
	}
	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}
}
