package org.egov.pgr.repository;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class FileStoreRepo {

	@Value("${egov.filestore.host}")
	private String fileStoreHost;

	@Value("${egov.filestore.url.endpoint}")
	private String urlEndPoint;

	private static final String TENANTID_PARAM = "tenantId=";

	private static final String FILESTORE_ID_LIST_PARAM = "&fileStoreIds=";

	@Autowired
	private RestTemplate restTemplate;

	@SuppressWarnings("unchecked")
	public Map<String, String> getUrlMaps(String tenantId, List<String> fileStoreIds) {

		int size = fileStoreIds.size();

		if (size < 50) {

			String idLIst = fileStoreIds.toString().substring(1, fileStoreIds.toString().length() - 1).replace(", ",
					",");
			log.info("idLIst: " + idLIst);
			return restTemplate.getForObject(URI.create(
					fileStoreHost + urlEndPoint + "?" + TENANTID_PARAM + tenantId + FILESTORE_ID_LIST_PARAM + idLIst),
					Map.class);
		} else {

			Map<String, String> result = new HashMap<>();
			int x;
			for (int i = 0; i < size; i += 50) {

				if (i + 50 < size)
					x = i + 50;
				else
					x = size;

				String subList = fileStoreIds.subList(i, x).toString();
				
				String subIdLIst = subList.substring(1, subList.length() - 1)
						.replace(", ", ",");
				log.info("subIdLIst : " + subIdLIst);
				result.putAll(restTemplate.getForObject(URI.create(fileStoreHost + urlEndPoint + "?" + TENANTID_PARAM
						+ tenantId + FILESTORE_ID_LIST_PARAM + subIdLIst), Map.class));
			}
			return result;
		}
	}
}
