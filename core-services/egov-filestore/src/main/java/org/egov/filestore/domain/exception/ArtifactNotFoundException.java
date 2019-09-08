package org.egov.filestore.domain.exception;

public class ArtifactNotFoundException extends RuntimeException {

    public ArtifactNotFoundException(String fileStoreId) {
        super(String.format("Artifact with fileStoreId %s is not found", fileStoreId));
    }
}

