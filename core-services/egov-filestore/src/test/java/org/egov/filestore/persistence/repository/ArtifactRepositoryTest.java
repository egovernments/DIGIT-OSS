package org.egov.filestore.persistence.repository;

import org.egov.filestore.domain.model.FileInfo;
import org.egov.filestore.domain.model.FileLocation;
import org.egov.filestore.persistence.entity.Artifact;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ArtifactRepositoryTest {


    @Test
    void testFind() throws IOException {
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
        assertNull((new ArtifactRepository(fileStoreJpaRepository)).find("File Store Id", "42"));
        verify(fileStoreJpaRepository).findByFileStoreIdAndTenantId((String) any(), (String) any());
    }

    @Test
    void testFindArtifactMock() throws IOException {
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
        assertNull((new ArtifactRepository(fileStoreJpaRepository)).find("File Store Id", "42"));
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
    void testFindByTag() {
        FileStoreJpaRepository fileStoreJpaRepository = mock(FileStoreJpaRepository.class);
        when(fileStoreJpaRepository.findByTagAndTenantId((String) any(), (String) any())).thenReturn(new ArrayList<>());
        assertTrue((new ArtifactRepository(fileStoreJpaRepository)).findByTag("foo", "foo").isEmpty());
        verify(fileStoreJpaRepository).findByTagAndTenantId((String) any(), (String) any());
    }

    @Test
    void testFindByTagDefault() {
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
        List<FileInfo> actualFindByTagResult = (new ArtifactRepository(fileStoreJpaRepository)).findByTag("foo", "foo");
        assertEquals(1, actualFindByTagResult.size());
        FileInfo getResult = actualFindByTagResult.get(0);
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
    void testFindByTagMultipleArtifact() {
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
        List<FileInfo> actualFindByTagResult = (new ArtifactRepository(fileStoreJpaRepository)).findByTag("foo", "foo");
        assertEquals(2, actualFindByTagResult.size());
        FileInfo getResult = actualFindByTagResult.get(0);
        assertEquals("42", getResult.getTenantId());
        FileInfo getResult1 = actualFindByTagResult.get(1);
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
    void testFindByTagErrorCase() {
        FileStoreJpaRepository fileStoreJpaRepository = mock(FileStoreJpaRepository.class);
        when(fileStoreJpaRepository.findByTagAndTenantId((String) any(), (String) any()))
                .thenThrow(new CustomException("Code", "An error occurred"));
        assertThrows(CustomException.class, () -> (new ArtifactRepository(fileStoreJpaRepository)).findByTag("foo", "foo"));
        verify(fileStoreJpaRepository).findByTagAndTenantId((String) any(), (String) any());
    }

    @Test
    void testFindByTagMockArtifact() {
        Artifact artifact = mock(Artifact.class);
        when(artifact.getContentType()).thenReturn("text/plain");
        when(artifact.getFileName()).thenReturn("foo.txt");
        when(artifact.getFileSource()).thenReturn("File Source");
        when(artifact.getFileStoreId()).thenReturn("42");
        when(artifact.getModule()).thenReturn("Module");
        when(artifact.getTag()).thenReturn("Tag");
        when(artifact.getTenantId()).thenReturn("42");
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
        List<FileInfo> actualFindByTagResult = (new ArtifactRepository(fileStoreJpaRepository)).findByTag("foo", "foo");
        assertEquals(1, actualFindByTagResult.size());
        FileInfo getResult = actualFindByTagResult.get(0);
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
        verify(artifact).getContentType();
        verify(artifact).getFileName();
        verify(artifact).getFileSource();
        verify(artifact).getFileStoreId();
        verify(artifact).getModule();
        verify(artifact).getTag();
        verify(artifact, atLeast(1)).getTenantId();
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
    void testGetByTenantIdAndFileStoreIdList() {
        FileStoreJpaRepository fileStoreJpaRepository = mock(FileStoreJpaRepository.class);
        ArrayList<Artifact> artifactList = new ArrayList<>();
        when(fileStoreJpaRepository.findByTenantIdAndFileStoreIdList((String) any(), (List<String>) any()))
                .thenReturn(artifactList);
        ArtifactRepository artifactRepository = new ArtifactRepository(fileStoreJpaRepository);
        List<Artifact> actualByTenantIdAndFileStoreIdList = artifactRepository.getByTenantIdAndFileStoreIdList("foo",
                new ArrayList<>());
        assertSame(artifactList, actualByTenantIdAndFileStoreIdList);
        assertTrue(actualByTenantIdAndFileStoreIdList.isEmpty());
        verify(fileStoreJpaRepository).findByTenantIdAndFileStoreIdList((String) any(), (List<String>) any());
    }

    @Test
    void testGetByTenantIdAndFileStoreIdListCustomException() {
        FileStoreJpaRepository fileStoreJpaRepository = mock(FileStoreJpaRepository.class);
        when(fileStoreJpaRepository.findByTenantIdAndFileStoreIdList((String) any(), (List<String>) any()))
                .thenThrow(new CustomException("Code", "An error occurred"));
        ArtifactRepository artifactRepository = new ArtifactRepository(fileStoreJpaRepository);
        assertThrows(CustomException.class,
                () -> artifactRepository.getByTenantIdAndFileStoreIdList("foo", new ArrayList<>()));
        verify(fileStoreJpaRepository).findByTenantIdAndFileStoreIdList((String) any(), (List<String>) any());
    }
}

