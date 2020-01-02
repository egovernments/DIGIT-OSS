package org.egov.pt.web.contracts;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.models.Property;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PropertyRequest   {
	
		@JsonProperty("RequestInfo")
		private RequestInfo requestInfo;
		
        @JsonProperty("Property")
        @Valid
        private Property property;
}

