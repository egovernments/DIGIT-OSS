package org.egov.dataupload.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ProcessMetaData {
	
	@JsonProperty("message")
	public String message;
	
	@JsonProperty("jobId")
	public String jobId;
	
	@JsonProperty("finalfileStoreId")
	public String finalfileStoreId;
	
	@JsonProperty("localFilePath")
	public String localFilePath;

}