package org.egov.filestore.web.contract;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class FileRecord {
    private String url;
    private String contentType;
}
