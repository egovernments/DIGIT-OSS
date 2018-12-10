package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.List;

public class BankAccountRequest implements Serializable {

    private String tenantId;
    private Integer offset;
    private Integer pageSize;
    private String sortBy;
    public BankAccountRequest(String tenantId, Integer offset, Integer pageSize, String sortBy) {
        this.tenantId = tenantId;
        this.offset = offset;
        this.pageSize = pageSize;
        this.sortBy = sortBy;
    }
    public BankAccountRequest() {
    }
    
    public Integer getOffset() {
        return offset;
    }
    public void setOffset(Integer offset) {
        this.offset = offset;
    }
    public Integer getPageSize() {
        return pageSize;
    }
    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
    public String getSortBy() {
        return sortBy;
    }
    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }
    public String getTenantId() {
        return tenantId;
    }
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }
    
    
    
}
