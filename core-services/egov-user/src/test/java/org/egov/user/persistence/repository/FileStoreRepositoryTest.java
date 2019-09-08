package org.egov.user.persistence.repository;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.web.client.RestTemplate;

@RunWith(MockitoJUnitRunner.class)
public class FileStoreRepositoryTest {

	@InjectMocks
	private FileStoreRepository fileStoreRepository;

	@Mock
	private RestTemplate restTemplate;

	@Test
	public void test_should_geturl_by_fileStoreId() {

		Map<String, String> expectedFileStoreUrls = new HashMap<String, String>();
		expectedFileStoreUrls.put("key", "value");
		when(restTemplate.getForObject(any(String.class), eq(Map.class))).thenReturn(expectedFileStoreUrls);
		Map<String, String> fileStoreUrl = null;
		try {
			List<String> list = new ArrayList<String>();
			list.add("key");
			fileStoreUrl = fileStoreRepository.getUrlByFileStoreId("default", list);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		assertEquals(fileStoreUrl.get("key"), "value");
	}

	@Test
	public void test_should_return_null_ifurllist_isempty() {
		Map<String, String> expectedFileStoreUrls = new HashMap<String, String>();
		when(restTemplate.getForObject(any(String.class), eq(Map.class))).thenReturn(expectedFileStoreUrls);
		Map<String, String> fileStoreUrl = null;
		try {
			List<String> list = new ArrayList<String>();
			list.add("key");
			fileStoreUrl = fileStoreRepository.getUrlByFileStoreId("default", list);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		Assert.assertNull(fileStoreUrl);
	}

	@Test
	public void test_should_return_null_ifurllist_null() {
		when(restTemplate.getForObject(any(String.class), eq(Map.class))).thenReturn(null);
		Map<String, String> fileStoreUrl = null;
		try {
			List<String> list = new ArrayList<String>();
			list.add("key");
			fileStoreUrl = fileStoreRepository.getUrlByFileStoreId("default", list);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		Assert.assertNull(fileStoreUrl);
	}

	@Test(expected = RuntimeException.class)
	public void test_should_throwexception_restcallfails() throws Exception {
		when(restTemplate.getForObject(any(String.class), eq(Map.class))).thenThrow(new RuntimeException());
		Map<String, String> fileStoreUrl = null;
		List<String> list = new ArrayList<String>();
		list.add("key");
		fileStoreUrl = fileStoreRepository.getUrlByFileStoreId("default", list);
		Assert.assertNull(fileStoreUrl);
	}

}
