package org.egov.filestore.domain.model;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class FileLocationTest {

    @Test
    void testBuilder() {
        FileLocation.builder();
    }

    @Test
    void testConstructorNewFileLocation() {
        FileLocation actualFileLocation = new FileLocation();
        actualFileLocation.setFileName("foo.txt");
        actualFileLocation.setFileSource("File Source");
        actualFileLocation.setFileStoreId("42");
        actualFileLocation.setModule("Module");
        actualFileLocation.setTag("Tag");
        actualFileLocation.setTenantId("42");
        assertEquals("foo.txt", actualFileLocation.getFileName());
        assertEquals("File Source", actualFileLocation.getFileSource());
        assertEquals("42", actualFileLocation.getFileStoreId());
        assertEquals("Module", actualFileLocation.getModule());
        assertEquals("Tag", actualFileLocation.getTag());
        assertEquals("42", actualFileLocation.getTenantId());
    }


    @Test
    void testConstructorDefault() {
        FileLocation actualFileLocation = new FileLocation("42", "Module", "Tag", "42", "foo.txt", "File Source");
        actualFileLocation.setFileName("foo.txt");
        actualFileLocation.setFileSource("File Source");
        actualFileLocation.setFileStoreId("42");
        actualFileLocation.setModule("Module");
        actualFileLocation.setTag("Tag");
        actualFileLocation.setTenantId("42");
        assertEquals("foo.txt", actualFileLocation.getFileName());
        assertEquals("File Source", actualFileLocation.getFileSource());
        assertEquals("42", actualFileLocation.getFileStoreId());
        assertEquals("Module", actualFileLocation.getModule());
        assertEquals("Tag", actualFileLocation.getTag());
        assertEquals("42", actualFileLocation.getTenantId());
    }
}

