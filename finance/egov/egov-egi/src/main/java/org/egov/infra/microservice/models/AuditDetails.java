package org.egov.infra.microservice.models;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AuditDetails implements Serializable {

    private static final long serialVersionUID = -7014596797379473651L;
    
    @JsonProperty("createdBy")
    private Long createdBy = null;
    
    @JsonProperty("createdDate")
    private Long createdDate = null;
    
    @JsonProperty("lastModifiedBy")
    private Long lastModifiedBy = null;
    
    @JsonProperty("lastModifiedDate")
    private Long lastModifiedDate = null;

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Long getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Long createdDate) {
        this.createdDate = createdDate;
    }

    public Long getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(Long lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public Long getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(Long lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public static long getSerialversionuid() {
        return serialVersionUID;
    }
    
    

}
