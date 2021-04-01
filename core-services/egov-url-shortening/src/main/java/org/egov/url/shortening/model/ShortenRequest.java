package org.egov.url.shortening.model;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ShortenRequest {
	
	private String id;
	@NotNull
	private String url;
	private Long validFrom;
	private Long validTill;
	
}
