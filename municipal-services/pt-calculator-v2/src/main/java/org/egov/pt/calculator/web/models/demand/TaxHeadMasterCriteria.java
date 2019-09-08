package org.egov.pt.calculator.web.models.demand;

import java.util.HashSet;
import java.util.Set;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
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
public class TaxHeadMasterCriteria {

	@NotNull
	private String tenantId;
	@NotNull
	private String service;
	private String category;
	private String name;
	private Set<String> code=new HashSet<>();
	private Boolean isDebit;
	private Boolean isActualDemand;
	
	private Set<String> id=new HashSet<>();
	private Long validFrom;
	private Long validTill;
	private Long size;
	private Long offset;
}
