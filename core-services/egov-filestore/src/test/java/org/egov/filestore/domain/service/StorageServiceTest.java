package org.egov.filestore.domain.service;


import static java.util.Arrays.asList;
import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.argThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.IntStream;

import org.egov.filestore.domain.exception.EmptyFileUploadRequestException;
import org.egov.filestore.domain.model.Artifact;
import org.egov.filestore.domain.model.FileInfo;
import org.egov.filestore.domain.model.FileLocation;
import org.egov.filestore.domain.model.Resource;
import org.egov.filestore.persistence.repository.ArtifactRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentMatcher;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

@RunWith(MockitoJUnitRunner.class)
public class StorageServiceTest {

    @Mock
    private ArtifactRepository artifactRepository;

    @Mock
    private IdGeneratorService idGeneratorService;

    private final String MODULE = "pgr";
    private final String TAG = "tag";
    private final String TENANTID = "tenantId";
    private final String FILENAME = "fileName";
    private final String FILE_STORE_ID_1 = "FileStoreID1";
    private final String FILE_STORE_ID_2 = "FileStoreID2";
    private final String FILE_SOURCE = "diskFileStorage";
    private StorageService storageService;

    @Before
    public void setup(){
        storageService = new StorageService(artifactRepository, idGeneratorService);
        
        ReflectionTestUtils.setField(storageService, "isBucketFixed", true);
        ReflectionTestUtils.setField(storageService, "fixedBucketName", "bucketName");
        ReflectionTestUtils.setField(storageService, "awsS3Source", "awsS3");
    }

    @Test
    public void shouldSaveArtifacts() throws Exception {
        List<MultipartFile> listOfMultipartFiles = getMockFileList();
        List<Artifact> listOfArtifacts = getArtifactList(listOfMultipartFiles);

        when(idGeneratorService.getId()).thenReturn(FILE_STORE_ID_1, FILE_STORE_ID_2);

        storageService.save(listOfMultipartFiles, MODULE, TAG,TENANTID);

        verify(artifactRepository).save(argThat(new ArtifactMatcher(listOfArtifacts)));
    }

    @Test
    public void shouldRetrieveArtifact() throws Exception {
        Resource expectedResource = mock(Resource.class);
        when(artifactRepository.find("fileStoreId",TENANTID)).thenReturn(expectedResource);

        Resource actualResource = storageService.retrieve("fileStoreId",TENANTID);

        assertEquals(expectedResource, actualResource);
    }

    @Test
    public void shouldRetrieveListOfUrlsGivenATag() throws Exception {
        List<FileInfo> listOfFileInfo = getListOfFileInfo();
        when(artifactRepository.findByTag(TAG,TENANTID)).thenReturn(listOfFileInfo);

        List<FileInfo> actual = storageService.retrieveByTag(TAG,TENANTID);

        assertEquals(listOfFileInfo, actual);
    }

	@Test(expected = EmptyFileUploadRequestException.class)
	public void test_should_throw_exception_when_list_of_files_to_save_is_empty() {
    	storageService.save(Collections.emptyList(), MODULE, TAG, TENANTID);
	}

    private List<MultipartFile> getMockFileList() {
        MultipartFile multipartFile1 = new MockMultipartFile("file", "filename1.extension",
                "mime type", "content".getBytes());
        MultipartFile multipartFile2 = new MockMultipartFile("file", "filename2.extension",
                "mime type", "content".getBytes());

        return Arrays.asList(multipartFile1, multipartFile2);
    }

    private List<Artifact> getArtifactList(List<MultipartFile> multipartFiles) {
        Artifact artifact1 = new Artifact(multipartFiles.get(0),
                new FileLocation(FILE_STORE_ID_1, MODULE, TAG,TENANTID,FILENAME,FILE_SOURCE));
        Artifact artifact2 = new Artifact(multipartFiles.get(1),
                new FileLocation(FILE_STORE_ID_2, MODULE, TAG,TENANTID,FILENAME,FILE_SOURCE));

        return Arrays.asList(artifact1, artifact2);
    }

    private List<Artifact> getArtifactList2(List<MultipartFile> multipartFiles) {
        Artifact artifact1 = new Artifact(multipartFiles.get(0),
                new FileLocation(FILE_STORE_ID_1, MODULE, TAG,TENANTID,FILENAME,FILE_SOURCE));
        Artifact artifact2 = new Artifact(multipartFiles.get(1),
                new FileLocation("", MODULE, TAG,TENANTID,FILENAME,FILE_SOURCE));

        return Arrays.asList(artifact1, artifact2);
    }

    private List<FileInfo> getListOfFileInfo() {
        FileLocation fileLocation1 = new FileLocation(FILE_STORE_ID_1, MODULE, TAG,TENANTID,FILENAME,FILE_SOURCE);
        FileLocation fileLocation2 = new FileLocation(FILE_STORE_ID_2, MODULE, TAG,TENANTID,FILENAME,FILE_SOURCE);

        return asList(
                new FileInfo("contentType", fileLocation1,TENANTID),
                new FileInfo("contentType", fileLocation2,TENANTID)
        );
    }

    class ArtifactMatcher extends ArgumentMatcher<List<Artifact>> {

        private List<Artifact> expectedArtifacts;

        public ArtifactMatcher(List<Artifact> expectedArtifacts) {
            this.expectedArtifacts = expectedArtifacts;
        }

        @Override
        public boolean matches(Object o) {
            final List<Artifact> actualArtifacts = (List<Artifact>) o;

            if (actualArtifacts.size() != expectedArtifacts.size()) {
                return false;
            }

            return IntStream.range(0, expectedArtifacts.size()).allMatch(i -> {
                Artifact expectedArtifact = expectedArtifacts.get(i);
                Artifact actualArtifact = actualArtifacts.get(i);

                return expectedArtifact.getMultipartFile().equals(actualArtifact.getMultipartFile()) &&
                        expectedArtifact.getFileLocation().getFileStoreId()
                                .equals(actualArtifact.getFileLocation().getFileStoreId());
            });
        }
    }
}