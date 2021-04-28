package org.egov.pgr.contract;

import java.util.List;

import org.egov.common.contract.response.ResponseInfo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <h1>IdGenerationResponse</h1>
 * 
 * @author VISHAL_GENIUS
 *
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IdGenerationResponse {

	private ResponseInfo responseInfo;

	private List<IdResponse> idResponses;

}
