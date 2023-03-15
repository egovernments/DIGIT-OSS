package org.egov.infra.microservice.models;

import org.hibernate.validator.constraints.SafeHtml;

public class FileReq {
    @SafeHtml
    private String fileStoreId;
    @SafeHtml
    private String tenantId;
    
    public String getFileStoreId() {
        return fileStoreId;
    }
    public void setFileStoreId(String fileStoreId) {
        this.fileStoreId = fileStoreId;
    }
    public String getTenantId() {
        return tenantId;
    }
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }
}

