package org.egov.hrms.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.hrms.utils.HRMSUtils;
import org.egov.hrms.web.contract.EmployeeSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.extern.slf4j.Slf4j;

import org.egov.hrms.model.Employee;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

@Repository
@Slf4j
public class EmployeeRepository {
	
	@Autowired
	private EmployeeQueryBuilder queryBuilder;
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private EmployeeRowMapper rowMapper;

	@Autowired
	private EmployeeCountRowMapper countRowMapper;

	@Autowired
	private HRMSUtils hrmsUtils;

	/**
	 * DB Repository that makes jdbc calls to the db and fetches employees.
	 * 
	 * @param criteria
	 * @param requestInfo
	 * @return
	 */
	public List<Employee> fetchEmployees(EmployeeSearchCriteria criteria, RequestInfo requestInfo){
		List<Employee> employees = new ArrayList<>();
		List<Object> preparedStmtList = new ArrayList<>();
		if(hrmsUtils.isAssignmentSearchReqd(criteria)) {
			List<String> empUuids = fetchEmployeesforAssignment(criteria, requestInfo);
			if (CollectionUtils.isEmpty(empUuids))
				return employees;
			else {
				if(!CollectionUtils.isEmpty(criteria.getUuids()))
					criteria.setUuids(criteria.getUuids().stream().filter(empUuids::contains).collect(Collectors.toList()));
				else
					criteria.setUuids(empUuids);
			}
		}
		String query = queryBuilder.getEmployeeSearchQuery(criteria, preparedStmtList);
		String tenantId = !ObjectUtils.isEmpty(criteria.getTenantId()) ? criteria.getTenantId() : criteria.getCentralInstanceTenantId();

		String finalQuery = "";

		if(!tenantId.contains("."))
			finalQuery = query.replace("{{SCHEMA}}.", "");
		else
			finalQuery = hrmsUtils.replaceSchemaPlaceholderWithTenantId(query, hrmsUtils.getStateLevelTenantId(tenantId));

		//log.info(finalQuery);
		try {
			employees = jdbcTemplate.query(finalQuery, preparedStmtList.toArray(),rowMapper);
		}catch(Exception e) {
			log.error("Exception while making the db call: ",e);
			log.error("query; "+ finalQuery);
		}
		return employees;
	}

	private List<String> fetchEmployeesforAssignment(EmployeeSearchCriteria criteria, RequestInfo requestInfo) {
		List<String> employeesIds = new ArrayList<>();
		List <Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getAssignmentSearchQuery(criteria, preparedStmtList);
		try {

			employeesIds = jdbcTemplate.queryForList(query, preparedStmtList.toArray(),String.class);
		}catch(Exception e) {
			log.error("Exception while making the db call: ",e);
			log.error("query; "+query);
		}
		return employeesIds;

	}

	/**
	 * Fetches next value in the position seq table
	 * 
	 * @return
	 */
	public Long fetchPosition(){
		String query = queryBuilder.getPositionSeqQuery();
		Long id = null;
		try {
			id = jdbcTemplate.queryForObject(query, Long.class);
		}catch(Exception e) {
			log.error("Exception while making the db call: ",e);
			log.error("query; "+query);
		}
		return id;
	}

	/**
	 * DB Repository that makes jdbc calls to the db and fetches employee count.
	 *
	 * @param tenantId
	 * @return
	 */
	public Map<String,String> fetchEmployeeCount(String tenantId){
		Map<String,String> response = new HashMap<>();
		List<Object> preparedStmtList = new ArrayList<>();

		String query = queryBuilder.getEmployeeCountQuery(tenantId, preparedStmtList);
		String finalQuery = "";

		if(!tenantId.contains("."))
			finalQuery = query.replace("{{SCHEMA}}.", "");
		else
			finalQuery = hrmsUtils.replaceSchemaPlaceholderWithTenantId(query, hrmsUtils.getStateLevelTenantId(tenantId));



		log.info("query; "+finalQuery);
		try {
			response=jdbcTemplate.query(finalQuery, preparedStmtList.toArray(),countRowMapper);
		}catch(Exception e) {
			log.error("Exception while making the db call: ",e);
			log.error("query; "+ finalQuery);
		}
		return response;
	}

}
