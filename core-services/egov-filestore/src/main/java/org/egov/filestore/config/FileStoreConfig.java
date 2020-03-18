package org.egov.filestore.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;

@Configuration
@Getter
public class FileStoreConfig {

	@Value("${image.charset.type}")
	private String imageCharsetType;
	
	@Value("#{'${allowed.file.formats}'.split(',')}")
	private List<String> allowedFileFormats;
	
	@Value("#{'${allowed.tika.formats}'.split(',')}")
	private List<String> allowedTikaFormats;
}
