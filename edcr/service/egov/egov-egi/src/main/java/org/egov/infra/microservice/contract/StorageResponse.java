package org.egov.infra.microservice.contract;


import java.util.List;

public class StorageResponse {
	List<EgFile> files;

	public List<EgFile> getFiles() {
		return files;
	}

	public void setFiles(List<EgFile> files) {
		this.files = files;
	}

	 
}