package org.egov.filestore.web.contract;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class File {
    private String fileStoreId;
    private String tenantId;
}

