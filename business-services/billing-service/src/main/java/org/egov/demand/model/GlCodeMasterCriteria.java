package org.egov.demand.model;

import java.util.HashSet;
import java.util.Set;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class GlCodeMasterCriteria {

	@NotNull
	private String tenantId;
	@NotNull
	private String service;
	
	@NotNull
	@Default
	private Set<String> taxHead = new HashSet<>();
	
	@Default
	private Set<String> id = new HashSet<>();
	private String glCode;
	private Long fromDate;
	private Long toDate;
	private Long size;
	private Long offset;
	
}
