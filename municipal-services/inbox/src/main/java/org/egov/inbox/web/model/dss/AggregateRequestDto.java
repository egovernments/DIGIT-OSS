package org.egov.inbox.web.model.dss;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.Valid;
import java.util.Map;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AggregateRequestDto {

	@Valid
	@JsonProperty("visualizationType")
	private String visualizationType;

	@Valid
	@JsonProperty("moduleLevel")
	private String moduleLevel;

	@JsonProperty("requestDate")
	private RequestDate requestDate;

	@Valid
	@JsonProperty("visualizationCode")
	private String visualizationCode;

	@Valid
	@JsonProperty("filters")
	private Map<String, Object> filters;

}
