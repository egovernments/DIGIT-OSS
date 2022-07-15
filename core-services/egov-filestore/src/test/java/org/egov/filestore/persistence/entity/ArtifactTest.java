package org.egov.filestore.persistence.entity;

import static org.junit.jupiter.api.Assertions.assertNull;

import org.egov.filestore.domain.model.FileLocation;
import org.junit.jupiter.api.Test;

class ArtifactTest {
    @Test
    void testGetFileLocation() {
        FileLocation actualFileLocation = (new Artifact()).getFileLocation();
        assertNull(actualFileLocation.getFileName());
        assertNull(actualFileLocation.getTenantId());
        assertNull(actualFileLocation.getTag());
        assertNull(actualFileLocation.getModule());
        assertNull(actualFileLocation.getFileStoreId());
        assertNull(actualFileLocation.getFileSource());
    }
}

