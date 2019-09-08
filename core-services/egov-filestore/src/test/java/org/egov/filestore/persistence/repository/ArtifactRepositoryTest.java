package org.egov.filestore.persistence.repository;

import static java.util.Arrays.asList;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.UUID;

import org.egov.filestore.domain.exception.ArtifactNotFoundException;
import org.egov.filestore.domain.model.FileInfo;
import org.egov.filestore.domain.model.FileLocation;
import org.egov.filestore.persistence.entity.Artifact;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.web.multipart.MultipartFile;

@RunWith(MockitoJUnitRunner.class)
public class ArtifactRepositoryTest {

	@Mock
	private DiskFileStoreRepository diskFileStoreRepository;

	@Mock
	private FileStoreJpaRepository fileStoreJpaRepository;

	@Captor
	private ArgumentCaptor<List<Artifact>> listArgumentCaptor;

	private final String MODULE = "module";
	private final String TAG = "tag";
	private final String TENANT_ID = "tenantId";
	private final String FILENAME = "fileName";
	private final String FILE_STORE_ID_1 = "fileStoreId1";
	private final String FILE_STORE_ID_2 = "fileStoreId2";
	private final String FILE_SOURCE = "diskFileStorage";

	private ArtifactRepository artifactRepository;

	@Before
	public void setUp() {
		artifactRepository = new ArtifactRepository(diskFileStoreRepository, fileStoreJpaRepository);
	}

	@Ignore
	@Test
	public void shouldSaveArtifactToRepository() throws Exception {
		List<org.egov.filestore.domain.model.Artifact> listOfMockedArtifacts = getListOfArtifacts();

		artifactRepository.save(listOfMockedArtifacts);

		verify(diskFileStoreRepository).write(listOfMockedArtifacts);
	}

/*	@Test
	public void shouldPersistArtifactMetaDataToJpaRepository() throws Exception {
		List<org.egov.filestore.domain.model.Artifact> listOfMockedArtifacts = getListOfArtifacts();
		when(fileStoreJpaRepository.save(listArgumentCaptor.capture())).thenReturn(Collections.emptyList());

		artifactRepository.save(listOfMockedArtifacts);

		assertEquals(FILENAME, listArgumentCaptor.getValue().get(0).getFileName());
		assertEquals("image/png", listArgumentCaptor.getValue().get(0).getContentType());
		assertEquals(MODULE, listArgumentCaptor.getValue().get(0).getModule());
		assertEquals(TAG, listArgumentCaptor.getValue().get(0).getTag());
		assertEquals(TENANT_ID, listArgumentCaptor.getValue().get(0).getTenantId());
		assertEquals(FILENAME, listArgumentCaptor.getValue().get(1).getFileName());
		assertEquals(TENANT_ID, listArgumentCaptor.getValue().get(1).getTenantId());
	}*/

/*	@Test
	public void shouldRetrieveArtifactMetaDataForGivenFileStoreId() throws IOException {
		org.springframework.core.io.Resource mockedResource = mock(org.springframework.core.io.Resource.class);
		when(diskFileStoreRepository.read(any())).thenReturn(mockedResource);
		Artifact artifact = new Artifact();
		artifact.setFileStoreId("fileStoreId");
		artifact.setContentType("contentType");
		artifact.setFileName("fileName");
		artifact.setTenantId(TENANT_ID);
		when(fileStoreJpaRepository.findByFileStoreIdAndTenantId("fileStoreId", TENANT_ID))
				.thenReturn(artifact);

		Resource actualResource = artifactRepository.find("fileStoreId", TENANT_ID);

		assertEquals(actualResource.getContentType(), "contentType");
		assertEquals(actualResource.getTenantId(), TENANT_ID);
		assertEquals(actualResource.getFileName(), "fileName");
		assertEquals(actualResource.getResource(), mockedResource);
	}*/

	@Test(expected = ArtifactNotFoundException.class)
	public void shouldRaiseExceptionWhenArtifactNotFound() throws Exception {
		when(fileStoreJpaRepository.findByFileStoreIdAndTenantId("fileStoreId", TENANT_ID)).thenReturn(null);

		artifactRepository.find("fileStoreId", TENANT_ID);
	}

	@Test
	public void shouldRetrieveArtifactMetaDataForGivenTag() {
		when(fileStoreJpaRepository.findByTagAndTenantId(TAG, TENANT_ID)).thenReturn(getListOfArtifactEntities());

		List<FileInfo> actual = artifactRepository.findByTag(TAG, TENANT_ID);

		assertEquals(actual.get(0).getContentType(), "contentType1");
		assertEquals(actual.get(0).getTenantId(), TENANT_ID);
		assertEquals(actual.get(0).getFileLocation().getFileStoreId(), FILE_STORE_ID_1);

		assertEquals(actual.get(1).getContentType(), "contentType2");
		assertEquals(actual.get(1).getTenantId(), TENANT_ID);
		assertEquals(actual.get(1).getFileLocation().getFileStoreId(), FILE_STORE_ID_2);

		verify(fileStoreJpaRepository).findByTagAndTenantId(TAG, TENANT_ID);
	}

	private List<org.egov.filestore.domain.model.Artifact> getListOfArtifacts() {
		MultipartFile multipartFile1 = mock(MultipartFile.class);
		MultipartFile multipartFile2 = mock(MultipartFile.class);

		when(multipartFile1.getOriginalFilename()).thenReturn(FILENAME);
		when(multipartFile1.getContentType()).thenReturn("image/png");
		when(multipartFile2.getOriginalFilename()).thenReturn(FILENAME);

		return asList(
				new org.egov.filestore.domain.model.Artifact(multipartFile1,
						new FileLocation(UUID.randomUUID().toString(), MODULE, TAG, TENANT_ID,FILENAME,FILE_SOURCE)),
				new org.egov.filestore.domain.model.Artifact(multipartFile2,
						new FileLocation(UUID.randomUUID().toString(), MODULE, TAG, TENANT_ID,FILENAME,FILE_SOURCE))
		);
	}

	private List<Artifact> getListOfArtifactEntities() {
		return asList(
				new Artifact() {{
					setId(1L);
					setFileStoreId(FILE_STORE_ID_1);
					setModule(MODULE);
					setTag(TAG);
					setContentType("contentType1");
					setTenantId(TENANT_ID);
				}},

				new Artifact() {{
					setId(2L);
					setFileStoreId(FILE_STORE_ID_2);
					setModule(MODULE);
					setTag(TAG);
					setContentType("contentType2");
					setTenantId(TENANT_ID);
				}}
		);
	}
}
