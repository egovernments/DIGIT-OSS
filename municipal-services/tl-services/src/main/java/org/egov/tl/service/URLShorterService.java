package org.egov.tl.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class URLShorterService {

	@Autowired
	private RestTemplate restTemplate;

	@Value("${egov.url.shorter.host}")
	private String shorterHost;

	@Value("${egov.url.shorter.endpoint}")
	private String endpoint;

	public String getUrl(String longURL) {

		StringBuilder uri = new StringBuilder(shorterHost).append(endpoint);
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		HttpEntity<String> entity = new HttpEntity<String>("{\"url\":\"" + longURL + "\"}", headers);
		String shortURL = null;
		log.info("URL SHORTNER URI: " + uri.toString());
		try {
			shortURL = restTemplate.postForObject(uri.toString(), entity, String.class);
		} catch (Exception e) {
			log.error("Exception while Calling url shortener: ", e);
		}
		return shortURL;
	}

}