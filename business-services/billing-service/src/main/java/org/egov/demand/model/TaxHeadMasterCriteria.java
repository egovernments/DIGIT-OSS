package org.egov.demand.model;

import java.util.HashSet;
import java.util.Set;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.Builder.Default;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class TaxHeadMasterCriteria {

	@NotNull
	private String tenantId;
	@NotNull
	private String service;
	private String category;
	private String name;
	
	@Default
	private Set<String> code=new HashSet<>();
	private Boolean isDebit;
	private Boolean isActualDemand;
	
	@Default
	private Set<String> id=new HashSet<>();

}
