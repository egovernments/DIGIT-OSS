package org.egov.commons.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
public class BusinessDetailsCriteria {
private Boolean active;
	
	private String tenantId;
	
	private List<Long> ids;
	
	private List<String> businessDetailsCodes;
	
	private String businessCategoryCode;
	
	private String businessType;
	
	private String sortBy;
	
	private String sortOrder;

}
