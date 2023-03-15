package org.egov.pt.calculator.web.models;

import lombok.*;

import javax.validation.constraints.NotNull;
import java.util.Set;


@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentSearchCriteria {
	
	@NotNull
	private String tenantId;

	private Set<String> ids;

	private Set<String> assessmentNumbers;

	private String financialYear;
		
	private Set<String> propertyIds;
	
	private AssessmentStatus status;
	
	private Long offset;

	private Long limit;

}
