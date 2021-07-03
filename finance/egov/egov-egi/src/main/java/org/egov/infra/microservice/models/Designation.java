package org.egov.infra.microservice.models;

import org.hibernate.validator.constraints.SafeHtml;

public class Designation {

    private Long id;
    @SafeHtml
    private String name;
    @SafeHtml
    private String code;
    @SafeHtml
    private String description;
    @SafeHtml
    private String chartOfAccounts;
    private Boolean active;
    @SafeHtml
    private String tenantId;

    public Designation() {
    }

    public Designation(Long id, String name, String code, String description, String chartOfAccounts, Boolean active,
            String tenantId) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.chartOfAccounts = chartOfAccounts;
        this.active = active;
        this.tenantId = tenantId;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getChartOfAccounts() {
        return chartOfAccounts;
    }

    public void setChartOfAccounts(String chartOfAccounts) {
        this.chartOfAccounts = chartOfAccounts;
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
        return "Designation [id=" + id + ", name=" + name + ", code=" + code + ", description=" + description
                + ", chartOfAccounts=" + chartOfAccounts + ", active=" + active + ", tenantId=" + tenantId + "]";
    }

}