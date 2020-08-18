package org.egov.tl.util;

import org.egov.tl.service.URLShorterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ShortUrlUtil {

	@Value("${egov.ui.app.host}")
	private String domainName;

	@Autowired
	private URLShorterService urlShorterService;

	public String getShortUrl(String url, String applicationNo, String tenantId) {

		String longURL = String.format(url, domainName, applicationNo, tenantId);

		String shortUrl = urlShorterService.getUrl(longURL);

		log.info("Shorth url: " + shortUrl);

		return shortUrl;
	}

	public String getShortUrl(String url, String applicationNo, String tenantId, String businessService) {

		String longURL = String.format(url, domainName, applicationNo, tenantId, businessService);

		String shortUrl = urlShorterService.getUrl(longURL);

		System.out.println("Shorth url: " + shortUrl);

		return shortUrl;
	}

}
