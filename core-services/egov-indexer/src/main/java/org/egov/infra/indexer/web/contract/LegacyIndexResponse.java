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
	
	public ResponseInfo responseInfo;
	
	public String url;
			
	public String message;
	
	public String jobId;

}
