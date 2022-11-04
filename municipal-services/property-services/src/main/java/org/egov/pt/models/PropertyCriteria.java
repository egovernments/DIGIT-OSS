package org.egov.pt.models;

import java.util.Set;

import org.egov.pt.models.enums.Status;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyCriteria {

	private String tenantId;

	private Set<String> propertyIds;

	private Set<String> tenantIds;
	
	private Set<String> acknowledgementIds;
	
	private Set<String> uuids;

	private Set<String> oldpropertyids;
	
	private Set<Status> status;

	private String mobileNumber;

	private String name;
	
	private Set<String> ownerIds;
	
	private boolean audit;
	
	private Long offset;

	private Long limit;

	private Long fromDate;

	private Long toDate;
	
	private String locality;

	private String doorNo;

	private String oldPropertyId;

	private Set<String> creationReason;
	
	@Builder.Default
	private Boolean isSearchInternal = false;

	@Builder.Default
	private Boolean isInboxSearch = false;
	
	private Boolean isCitizen;

	@Builder.Default
	private Boolean isRequestForCount = false;

	@Builder.Default
	private Boolean isRequestForOldDataEncryption = false;

}
