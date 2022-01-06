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

package org.egov.boundary.persistence.repository;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.egov.boundary.persistence.repository.querybuilder.HierarchyTypeQueryBuilder;
import org.egov.boundary.persistence.repository.rowmapper.HierarchyTypeRowMapper;
import org.egov.boundary.web.contract.HierarchyType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class HierarchyTypeRepository {

	private static String SELECT_NEXT_HIERARCHY_TYPE_SEQUENCE = "select nextval('seq_eg_hierarchy_type')";

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	public HierarchyTypeRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate, JdbcTemplate jdbcTemplate) {
		this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
		this.jdbcTemplate = jdbcTemplate;
	}

	private Long getNextSequence() {
		return jdbcTemplate.queryForObject(SELECT_NEXT_HIERARCHY_TYPE_SEQUENCE, Long.class);
	}

	public HierarchyType findByNameAndTenantId(String name, String tenantId) {
		HierarchyType hierarchyType = null;
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		parametersMap.put("name", name);
		parametersMap.put("tenantid", tenantId);
		List<HierarchyType> hierarchyTypeList = namedParameterJdbcTemplate.query(
				HierarchyTypeQueryBuilder.getHierarchyTypeByNameAndTenantId(), parametersMap,
				new HierarchyTypeRowMapper());
		if (hierarchyTypeList != null && !hierarchyTypeList.isEmpty()) {
			hierarchyType = hierarchyTypeList.get(0);
		}
		return hierarchyType;
	}

	public List<HierarchyType> findByNameContainingIgnoreCase(String name) {
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		parametersMap.put("name", name);
		List<HierarchyType> hierarchyTypeList = namedParameterJdbcTemplate.query(
				HierarchyTypeQueryBuilder.getHierarchyTypeByNameContainingIgnoreCase(), parametersMap,
				new HierarchyTypeRowMapper());
		return hierarchyTypeList;
	}

	public HierarchyType findByCodeAndTenantId(String code, String tenantId) {
		HierarchyType hierarchyType = null;
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		parametersMap.put("code", code);
		parametersMap.put("tenantid", tenantId);
		List<HierarchyType> hierarchyTypeList = namedParameterJdbcTemplate.query(
				HierarchyTypeQueryBuilder.getHierarchyTypeByCodeAndTenantId(), parametersMap,
				new HierarchyTypeRowMapper());
		if (hierarchyTypeList != null && !hierarchyTypeList.isEmpty()) {
			hierarchyType = hierarchyTypeList.get(0);
		}
		return hierarchyType;
	}

	public HierarchyType findByIdAndTenantId(Long id, String tenantId) {
		HierarchyType hierarchyType = null;
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		parametersMap.put("id", id);
		parametersMap.put("tenantid", tenantId);
		List<HierarchyType> hierarchyTypeList = namedParameterJdbcTemplate.query(
				HierarchyTypeQueryBuilder.getHierarchyTypeByIdAndTenantId(), parametersMap,
				new HierarchyTypeRowMapper());
		if (hierarchyTypeList != null && !hierarchyTypeList.isEmpty()) {
			hierarchyType = hierarchyTypeList.get(0);
		}
		return hierarchyType;
	}

	public List<HierarchyType> findAllByTenantId(String tenantId) {
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		parametersMap.put("tenantid", tenantId);
		List<HierarchyType> hierarchyTypeList = namedParameterJdbcTemplate.query(
				HierarchyTypeQueryBuilder.getAllHierarchyTypeByTenantId(), parametersMap, new HierarchyTypeRowMapper());
		return hierarchyTypeList;
	}

	public HierarchyType create(HierarchyType hierarchyType) {
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		hierarchyType.setId(getNextSequence());
		parametersMap.put("id", hierarchyType.getId());
		parametersMap.put("name", hierarchyType.getName());
		parametersMap.put("code", hierarchyType.getCode());
		parametersMap.put("createddate", new Date());
		parametersMap.put("lastmodifieddate", new Date());
		parametersMap.put("createdby", 1);
		parametersMap.put("lastmodifiedby", 1);
		parametersMap.put("version", 0);
		parametersMap.put("localname", hierarchyType.getLocalName());
		parametersMap.put("tenantid", hierarchyType.getTenantId());
		namedParameterJdbcTemplate.update(HierarchyTypeQueryBuilder.getHierarchyTypeInsertquery(), parametersMap);
		return hierarchyType;
	}

	public HierarchyType update(HierarchyType hierarchyType) {
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		parametersMap.put("name", hierarchyType.getName());
		parametersMap.put("lastmodifieddate", new Date());
		parametersMap.put("lastmodifiedby", 1);
		parametersMap.put("localname", hierarchyType.getLocalName());
		parametersMap.put("code", hierarchyType.getCode());
		parametersMap.put("tenantid", hierarchyType.getTenantId());
		namedParameterJdbcTemplate.update(HierarchyTypeQueryBuilder.getHierarchyTypeupdatequery(), parametersMap);
		return hierarchyType;
	}

}
