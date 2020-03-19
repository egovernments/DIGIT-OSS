package org.egov.filestore.config;

import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;

@Configuration
@Getter
public class FileStoreConfig {

	@Value("${image.charset.type}")
	private String imageCharsetType;
	
	@Value("#{${allowed.formats.map}}")
	private Map<String,List<String>> allowedFormatsMap;
	
	private Set<String> allowedKeySet;
	
	@PostConstruct
	private void enrichKeysetForFormats() {
		allowedKeySet = allowedFormatsMap.keySet();
	}
}
