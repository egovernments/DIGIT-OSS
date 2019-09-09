package org.egov.hrms.repository;

import org.apache.commons.lang3.StringUtils;
import org.egov.hrms.web.contract.EmployeeSearchCriteria;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class EmployeeQueryBuilder {
	
	@Value("${egov.hrms.default.pagination.limit}")
	private Integer defaultLimit;
	
	/**
	 * Returns query for searching employees
	 * 
	 * @param criteria
	 * @return
	 */
	public String getEmployeeSearchQuery(EmployeeSearchCriteria criteria,List <Object> preparedStmtList ) {
		StringBuilder builder = new StringBuilder(EmployeeQueries.HRMS_GET_EMPLOYEES);
		addWhereClause(criteria, builder, preparedStmtList);
		return paginationClause(criteria, builder);
	}
	
	public String getPositionSeqQuery() {
		return EmployeeQueries.HRMS_POSITION_SEQ;
	}
	
	/**
	 * Adds where clause to the query based on the requirement.
	 *  @param criteria
	 * @param builder
	 * @param preparedStmtList
	 */
	public void addWhereClause(EmployeeSearchCriteria criteria, StringBuilder builder, List<Object> preparedStmtList) {
		if(!StringUtils.isEmpty(criteria.getTenantId())) {
			builder.append(" employee.tenantid = ?");
			preparedStmtList.add(criteria.getTenantId());
		}
			else
			builder.append(" employee.tenantid NOTNULL");
		
		if(!CollectionUtils.isEmpty(criteria.getCodes())){
			builder.append(" and employee.code IN (").append(createQuery(criteria.getCodes())).append(")");
			addToPreparedStatement(preparedStmtList, criteria.getCodes());

		}
		if(!CollectionUtils.isEmpty(criteria.getIds())){
			builder.append(" and employee.id IN (").append(createQuery(criteria.getIds())).append(")");
			addToPreparedStatement(preparedStmtList, criteria.getIds());
		}
		if(!CollectionUtils.isEmpty(criteria.getUuids())){
			builder.append(" and employee.uuid IN (").append(createQuery(criteria.getUuids())).append(")");
			addToPreparedStatement(preparedStmtList, criteria.getUuids());
		}
		if(!CollectionUtils.isEmpty(criteria.getEmployeestatuses())){
			builder.append(" and employee.employeestatus IN (").append(createQuery(criteria.getEmployeestatuses())).append(")");
			addToPreparedStatement(preparedStmtList, criteria.getEmployeestatuses());
		}
		if(!CollectionUtils.isEmpty(criteria.getEmployeetypes())){
			builder.append(" and employee.employeetype IN (").append(createQuery(criteria.getEmployeetypes())).append(")");
			addToPreparedStatement(preparedStmtList, criteria.getEmployeetypes());
		}

		builder.append(" and employee.active = "+criteria.getIsActive());
	}
	
	public String paginationClause(EmployeeSearchCriteria criteria, StringBuilder builder) {
		String pagination = EmployeeQueries.HRMS_PAGINATION_WRAPPER;
		pagination = pagination.replace("{}", builder.toString());
		if(null != criteria.getOffset())
			pagination = pagination.replace("$offset", criteria.getOffset().toString());
		else
			pagination = pagination.replace("$offset", "0");
		
		if(null != criteria.getLimit())
			pagination = pagination.replace("$limit", criteria.getLimit().toString());
		else
			pagination = pagination.replace("$limit", defaultLimit.toString());
		
		return pagination;
	}

	public String getAssignmentSearchQuery(EmployeeSearchCriteria criteria, List<Object> preparedStmtList) {
		StringBuilder builder = new StringBuilder(EmployeeQueries.HRMS_GET_ASSIGNMENT);
		addWhereClauseAssignment(criteria, builder, preparedStmtList);
		return builder.toString();
	}

	private void addWhereClauseAssignment(EmployeeSearchCriteria criteria, StringBuilder builder, List<Object> preparedStmtList) {
		if(!CollectionUtils.isEmpty(criteria.getDepartments())){
			builder.append(" and assignment.department IN (").append(createQuery(criteria.getDepartments())).append(")");
			addToPreparedStatement(preparedStmtList, criteria.getDepartments());
		}
		if(!CollectionUtils.isEmpty(criteria.getDesignations())){
			builder.append(" and assignment.designation IN (").append(createQuery(criteria.getDesignations())+")");
			addToPreparedStatement(preparedStmtList,criteria.getDesignations());
		}
		if(!CollectionUtils.isEmpty(criteria.getPositions())){
			builder.append(" and assignment.position IN (").append(createQuery(criteria.getPositions())+")");
			addToPreparedStatement(preparedStmtList,criteria.getPositions());
		}
		if(null != criteria.getAsOnDate()) {
			builder.append( " and case when assignment.todate is null then assignment.fromdate <= ? else assignment.fromdate <= ? and assignment.todate > ? end");
			preparedStmtList.add(criteria.getAsOnDate());
			preparedStmtList.add(criteria.getAsOnDate());
			preparedStmtList.add(criteria.getAsOnDate());
		}


	}


	private String createQuery(List<?> ids) {
		StringBuilder builder = new StringBuilder();
		int length = ids.size();
		for (int i = 0; i < length; i++) {
			builder.append(" ?");
			if (i != length - 1)
				builder.append(",");
		}
		return builder.toString();
	}

	private void addToPreparedStatement(List<Object> preparedStmtList, List<?> ids) {
		ids.forEach(id -> {
			preparedStmtList.add(id);
		});
	}


}
