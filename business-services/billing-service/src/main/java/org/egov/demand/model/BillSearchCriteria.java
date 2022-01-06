package org.egov.demand.model;

import java.util.Set;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.egov.demand.model.BillV2.BillStatus;

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
	@Size(max = 256)
	private String tenantId;

	private Set<String> billId;

	private Long fromPeriod;

	private Long toPeriod;

	@Default
	private Boolean retrieveOldest = false;

	private Boolean isActive;

	private Boolean isCancelled;

	private Set<String> consumerCode;

	@Size(max = 256)
	private String billNumber;

	@Size(max = 256)
	private String service;

	@Default
	private boolean isOrderBy = false;

	private Long size;

	private Long offset;

	@Email
	private String email;

	private BillStatus status;

	@Pattern(regexp = "^[0-9]{10}$", message = "MobileNumber should be 10 digit number")
	private String mobileNumber;
}
