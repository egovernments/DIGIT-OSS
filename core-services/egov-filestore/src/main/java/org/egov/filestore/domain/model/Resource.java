package org.egov.filestore.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class Resource {
    private String contentType;
    private String fileName;
    private org.springframework.core.io.Resource resource;
    private String tenantId;
    private String fileSize;
}
