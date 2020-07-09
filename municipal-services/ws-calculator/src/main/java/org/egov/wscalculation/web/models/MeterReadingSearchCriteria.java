package org.egov.wscalculation.web.models;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MeterReadingSearchCriteria {

	@JsonProperty("connectionNos")
	private Set<String> connectionNos;

	@JsonProperty("offset")
	private Integer offset;

	@JsonProperty("limit")
	private Integer limit;
}
