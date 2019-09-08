package org.egov.dataupload.repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.egov.dataupload.utils.DataUploadUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.ByteArrayHttpMessageConverter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.stereotype.Repository;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;


@Repository
public class DataUploadRepository {
	
	@Autowired
	private RestTemplate restTemplate;
		
	@Value("${filestore.post.endpoint}")
	private String postFilePath;
	
	@Value("${filestore.host}")
	private String fileStoreHost;
	
	@Autowired
	private DataUploadUtils dataUploadUtils;
			
	private static final Logger LOGGER = LoggerFactory.getLogger(DataUploadRepository.class);
		
	public Object doApiCall(Object request, String url) throws RestClientException {
			LOGGER.info("Making restTemplate call.....");
			return restTemplate.postForObject(url, request, Map.class);
	}
	
	public String getFileContents(String url, String fileName) throws IOException, RestClientException{
		List<HttpMessageConverter<?>> messageConverters = new ArrayList<HttpMessageConverter<?>>();
		messageConverters.add(new ByteArrayHttpMessageConverter());
		RestTemplate restTemplate = new RestTemplate(messageConverters);
		String filePath = null;
		
	    HttpHeaders headers = new HttpHeaders();
	    headers.setAccept(Collections.singletonList(MediaType.APPLICATION_OCTET_STREAM));

	    HttpEntity<String> entity = new HttpEntity<String>(headers);
	    try{
			ResponseEntity<byte[]> response = restTemplate.exchange(
					url, HttpMethod.GET, entity, byte[].class, "1");
		    if (response.getStatusCode() == HttpStatus.OK) {
				filePath = dataUploadUtils.createANewFile(fileName);
		        Files.write(Paths.get(filePath), response.getBody());
		    }
	    }
	    catch (RestClientException re){
			LOGGER.error("Exception while fetching file from: "+url, re);
			throw re;
		}
	    
	    return filePath;
	}
	
	public Map<String, Object> postFileContents(String tenantId, String moduleName, String filePath) throws RestClientException{
		StringBuilder uri = new StringBuilder();
		Map<String, Object> result;
		uri.append(fileStoreHost).append(postFilePath).append("?tenantId=").append(tenantId).append("&module=").append(moduleName);
		LinkedMultiValueMap<String, Object> map = new LinkedMultiValueMap<>();
		map.add("file", new FileSystemResource(filePath));
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.MULTIPART_FORM_DATA);
		HttpEntity<LinkedMultiValueMap<String, Object>> requestEntity = new  
				HttpEntity<LinkedMultiValueMap<String, Object>>(map, headers);
		LOGGER.info("URI: "+uri.toString());
		try{
			ResponseEntity<Map> resultMap = restTemplate.exchange(uri.toString(), HttpMethod.POST, requestEntity,
			                    Map.class);
			result = resultMap.getBody();
		}catch(RestClientException e){
			LOGGER.error("Couldn't post the response excel: "+filePath, e);
			throw e;
		}
		LOGGER.info("POST FILE response: "+result);
		
		return result;
	}

}