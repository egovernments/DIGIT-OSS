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
public class LegacyIndexResponse {
	
	private ResponseInfo responseInfo;
	
	private String url;
			
	private String message;
	
	private String jobId;

}
