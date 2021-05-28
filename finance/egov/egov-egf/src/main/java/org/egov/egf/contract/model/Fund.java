package org.egov.egf.contract.model;

import java.io.Serializable;

import org.hibernate.validator.constraints.SafeHtml;

public class Fund implements Serializable {

    private Long id;
    @SafeHtml
    private String name;
    @SafeHtml
    private String code;
    private Character identifier;
    private Long parent;
    private Boolean active;
    private Boolean isParent;
    @SafeHtml
    private String level;

    private AuditDetails auditDetils;

    public Fund() {
    }

    public Fund(Long id, String name, String code, Character identifier, Long parent, Boolean active, Boolean isParent,
            String level, AuditDetails auditDetils) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.identifier = identifier;
        this.parent = parent;
        this.active = active;
        this.isParent = isParent;
        this.level = level;
        this.auditDetils = auditDetils;
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

    public Character getIdentifier() {
        return identifier;
    }

    public void setIdentifier(Character identifier) {
        this.identifier = identifier;
    }

    public Long getParent() {
        return parent;
    }

    public void setParent(Long parent) {
        this.parent = parent;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Boolean getIsParent() {
        return isParent;
    }

    public void setIsParent(Boolean isParent) {
        this.isParent = isParent;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public AuditDetails getAuditDetils() {
        return auditDetils;
    }

    public void setAuditDetils(AuditDetails auditDetils) {
        this.auditDetils = auditDetils;
    }

}
