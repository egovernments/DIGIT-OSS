package org.egov.id.model;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

/**
 * <h1>IdRequest</h1>
 * 
 * @author Narendra
 *
 */
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class IdRequest {

	@JsonProperty("idName")
	@NotNull
	private String idName;

	@NotNull
	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("format")
	private String format;

	@JsonProperty("count")
	private Integer count;

}
