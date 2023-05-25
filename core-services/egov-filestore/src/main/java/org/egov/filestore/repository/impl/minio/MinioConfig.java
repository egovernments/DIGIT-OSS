package org.egov.filestore.repository.impl.minio;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;

@Configuration
@Getter
public class MinioConfig {
	
	@Value("${minio.url}")
	private String endPoint;

	@Value("${aws.secretkey}")
	private String secretKey;

	@Value("${aws.key}")
	private String accessKey;
	
	@Value("${fixed.bucketname}")
	private String bucketName;
	
	@Value("${minio.source}")
	private String source;

}
