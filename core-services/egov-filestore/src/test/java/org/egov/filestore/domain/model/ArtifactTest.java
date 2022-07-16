package org.egov.filestore.domain.model;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.awt.image.BufferedImage;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;

class ArtifactTest {

    @Test
    void testBuilder() {
        Artifact.builder();
    }

    @Test
    void testConstructor() throws UnsupportedEncodingException {
        Artifact actualArtifact = new Artifact();
        actualArtifact.setCreatedBy("Jan 1, 2020 8:00am GMT+0100");
        actualArtifact.setCreatedTime(1L);
        actualArtifact.setFileContentInString("Not all who wander are lost");
        FileLocation fileLocation = new FileLocation("42", "Module", "Tag", "42", "foo.txt", "File Source");

        actualArtifact.setFileLocation(fileLocation);
        actualArtifact.setLastModifiedBy("Jan 1, 2020 9:00am GMT+0100");
        actualArtifact.setLastModifiedTime(1L);
        MockMultipartFile mockMultipartFile = new MockMultipartFile("Name", "AAAAAAAA".getBytes("UTF-8"));

        actualArtifact.setMultipartFile(mockMultipartFile);
        HashMap<String, BufferedImage> stringBufferedImageMap = new HashMap<>();
        actualArtifact.setThumbnailImages(stringBufferedImageMap);
        assertEquals("Jan 1, 2020 8:00am GMT+0100", actualArtifact.getCreatedBy());
        assertEquals(1L, actualArtifact.getCreatedTime().longValue());
        assertEquals("Not all who wander are lost", actualArtifact.getFileContentInString());
        assertSame(fileLocation, actualArtifact.getFileLocation());
        assertEquals("Jan 1, 2020 9:00am GMT+0100", actualArtifact.getLastModifiedBy());
        assertEquals(1L, actualArtifact.getLastModifiedTime().longValue());
        assertSame(mockMultipartFile, actualArtifact.getMultipartFile());
        assertSame(stringBufferedImageMap, actualArtifact.getThumbnailImages());
    }

    @Test
    void testConstructorDefaultArtifact() throws UnsupportedEncodingException {
        MockMultipartFile multipartFile = new MockMultipartFile("Name", "AAAAAAAA".getBytes("UTF-8"));

        FileLocation fileLocation = new FileLocation("42", "Module", "Tag", "42", "foo.txt", "File Source");

        Artifact actualArtifact = new Artifact("Not all who wander are lost", multipartFile, fileLocation, new HashMap<>(),
                "Jan 1, 2020 8:00am GMT+0100", "Jan 1, 2020 9:00am GMT+0100", 1L, 1L);
        actualArtifact.setCreatedBy("Jan 1, 2020 8:00am GMT+0100");
        actualArtifact.setCreatedTime(1L);
        actualArtifact.setFileContentInString("Not all who wander are lost");
        FileLocation fileLocation1 = new FileLocation("42", "Module", "Tag", "42", "foo.txt", "File Source");

        actualArtifact.setFileLocation(fileLocation1);
        actualArtifact.setLastModifiedBy("Jan 1, 2020 9:00am GMT+0100");
        actualArtifact.setLastModifiedTime(1L);
        MockMultipartFile mockMultipartFile = new MockMultipartFile("Name", "AAAAAAAA".getBytes("UTF-8"));

        actualArtifact.setMultipartFile(mockMultipartFile);
        HashMap<String, BufferedImage> stringBufferedImageMap = new HashMap<>();
        actualArtifact.setThumbnailImages(stringBufferedImageMap);
        assertEquals("Jan 1, 2020 8:00am GMT+0100", actualArtifact.getCreatedBy());
        assertEquals(1L, actualArtifact.getCreatedTime().longValue());
        assertEquals("Not all who wander are lost", actualArtifact.getFileContentInString());
        assertSame(fileLocation1, actualArtifact.getFileLocation());
        assertEquals("Jan 1, 2020 9:00am GMT+0100", actualArtifact.getLastModifiedBy());
        assertEquals(1L, actualArtifact.getLastModifiedTime().longValue());
        assertSame(mockMultipartFile, actualArtifact.getMultipartFile());
        assertSame(stringBufferedImageMap, actualArtifact.getThumbnailImages());
    }
}

