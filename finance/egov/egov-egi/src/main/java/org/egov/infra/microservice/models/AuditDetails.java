package org.egov.infra.microservice.models;

import java.io.Serializable;

import org.hibernate.validator.constraints.SafeHtml;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AuditDetails implements Serializable {

    private static final long serialVersionUID = -7014596797379473651L;
    @JsonProperty("createdBy")
    @SafeHtml
    private String createdBy = null;

    @JsonProperty("createdDate")
    private Long createdDate = null;

    @JsonProperty("lastModifiedBy")
    @SafeHtml
    private String lastModifiedBy = null;

    @JsonProperty("lastModifiedDate")
    private Long lastModifiedDate = null;

    @JsonProperty("createdTime")
    private Long createdTime;

    @JsonProperty("lastModifiedTime")
    private Long lastModifiedTime;

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Long getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Long createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public Long getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(Long lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }
    
    public void setLastModifiedTime(Long lastModifiedTime) {
        this.lastModifiedTime = lastModifiedTime;
    }
    
    public Long getLastModifiedTime() {
        return lastModifiedTime;
    }

    public static long getSerialversionuid() {
        return serialVersionUID;
    }
    
}
