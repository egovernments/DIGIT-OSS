package org.egov.infra.microservice.contract;

import java.io.File;

public class EgFile {
	private String module;
	private File file;
	private String tag;
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
	public String getModule() {
		return module;
	}
	public void setModule(String module) {
		this.module = module;
	}
	public File getFile() {
		return file;
	}
	public void setFile(File file) {
		this.file = file;
	}
	public String getTag() {
		return tag;
	}
	public void setTag(String tag) {
		this.tag = tag;
	}

}
