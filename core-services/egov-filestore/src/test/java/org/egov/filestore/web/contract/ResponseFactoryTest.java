package org.egov.filestore.web.contract;

import org.egov.filestore.domain.model.FileInfo;
import org.egov.filestore.domain.model.FileLocation;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static java.util.Arrays.asList;
import static org.assertj.core.api.Assertions.assertThat;


public class ResponseFactoryTest {

	private ResponseFactory responseFactory;

	private final String MODULE = "pgr";
	private final String TAG = "tag";
	private final String FILE_STORE_ID_1 = "FileStoreID1";
	private final String FILE_STORE_ID_2 = "FileStoreID2";
	private final String CONTENT_TYPE_1 = "contentType1";
	private final String CONTENT_TYPE_2 = "contentType2";
	private final String TENANT_ID = "default";
	private final String FILENAME = "fileName";
	private final String FILE_SOURCE = "diskFileStorage";

	@Before
	public void setUp() throws Exception {
		responseFactory = new ResponseFactory("/fileStore");
	}

	@Test
	public void test_getFilesByTagResponse_from_FileInfo() throws Exception {
		FileLocation fileLocation1 = new FileLocation(FILE_STORE_ID_1, MODULE, TAG, TENANT_ID,FILENAME,FILE_SOURCE);
		FileLocation fileLocation2 = new FileLocation(FILE_STORE_ID_2, MODULE, TAG, TENANT_ID,FILENAME,FILE_SOURCE);
		FileInfo fileInfo1 = new FileInfo(CONTENT_TYPE_1, fileLocation1, TENANT_ID);
		FileInfo fileInfo2 = new FileInfo(CONTENT_TYPE_2, fileLocation2, TENANT_ID);
		List<FileInfo> listOfFileInfo = asList(fileInfo1, fileInfo2);

		GetFilesByTagResponse result = responseFactory.getFilesByTagResponse(listOfFileInfo);

		assertThat(result.getFiles().get(0).getContentType()).isEqualTo(CONTENT_TYPE_1);
		assertThat(result.getFiles().get(0).getUrl()).isEqualTo
				("/fileStore/v1/files/id?fileStoreId=FileStoreID1&tenantId=default");
		assertThat(result.getFiles().get(1).getContentType()).isEqualTo(CONTENT_TYPE_2);
		assertThat(result.getFiles().get(1).getUrl()).isEqualTo
				("/fileStore/v1/files/id?fileStoreId=FileStoreID2&tenantId=default");
	}
}