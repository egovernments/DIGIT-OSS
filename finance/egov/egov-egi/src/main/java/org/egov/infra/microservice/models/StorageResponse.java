package org.egov.infra.microservice.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

public class StorageResponse {

    private List<FileReq> files;

    public List<FileReq> getFiles() {
        return files;
    }

    public void setFiles(List<FileReq> files) {
        this.files = files;
    }

}
