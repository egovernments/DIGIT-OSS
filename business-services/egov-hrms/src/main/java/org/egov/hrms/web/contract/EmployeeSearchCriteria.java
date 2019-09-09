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


@AllArgsConstructor
@Getter
@NoArgsConstructor
@Setter
@ToString
@Builder
public class EmployeeSearchCriteria {
	
	public List<String> codes;
	
	public List<String> names;
	
	public List<String> departments;
	
	public List<String> designations;
	
	public Long asOnDate;

	public List<String> roles;
	
	public List<Long> ids;
	
	public List<String> employeestatuses;
	
	public List<String> employeetypes;
	
	public List<String> uuids;
	
	public List<Long> positions;
	
	public Boolean isActive;
	
	public String tenantId;
	
	public String phone;

	public Integer offset;
	
	public Integer limit;
	
	
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
