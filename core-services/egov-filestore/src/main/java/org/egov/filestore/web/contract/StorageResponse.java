package org.egov.filestore.web.contract;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class StorageResponse {
    private List<File> files;
}
