package org.egov.filestore.domain.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.filestore.config.FileStoreConfig;
import org.egov.filestore.domain.model.FileInfo;
import org.egov.filestore.domain.model.FileLocation;
import org.egov.filestore.domain.model.Resource;
import org.egov.filestore.persistence.entity.Artifact;
import org.egov.filestore.persistence.repository.ArtifactRepository;
import org.egov.filestore.persistence.repository.FileStoreJpaRepository;
import org.egov.filestore.repository.impl.minio.MinioConfig;
import org.egov.filestore.validator.StorageValidator;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class StorageServiceTest {

    @Test
    void testSave() {
        ArtifactRepository artifactRepository = mock(ArtifactRepository.class);
        ArrayList<String> stringList = new ArrayList<>();
        when(artifactRepository.save((List<org.egov.filestore.domain.model.Artifact>) any(), (RequestInfo) any()))
                .thenReturn(stringList);
        IdGeneratorService idGeneratorService = new IdGeneratorService();
        FileStoreConfig fileStoreConfig = new FileStoreConfig();
        StorageValidator storageValidator = new StorageValidator(new FileStoreConfig());
        FileStoreConfig configs = new FileStoreConfig();
        StorageService storageService = new StorageService(artifactRepository, idGeneratorService, fileStoreConfig,
                storageValidator, configs, new MinioConfig());
        ArrayList<MultipartFile> filesToStore = new ArrayList<>();
        List<String> actualSaveResult = storageService.save(filesToStore, "Module", "Tag", "42", new RequestInfo());
        assertSame(stringList, actualSaveResult);
        assertTrue(actualSaveResult.isEmpty());
        verify(artifactRepository).save((List<org.egov.filestore.domain.model.Artifact>) any(), (RequestInfo) any());
    }

    @Test
    void testRetrieve() throws IOException {
        Artifact artifact = new Artifact();
        artifact.setContentType("text/plain");
        artifact.setCreatedBy("Jan 1, 2020 8:00am GMT+0100");
        artifact.setCreatedTime(1L);
        artifact.setFileName("foo.txt");
        artifact.setFileSource("File Source");
        artifact.setFileStoreId("42");
        artifact.setId(123L);
        artifact.setLastModifiedBy("Jan 1, 2020 9:00am GMT+0100");
        artifact.setLastModifiedTime(1L);
        artifact.setModule("Module");
        artifact.setTag("Tag");
        artifact.setTenantId("42");
        FileStoreJpaRepository fileStoreJpaRepository = mock(FileStoreJpaRepository.class);
        when(fileStoreJpaRepository.findByFileStoreIdAndTenantId((String) any(), (String) any())).thenReturn(artifact);
        ArtifactRepository artifactRepository = new ArtifactRepository(fileStoreJpaRepository);
        IdGeneratorService idGeneratorService = new IdGeneratorService();
        FileStoreConfig fileStoreConfig = new FileStoreConfig();
        StorageValidator storageValidator = new StorageValidator(new FileStoreConfig());
        FileStoreConfig configs = new FileStoreConfig();
        assertNull((new StorageService(artifactRepository, idGeneratorService, fileStoreConfig, storageValidator, configs,
                new MinioConfig())).retrieve("foo", "foo"));
        verify(fileStoreJpaRepository).findByFileStoreIdAndTenantId((String) any(), (String) any());
    }

    @Test
    void testRetrieveDefaultArguments() throws IOException {
        Artifact artifact = mock(Artifact.class);
        when(artifact.getFileLocation())
                .thenReturn(new FileLocation("42", "Module", "Tag", "42", "foo.txt", "File Source"));
        doNothing().when(artifact).setContentType((String) any());
        doNothing().when(artifact).setCreatedBy((String) any());
        doNothing().when(artifact).setCreatedTime((Long) any());
        doNothing().when(artifact).setFileName((String) any());
        doNothing().when(artifact).setFileSource((String) any());
        doNothing().when(artifact).setFileStoreId((String) any());
        doNothing().when(artifact).setId((Long) any());
        doNothing().when(artifact).setLastModifiedBy((String) any());
        doNothing().when(artifact).setLastModifiedTime((Long) any());
        doNothing().when(artifact).setModule((String) any());
        doNothing().when(artifact).setTag((String) any());
        doNothing().when(artifact).setTenantId((String) any());
        artifact.setContentType("text/plain");
        artifact.setCreatedBy("Jan 1, 2020 8:00am GMT+0100");
        artifact.setCreatedTime(1L);
        artifact.setFileName("foo.txt");
        artifact.setFileSource("File Source");
        artifact.setFileStoreId("42");
        artifact.setId(123L);
        artifact.setLastModifiedBy("Jan 1, 2020 9:00am GMT+0100");
        artifact.setLastModifiedTime(1L);
        artifact.setModule("Module");
        artifact.setTag("Tag");
        artifact.setTenantId("42");
        FileStoreJpaRepository fileStoreJpaRepository = mock(FileStoreJpaRepository.class);
        when(fileStoreJpaRepository.findByFileStoreIdAndTenantId((String) any(), (String) any())).thenReturn(artifact);
        ArtifactRepository artifactRepository = new ArtifactRepository(fileStoreJpaRepository);
        IdGeneratorService idGeneratorService = new IdGeneratorService();
        FileStoreConfig fileStoreConfig = new FileStoreConfig();
        StorageValidator storageValidator = new StorageValidator(new FileStoreConfig());
        FileStoreConfig configs = new FileStoreConfig();
        assertNull((new StorageService(artifactRepository, idGeneratorService, fileStoreConfig, storageValidator, configs,
                new MinioConfig())).retrieve("foo", "foo"));
        verify(fileStoreJpaRepository).findByFileStoreIdAndTenantId((String) any(), (String) any());
        verify(artifact).getFileLocation();
        verify(artifact).setContentType((String) any());
        verify(artifact).setCreatedBy((String) any());
        verify(artifact).setCreatedTime((Long) any());
        verify(artifact).setFileName((String) any());
        verify(artifact).setFileSource((String) any());
        verify(artifact).setFileStoreId((String) any());
        verify(artifact).setId((Long) any());
        verify(artifact).setLastModifiedBy((String) any());
        verify(artifact).setLastModifiedTime((Long) any());
        verify(artifact).setModule((String) any());
        verify(artifact).setTag((String) any());
        verify(artifact).setTenantId((String) any());
    }

    @Test
    void testRetrieveNewResource() throws IOException {
        Artifact artifact = mock(Artifact.class);
        when(artifact.getFileLocation())
                .thenReturn(new FileLocation("42", "Module", "Tag", "42", "foo.txt", "File Source"));
        doNothing().when(artifact).setContentType((String) any());
        doNothing().when(artifact).setCreatedBy((String) any());
        doNothing().when(artifact).setCreatedTime((Long) any());
        doNothing().when(artifact).setFileName((String) any());
        doNothing().when(artifact).setFileSource((String) any());
        doNothing().when(artifact).setFileStoreId((String) any());
        doNothing().when(artifact).setId((Long) any());
        doNothing().when(artifact).setLastModifiedBy((String) any());
        doNothing().when(artifact).setLastModifiedTime((Long) any());
        doNothing().when(artifact).setModule((String) any());
        doNothing().when(artifact).setTag((String) any());
        doNothing().when(artifact).setTenantId((String) any());
        artifact.setContentType("text/plain");
        artifact.setCreatedBy("Jan 1, 2020 8:00am GMT+0100");
        artifact.setCreatedTime(1L);
        artifact.setFileName("foo.txt");
        artifact.setFileSource("File Source");
        artifact.setFileStoreId("42");
        artifact.setId(123L);
        artifact.setLastModifiedBy("Jan 1, 2020 9:00am GMT+0100");
        artifact.setLastModifiedTime(1L);
        artifact.setModule("Module");
        artifact.setTag("Tag");
        artifact.setTenantId("42");
        ArtifactRepository artifactRepository = mock(ArtifactRepository.class);
        Resource resource = new Resource("text/plain", "foo.txt", new ByteArrayResource("AAAAAAAA".getBytes("UTF-8")), "42",
                "File Size");

        when(artifactRepository.find((String) any(), (String) any())).thenReturn(resource);
        IdGeneratorService idGeneratorService = new IdGeneratorService();
        FileStoreConfig fileStoreConfig = new FileStoreConfig();
        StorageValidator storageValidator = new StorageValidator(new FileStoreConfig());
        FileStoreConfig configs = new FileStoreConfig();
        assertSame(resource, (new StorageService(artifactRepository, idGeneratorService, fileStoreConfig, storageValidator,
                configs, new MinioConfig())).retrieve("foo", "foo"));
        verify(artifact).setContentType((String) any());
        verify(artifact).setCreatedBy((String) any());
        verify(artifact).setCreatedTime((Long) any());
        verify(artifact).setFileName((String) any());
        verify(artifact).setFileSource((String) any());
        verify(artifact).setFileStoreId((String) any());
        verify(artifact).setId((Long) any());
        verify(artifact).setLastModifiedBy((String) any());
        verify(artifact).setLastModifiedTime((Long) any());
        verify(artifact).setModule((String) any());
        verify(artifact).setTag((String) any());
        verify(artifact).setTenantId((String) any());
        verify(artifactRepository).find((String) any(), (String) any());
    }

    @Test
    void testRetrieveByTag() {
        FileStoreJpaRepository fileStoreJpaRepository = mock(FileStoreJpaRepository.class);
        when(fileStoreJpaRepository.findByTagAndTenantId((String) any(), (String) any())).thenReturn(new ArrayList<>());
        ArtifactRepository artifactRepository = new ArtifactRepository(fileStoreJpaRepository);
        IdGeneratorService idGeneratorService = new IdGeneratorService();
        FileStoreConfig fileStoreConfig = new FileStoreConfig();
        StorageValidator storageValidator = new StorageValidator(new FileStoreConfig());
        FileStoreConfig configs = new FileStoreConfig();
        assertTrue((new StorageService(artifactRepository, idGeneratorService, fileStoreConfig, storageValidator, configs,
                new MinioConfig())).retrieveByTag("foo", "foo").isEmpty());
        verify(fileStoreJpaRepository).findByTagAndTenantId((String) any(), (String) any());
    }

    @Test
    void testRetrieveByTagDefaultArguments() {
        Artifact artifact = new Artifact();
        artifact.setContentType("text/plain");
        artifact.setCreatedBy("Jan 1, 2020 8:00am GMT+0100");
        artifact.setCreatedTime(2L);
        artifact.setFileName("foo.txt");
        artifact.setFileSource("File Source");
        artifact.setFileStoreId("42");
        artifact.setId(123L);
        artifact.setLastModifiedBy("Jan 1, 2020 9:00am GMT+0100");
        artifact.setLastModifiedTime(2L);
        artifact.setModule("Module");
        artifact.setTag("Tag");
        artifact.setTenantId("42");

        ArrayList<Artifact> artifactList = new ArrayList<>();
        artifactList.add(artifact);
        FileStoreJpaRepository fileStoreJpaRepository = mock(FileStoreJpaRepository.class);
        when(fileStoreJpaRepository.findByTagAndTenantId((String) any(), (String) any())).thenReturn(artifactList);
        ArtifactRepository artifactRepository = new ArtifactRepository(fileStoreJpaRepository);
        IdGeneratorService idGeneratorService = new IdGeneratorService();
        FileStoreConfig fileStoreConfig = new FileStoreConfig();
        StorageValidator storageValidator = new StorageValidator(new FileStoreConfig());
        FileStoreConfig configs = new FileStoreConfig();
        List<FileInfo> actualRetrieveByTagResult = (new StorageService(artifactRepository, idGeneratorService,
                fileStoreConfig, storageValidator, configs, new MinioConfig())).retrieveByTag("foo", "foo");
        assertEquals(1, actualRetrieveByTagResult.size());
        FileInfo getResult = actualRetrieveByTagResult.get(0);
        assertEquals("text/plain", getResult.getContentType());
        assertEquals("42", getResult.getTenantId());
        FileLocation fileLocation = getResult.getFileLocation();
        assertEquals("foo.txt", fileLocation.getFileName());
        assertEquals("42", fileLocation.getTenantId());
        assertEquals("Tag", fileLocation.getTag());
        assertEquals("Module", fileLocation.getModule());
        assertEquals("42", fileLocation.getFileStoreId());
        assertEquals("File Source", fileLocation.getFileSource());
        verify(fileStoreJpaRepository).findByTagAndTenantId((String) any(), (String) any());
    }


    @Test
    void testRetrieveByTagMultipleArtifacts() {
        Artifact artifact = new Artifact();
        artifact.setContentType("text/plain");
        artifact.setCreatedBy("Jan 1, 2020 8:00am GMT+0100");
        artifact.setCreatedTime(2L);
        artifact.setFileName("foo.txt");
        artifact.setFileSource("File Source");
        artifact.setFileStoreId("42");
        artifact.setId(123L);
        artifact.setLastModifiedBy("Jan 1, 2020 9:00am GMT+0100");
        artifact.setLastModifiedTime(2L);
        artifact.setModule("Module");
        artifact.setTag("Tag");
        artifact.setTenantId("42");

        Artifact artifact1 = new Artifact();
        artifact1.setContentType("text/plain");
        artifact1.setCreatedBy("Jan 1, 2020 8:00am GMT+0100");
        artifact1.setCreatedTime(2L);
        artifact1.setFileName("foo.txt");
        artifact1.setFileSource("File Source");
        artifact1.setFileStoreId("42");
        artifact1.setId(123L);
        artifact1.setLastModifiedBy("Jan 1, 2020 9:00am GMT+0100");
        artifact1.setLastModifiedTime(2L);
        artifact1.setModule("Module");
        artifact1.setTag("Tag");
        artifact1.setTenantId("42");

        ArrayList<Artifact> artifactList = new ArrayList<>();
        artifactList.add(artifact1);
        artifactList.add(artifact);
        FileStoreJpaRepository fileStoreJpaRepository = mock(FileStoreJpaRepository.class);
        when(fileStoreJpaRepository.findByTagAndTenantId((String) any(), (String) any())).thenReturn(artifactList);
        ArtifactRepository artifactRepository = new ArtifactRepository(fileStoreJpaRepository);
        IdGeneratorService idGeneratorService = new IdGeneratorService();
        FileStoreConfig fileStoreConfig = new FileStoreConfig();
        StorageValidator storageValidator = new StorageValidator(new FileStoreConfig());
        FileStoreConfig configs = new FileStoreConfig();
        List<FileInfo> actualRetrieveByTagResult = (new StorageService(artifactRepository, idGeneratorService,
                fileStoreConfig, storageValidator, configs, new MinioConfig())).retrieveByTag("foo", "foo");
        assertEquals(2, actualRetrieveByTagResult.size());
        FileInfo getResult = actualRetrieveByTagResult.get(0);
        assertEquals("42", getResult.getTenantId());
        FileInfo getResult1 = actualRetrieveByTagResult.get(1);
        assertEquals("42", getResult1.getTenantId());
        assertEquals("text/plain", getResult1.getContentType());
        assertEquals("text/plain", getResult.getContentType());
        FileLocation fileLocation = getResult1.getFileLocation();
        assertEquals("Module", fileLocation.getModule());
        FileLocation fileLocation1 = getResult.getFileLocation();
        assertEquals("42", fileLocation1.getTenantId());
        assertEquals("Tag", fileLocation1.getTag());
        assertEquals("Module", fileLocation1.getModule());
        assertEquals("42", fileLocation1.getFileStoreId());
        assertEquals("File Source", fileLocation1.getFileSource());
        assertEquals("foo.txt", fileLocation1.getFileName());
        assertEquals("42", fileLocation.getFileStoreId());
        assertEquals("File Source", fileLocation.getFileSource());
        assertEquals("foo.txt", fileLocation.getFileName());
        assertEquals("Tag", fileLocation.getTag());
        assertEquals("42", fileLocation.getTenantId());
        verify(fileStoreJpaRepository).findByTagAndTenantId((String) any(), (String) any());
    }


    @Test
    void testRetrieveByTagMockRepo() {
        ArtifactRepository artifactRepository = mock(ArtifactRepository.class);
        ArrayList<FileInfo> fileInfoList = new ArrayList<>();
        when(artifactRepository.findByTag((String) any(), (String) any())).thenReturn(fileInfoList);
        IdGeneratorService idGeneratorService = new IdGeneratorService();
        FileStoreConfig fileStoreConfig = new FileStoreConfig();
        StorageValidator storageValidator = new StorageValidator(new FileStoreConfig());
        FileStoreConfig configs = new FileStoreConfig();
        List<FileInfo> actualRetrieveByTagResult = (new StorageService(artifactRepository, idGeneratorService,
                fileStoreConfig, storageValidator, configs, new MinioConfig())).retrieveByTag("foo", "foo");
        assertSame(fileInfoList, actualRetrieveByTagResult);
        assertTrue(actualRetrieveByTagResult.isEmpty());
        verify(artifactRepository).findByTag((String) any(), (String) any());
    }
}

