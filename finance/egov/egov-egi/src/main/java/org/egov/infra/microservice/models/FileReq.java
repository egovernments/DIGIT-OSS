package org.egov.infra.microservice.models;


public class FileReq {
    
    private String fileStoreId;
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

