package org.egov.collection.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ShortUrlUtil {

	@Autowired
	private URLShorterService urlShorterService;

	public String getShortUrl(String url) {

		String longURL = String.format(url);

		String shortUrl = urlShorterService.getUrl(longURL);

		log.info("Shorth url: " + shortUrl);

		return shortUrl;
	}

}
