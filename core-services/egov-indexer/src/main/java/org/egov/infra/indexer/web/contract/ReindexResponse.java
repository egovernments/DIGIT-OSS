package org.egov.infra.indexer.web.contract;

import org.egov.common.contract.response.ResponseInfo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReindexResponse {
	
	public ResponseInfo responseInfo;
	
	public String url;
	
	public Integer totalRecordsToBeIndexed;
	
	public String estimatedTime;
	
	public String message;
	
	public String jobId;


}
