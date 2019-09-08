package org.egov.user.persistence.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class FileStoreRepository {

	@Value("${egov.filestore.host}")
	private String fileStoreHost;

	@Value("${egov.filestore.path}")
	private String fileStorePath;

	@Autowired
	private RestTemplate restTemplate;

	/**
	 * Get FileStoreUrls By passing FileStore Id's
	 * 
	 * @param tenantId
	 * @param fileStoreId
	 * @return
	 * @throws Exception
	 */
	public Map<String, String> getUrlByFileStoreId(String tenantId, List<String> fileStoreIds) throws Exception {
		Map<String, String> fileStoreUrls = null;

		String idLIst = fileStoreIds.toString().substring(1, fileStoreIds.toString().length() - 1).replace(", ", ",");
		log.info("idLIst: " + idLIst);
		String Url = fileStoreHost + fileStorePath + "?tenantId=" + tenantId + "&fileStoreIds=" + idLIst;

		try {
			fileStoreUrls = restTemplate.getForObject(Url, Map.class);
		} catch (HttpClientErrorException e) {
			throw new RuntimeException(e.getResponseBodyAsString());
		}
		log.info("filrStoreUrls " + fileStoreUrls);
		if (null != fileStoreUrls && !fileStoreUrls.isEmpty())
			return fileStoreUrls;
		return null;
	}

}
