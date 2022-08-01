package org.egov.inbox.web.model.dss;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.Valid;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RequestDate {

	@Valid
	@JsonProperty("startDate")
	private String startDate;

	@Valid
	@JsonProperty("endDate")
	private String endDate;

	@Valid
	@JsonProperty("interval")
	private String interval;
}
