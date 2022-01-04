/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.commons.repository;

import org.egov.commons.model.Department;
import org.egov.commons.repository.builder.DepartmentQueryBuilder;
import org.egov.commons.repository.rowmapper.DepartmentRowMapper;
import org.egov.commons.web.contract.DepartmentGetRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Repository
public class DepartmentRepository {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private DepartmentRowMapper departmentRowMapper;

	@Autowired
	private DepartmentQueryBuilder departmentQueryBuilder;

	public static final String INSERT_DEPATMENT_QUERY = "INSERT INTO eg_department"
			+ "(id, name, code, active, tenantid,createdBy,createdDate,lastModifiedBy,lastModifiedDate)"
			+ " VALUES(?,?,?,?,?,?,?,?,?)";


	public static final String UPDATE_DEPARTMENT = "Update eg_department"
			+ " set name=?,active=?,lastModifiedBy=?,lastModifiedDate=?"
			+ " where code=? and tenantId=?";
	public static final String GET_DEPARTMENT_BY_NAME_TENANTID_AND_ID = "Select * from eg_department"
			+ " where name=? and tenantId=? and id != ?";
	public static final String GET_DEPARTMENT_BY_NAME_AND_TENANTID = "Select * from eg_department"
			+ " where name=? and tenantId=? ";
	public static final String GET_DEPARTMENT_BY_CODE_AND_TENANTID_AND_ID = "Select * from eg_department"
			+ " where code=? and tenantId=? and id != ?";
	public static final String GET_DEPARTMENT_BY_CODE_AND_TENANTID = "Select * from eg_department"
			+ " where code=? and tenantId=?";


	public List<Department> findForCriteria(DepartmentGetRequest departmentGetRequest) {
		List<Object> preparedStatementValues = new ArrayList<Object>();
		String queryStr = departmentQueryBuilder.getQuery(departmentGetRequest, preparedStatementValues);
		List<Department> departments = jdbcTemplate.query(queryStr, preparedStatementValues.toArray(),
				departmentRowMapper);
		return departments;
	}

	public void create(Department department, Long userId) {
		Object[] obj = new Object[]{generateSequence("seq_eg_department"), department.getName(), department.getCode()
				, department.getActive(), department.getTenantId(), userId
				, new Date(new java.util.Date().getTime()),
				userId, new Date(new java.util.Date().getTime())};
		jdbcTemplate.update(INSERT_DEPATMENT_QUERY, obj);

	}


	public Long generateSequence(String sequenceName) {
		return jdbcTemplate.queryForObject("SELECT nextval('" + sequenceName + "')", Long.class);
	}

	public void update(Department department, Long userId) {
		Object[] obj = new Object[]{department.getName(), department.getActive(), userId
				, new Date(new java.util.Date().getTime()), department.getCode(), department.getTenantId()};
		jdbcTemplate.update(UPDATE_DEPARTMENT, obj);

	}

	public boolean checkDepartmentByNameAndTenantIdExists(String name, String tenantId, Long id, Boolean isUpdate) {
		final List<Object> preparedStatementValue = new ArrayList<Object>();
		preparedStatementValue.add(name);
		preparedStatementValue.add(tenantId);
		List<Department> detailsFromDb = new ArrayList<>();
		List<Object> preparedStatementValues = new ArrayList<Object>();
		preparedStatementValues.add(name);
		preparedStatementValues.add(tenantId);
		preparedStatementValues.add(id);

		if (isUpdate)
			detailsFromDb = jdbcTemplate.query(GET_DEPARTMENT_BY_NAME_TENANTID_AND_ID, preparedStatementValues.toArray(),
					departmentRowMapper);
		else
			detailsFromDb = jdbcTemplate.query(GET_DEPARTMENT_BY_NAME_AND_TENANTID, preparedStatementValue.toArray(),
					departmentRowMapper);
		return detailsFromDb.isEmpty();

	}

	public boolean checkDepartmentByCodeAndTenantIdExists(String code, String tenantId, Long id, Boolean isUpdate) {
		final List<Object> preparedStatementValue = new ArrayList<Object>();
		preparedStatementValue.add(code);
		preparedStatementValue.add(tenantId);
		List<Department> detailsFromDb = new ArrayList<>();
		List<Object> preparedStatementValues = new ArrayList<Object>();
		preparedStatementValues.add(code);
		preparedStatementValues.add(tenantId);
		preparedStatementValues.add(id);

		if (isUpdate)
			detailsFromDb = jdbcTemplate.query(GET_DEPARTMENT_BY_CODE_AND_TENANTID_AND_ID,
					preparedStatementValues.toArray(), departmentRowMapper);
		else
			detailsFromDb = jdbcTemplate.query(GET_DEPARTMENT_BY_CODE_AND_TENANTID,
					preparedStatementValue.toArray(), departmentRowMapper);
		return detailsFromDb.isEmpty();
	}
}