package org.egov.fsm.calculator.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Component
public class BillingSlabConfig {

	// Persister Config
	@Value("${persister.save.billing.slab.topic}")
	private String saveBillingSlabTopic;
	
	@Value("${persister.update.billing.slab.topic}")
	private String updateBillingSlabTopic;
	
	//Pagination params
	@Value("${egov.fsm.default.limit}")
	private Integer defaultLimit;

	@Value("${egov.fsm.default.offset}")
	private Integer defaultOffset;

	@Value("${egov.fsm.max.limit}")
	private Integer maxSearchLimit;
	
	@Value("${citizen.allowed.search.params}")
	private String allowedCitizenSearchParameters;
	
	@Value("${employee.allowed.search.params}")
	private String allowedEmployeeSearchParameters;
}
