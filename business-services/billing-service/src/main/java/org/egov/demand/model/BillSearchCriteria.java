package org.egov.demand.model;

import java.util.Set;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Email;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillSearchCriteria {

	@NotNull
	private String tenantId;
	
	private Set<String> billId;
	
	private Boolean isActive;
	
	private Boolean isCancelled;
	
	private String consumerCode;
	
	private String billNumber;
	
	private String service;

	@Default
	private boolean isOrderBy = false;
	
	private Long size;
	
	private Long offset;
	
	@Email
	private String email;
	
	private String mobileNumber;
}
