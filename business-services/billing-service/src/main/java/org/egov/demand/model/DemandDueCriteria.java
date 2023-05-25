package org.egov.demand.model;

import java.util.Set;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DemandDueCriteria {

	@NotNull
	private String tenantId; 
	
	@NotNull
	private Set<String> consumerCode;
	
	@NotNull
	private String businessService;
}
