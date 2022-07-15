package org.egov.filestore.domain.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;

import org.junit.jupiter.api.Test;

class FileInfoTest {

    @Test
    void testConstructor() {
        FileLocation fileLocation = new FileLocation("42", "Module", "Tag", "42", "foo.txt", "File Source");

        FileInfo actualFileInfo = new FileInfo("text/plain", fileLocation, "42");

        assertEquals("text/plain", actualFileInfo.getContentType());
        assertSame(fileLocation, actualFileInfo.getFileLocation());
        assertEquals("42", actualFileInfo.getTenantId());
    }
}

