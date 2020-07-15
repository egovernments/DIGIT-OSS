package org.egov.filestore.repository.impl.minio;

import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import io.minio.MinioClient;
import io.minio.errors.InvalidEndpointException;
import io.minio.errors.InvalidPortException;
import lombok.extern.slf4j.Slf4j;

@Component
@ConditionalOnProperty(value = "isS3Enabled", havingValue = "true", matchIfMissing = true)
@Slf4j
public class MinioClientFacade {

	@Autowired
	private MinioConfig minioConfig;
	
	
	@Bean
	private MinioClient getMinioClient() {
		log.info("Initializing the minio ");
		MinioClient	minioClient = null;
		try {
			
			minioClient = new MinioClient(minioConfig.getEndPoint(), minioConfig.getAccessKey(), 
					minioConfig.getSecretKey());
			
		} catch (InvalidEndpointException | InvalidPortException e) {
			log.error(e.getMessage(), e);
			throw new CustomException("ERROR_FILESTORE_MINIO_INSTANCE","Failed to create minio instance");
		} 
		return minioClient;
	} 
}
