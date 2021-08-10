package org.egov.infra.microservice.models;

import org.hibernate.validator.constraints.SafeHtml;

public class Department {

    private Long id;
    @SafeHtml
    private String name;
    @SafeHtml
    private String code;

    private Boolean active;
    @SafeHtml
    private String tenantId;

    public Department(Long id, String name, String code, Boolean active, String tenantId) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.active = active;
        this.tenantId = tenantId;
    }

    public Department() {
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

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    @Override
    public String toString() {
        return "Department [id=" + id + ", name=" + name + ", code=" + code + ", active=" + active + ", tenantId="
                + tenantId + "]";
    }

}
