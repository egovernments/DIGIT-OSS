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
	
	@Value("${image.small}")
	private String _small;

	@Value("${image.medium}")
	private String _medium;

	@Value("${image.large}")
	private String _large;
	
	@Value("${image.small.width}")
	private Integer smallWidth;

	@Value("${image.medium.width}")
	private Integer mediumWidth;

	@Value("${image.large.width}")
	private Integer largeWidth;
	
	@Value("${presigned.url.expiry.time.in.secs}")
	private Integer preSignedUrlTimeOut;
	
	@Value("#{'${image.formats}'.split(',')}") 
	private List<String> imageFormats;
	
	@PostConstruct
	private void enrichKeysetForFormats() {
		allowedKeySet = allowedFormatsMap.keySet();
	}
}
