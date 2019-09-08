package org.egov.filestore.repository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

@Component
@Order(1)
public class AWSClientFacade implements ApplicationRunner {

	@Value("${aws.key}")
	private String key;

	@Value("${aws.secretkey}")
	private String secretKey;

	@Value("${aws.region}")
	private String awsRegion;
	
	@Value("${isS3Enabled}")
	private Boolean isS3Enabled;

	private static AmazonS3 amazonS3Client;

	@Override
	public void run(ApplicationArguments arg0) throws Exception {
		if(isS3Enabled)
			intializeS3Client();
	}

	/**
	 * Intializes s3 client.
	 * 
	 */
	public void intializeS3Client() {
		AmazonS3 client = AmazonS3ClientBuilder.standard()
				.withCredentials(new AWSStaticCredentialsProvider(new BasicAWSCredentials(key, secretKey)))
				.withRegion(Regions.valueOf(awsRegion)).build();
		amazonS3Client = client;
	}

	public AmazonS3 getS3Client() {
		return amazonS3Client;
	}

}
