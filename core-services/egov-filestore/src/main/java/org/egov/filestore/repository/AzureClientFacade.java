package org.egov.filestore.repository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.microsoft.azure.storage.CloudStorageAccount;
import com.microsoft.azure.storage.blob.CloudBlobClient;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@Order(2)
public class AzureClientFacade implements ApplicationRunner{
	
	@Value("${azure.defaultEndpointsProtocol}")
	private String defaultEndpointsProtocol;
	
	@Value("${azure.accountName}")
	private String accountName;
	
	@Value("${azure.accountKey}")
	private String accountKey;
	
	@Value("${isAzureStorageEnabled}")
	private Boolean isAzureEnabled;
	
	private static CloudBlobClient cloudBlobClient;
	
	@Override
	public void run(ApplicationArguments arg0) throws Exception {
		if(isAzureEnabled)
			initializeAzureClient();		
	}
	
	/**
	 * Intializes the azure client
	 * 
	 */
	public void initializeAzureClient() {
		StringBuilder storageConnectionString = new StringBuilder();
		storageConnectionString.append("DefaultEndpointsProtocol=").append(defaultEndpointsProtocol).append(";")
		.append("AccountName=").append(accountName).append(";").append("AccountKey=").append(accountKey);
		CloudStorageAccount storageAccount = null;
		CloudBlobClient blobClient = null;
		try {
			storageAccount = CloudStorageAccount.parse(storageConnectionString.toString());
			if(null != storageAccount) {
				blobClient = storageAccount.createCloudBlobClient();
			}
		}catch(Exception e) {
			log.error("Exception while intializing client: ", e);
		}	
		cloudBlobClient = blobClient;
	}
	
	public CloudBlobClient getAzureClient() {
		return cloudBlobClient;
	}
	
	
}
