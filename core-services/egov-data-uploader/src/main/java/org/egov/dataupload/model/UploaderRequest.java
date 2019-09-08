package org.egov.dataupload.model;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UploaderRequest {
	
	@JsonProperty("RequestInfo")
	public RequestInfo requestInfo;
	
	@JsonProperty("UploadJobs")
	public List<UploadJob> uploadJobs;
	

}
