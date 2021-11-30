package org.egov.hrms.web.contract;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.Size;


@AllArgsConstructor
@Getter
@NoArgsConstructor
@Setter
@ToString
@Builder
public class EmployeeSearchCriteria {
	
	private List<String> codes;
	
	private List<String> names;
	
	private List<String> departments;
	
	private List<String> designations;
	
	private Long asOnDate;

	private List<String> roles;
	
	private List<Long> ids;
	
	private List<String> employeestatuses;
	
	private List<String> employeetypes;
	
	private List<String> uuids;
	
	private List<Long> positions;
	
	private Boolean isActive;

	@Size(max = 250)
	private String tenantId;
	
	private String phone;

	private Integer offset;
	
	private Integer limit;
	
	
	public boolean isCriteriaEmpty(EmployeeSearchCriteria criteria) {
		if(CollectionUtils.isEmpty(criteria.getCodes()) && CollectionUtils.isEmpty(criteria.getNames()) 
				&& CollectionUtils.isEmpty(criteria.getDepartments()) && CollectionUtils.isEmpty(criteria.getDesignations())
				&& CollectionUtils.isEmpty(criteria.getIds()) && CollectionUtils.isEmpty(criteria.getEmployeestatuses())
				&& CollectionUtils.isEmpty(criteria.getEmployeetypes()) && CollectionUtils.isEmpty(criteria.getUuids())
				&& CollectionUtils.isEmpty(criteria.getPositions()) && StringUtils.isEmpty(criteria.getTenantId())
				&& CollectionUtils.isEmpty(criteria.getRoles()) && null == criteria.getAsOnDate()) {
			return true;
		}else {
			return false;
		}
	}

}
