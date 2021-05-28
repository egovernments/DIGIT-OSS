package org.egov.infra.microservice.models;

import java.util.List;

import org.hibernate.validator.constraints.SafeHtml;

public class TaxHeadMaster {

    @SafeHtml
    private String id;
    @SafeHtml
    private String tenantId;
    private Category category;
    @SafeHtml
    private String service;
    @SafeHtml
    private String name;
    @SafeHtml
    private String code;
    private List<GlCodeMaster> glCodes;
    private Boolean isDebit = false;
    private Boolean isActualDemand;
    private Long validFrom;
    private Long validTill;
    private Integer order;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
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

    public List<GlCodeMaster> getGlCodes() {
        return glCodes;
    }

    public void setGlCodes(List<GlCodeMaster> glCodes) {
        this.glCodes = glCodes;
    }

    public Boolean getIsDebit() {
        return isDebit;
    }

    public void setIsDebit(Boolean isDebit) {
        this.isDebit = isDebit;
    }

    public Boolean getIsActualDemand() {
        return isActualDemand;
    }

    public void setIsActualDemand(Boolean isActualDemand) {
        this.isActualDemand = isActualDemand;
    }

    public Long getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(Long validFrom) {
        this.validFrom = validFrom;
    }

    public Long getValidTill() {
        return validTill;
    }

    public void setValidTill(Long validTill) {
        this.validTill = validTill;
    }

    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

}
