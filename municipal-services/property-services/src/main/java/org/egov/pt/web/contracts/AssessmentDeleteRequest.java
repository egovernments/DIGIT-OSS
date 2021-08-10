package org.egov.pt.web.contracts;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AssessmentDeleteRequest   {
	
		@JsonProperty("RequestInfo")
		private RequestInfo requestInfo;
		
        @JsonProperty("tenantId")
        private String tenantId ;

        @JsonProperty("assessmentNumber")
        private String assessmentNumber ;


}

