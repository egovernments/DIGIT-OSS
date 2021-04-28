package org.egov.vehicle.trip.web.model.idgen;

import java.util.List;

import org.egov.common.contract.response.ResponseInfo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IdGenerationResponse {
	private ResponseInfo responseInfo;

    private List<IdResponse> idResponses;

	public ResponseInfo getResponseInfo() {
		return responseInfo;
	}

	public void setResponseInfo(ResponseInfo responseInfo) {
		this.responseInfo = responseInfo;
	}

	public List<IdResponse> getIdResponses() {
		return idResponses;
	}

	public void setIdResponses(List<IdResponse> idResponses) {
		this.idResponses = idResponses;
	}
    

}
