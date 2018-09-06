package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.Date;

public class AuditDetails implements Serializable {
	
	private String tenantId;
	private Long createBy;
	private Long lastModifiedBy;
	private Date createdDate;
	private Date lastModifiedDate;
	
	public AuditDetails(){}

	public AuditDetails(String tenantId, Long createBy, Long lastModifiedBy, Date createdDate,
			Date lastModifiedDate) {
		this.tenantId = tenantId;
		this.createBy = createBy;
		this.lastModifiedBy = lastModifiedBy;
		this.createdDate = createdDate;
		this.lastModifiedDate = lastModifiedDate;
	}

	public Long getCreateBy() {
		return createBy;
	}

	public void setCreateBy(Long createBy) {
		this.createBy = createBy;
	}

	public Long getLastModifiedBy() {
		return lastModifiedBy;
	}

	public void setLastModifiedBy(Long lastModifiedBy) {
		this.lastModifiedBy = lastModifiedBy;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Date getLastModifiedDate() {
		return lastModifiedDate;
	}

	public void setLastModifiedDate(Date lastModifiedDate) {
		this.lastModifiedDate = lastModifiedDate;
	}

	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}
	
	

}
