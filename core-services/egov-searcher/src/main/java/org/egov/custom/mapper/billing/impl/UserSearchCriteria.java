package org.egov.custom.mapper.billing.impl;

import java.util.List;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class UserSearchCriteria {

	private List<Long> id;
	private Set<String> uuid;
	private String tenantId;

}