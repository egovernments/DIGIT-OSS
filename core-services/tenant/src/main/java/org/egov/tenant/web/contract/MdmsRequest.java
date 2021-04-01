package org.egov.tenant.web.contract;



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
public class MdmsRequest {

	@JsonProperty(value="RequestInfo")
	private RequestInfo requestInfo;

	@JsonProperty(value="MdmsCriteria")
	private MdmsCriteria mdmsCriteria;

}