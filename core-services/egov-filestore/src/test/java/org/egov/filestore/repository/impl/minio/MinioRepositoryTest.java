package org.egov.filestore.repository.impl.minio;

import org.egov.filestore.domain.model.FileLocation;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

class MinioRepositoryTest {

    @Test
    void testSaveFiles() {
        MinioRepository minioRepository = new MinioRepository();
        minioRepository.saveFiles(new ArrayList<>());
    }

    @Test
    void testSaveFilesDefaultArguments() throws UnsupportedEncodingException {
        MinioRepository minioRepository = new MinioRepository();
        FileLocation fileLocation = mock(FileLocation.class);
        when(fileLocation.getFileName()).thenReturn("foo.txt");
        MockMultipartFile multipartFile = new MockMultipartFile("Name", "AAAAAAAA".getBytes("UTF-8"));

        FileLocation fileLocation1 = new FileLocation("42", "Module", "Tag", "42", "foo.txt", "File Source");

        org.egov.filestore.domain.model.Artifact artifact = new org.egov.filestore.domain.model.Artifact(
                "Not all who wander are lost", multipartFile, fileLocation1, new HashMap<>(), "Jan 1, 2020 8:00am GMT+0100",
                "Jan 1, 2020 9:00am GMT+0100", 4L, 4L);
        artifact.setFileLocation(fileLocation);

        ArrayList<org.egov.filestore.domain.model.Artifact> artifactList = new ArrayList<>();
        artifactList.add(artifact);
        assertThrows(RuntimeException.class, () -> minioRepository.saveFiles(artifactList));
        verify(fileLocation).getFileName();
    }

    @Test
    void testGetFiles() {
        MinioRepository minioRepository = new MinioRepository();
        assertTrue(minioRepository.getFiles(new ArrayList<>()).isEmpty());
    }


    @Test
    void testRead() {
        MinioRepository minioRepository = new MinioRepository();
        FileLocation fileLocation = mock(FileLocation.class);
        when(fileLocation.getFileName()).thenThrow(new CustomException("Code", "An error occurred"));
        when(fileLocation.getFileSource()).thenThrow(new CustomException("Code", "An error occurred"));
        when(fileLocation.getFileStoreId()).thenReturn("42");
        assertThrows(CustomException.class, () -> minioRepository.read(fileLocation));
        verify(fileLocation).getFileSource();
        verify(fileLocation).getFileStoreId();
    }
}

