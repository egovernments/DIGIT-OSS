package org.egov.filestore.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@Builder
public class FileLocation {
    private String fileStoreId;
    private String module;
    private String tag;
    private String tenantId;
    private String fileName;
    private String fileSource;
}
