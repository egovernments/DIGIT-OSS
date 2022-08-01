package org.egov.inbox.web.model.dss;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.Valid;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InsightsWidget {

	@Valid
	@JsonProperty("name")
	private String name;

	@Valid
	@JsonProperty("value")
	private Object value;

	@Valid
	@JsonProperty("indicator")
	private String indicator;

	@Valid
	@JsonProperty("colorCode")
	private String colorCode;

}
