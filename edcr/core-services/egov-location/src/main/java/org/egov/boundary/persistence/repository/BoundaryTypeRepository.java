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
import java.util.stream.Collectors;

import org.egov.boundary.persistence.repository.querybuilder.BoundaryTypeQueryBuilder;
import org.egov.boundary.persistence.repository.rowmapper.BoundaryTypeNameRowMapper;
import org.egov.boundary.persistence.repository.rowmapper.BoundaryTypeRowMapper;
import org.egov.boundary.web.contract.BoundaryType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class BoundaryTypeRepository {

	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	private JdbcTemplate jdbcTemplate;

	@Autowired
	public BoundaryTypeRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate, JdbcTemplate jdbcTemplate) {
		this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
		this.jdbcTemplate = jdbcTemplate;
	}

	private static final String SELECT_NEXT_BOUNDARYTYPE_SEQUENCE = "select nextval('seq_eg_boundary_type')";

	private Long getNextSequence() {
		return jdbcTemplate.queryForObject(SELECT_NEXT_BOUNDARYTYPE_SEQUENCE, Long.class);
	}

	public BoundaryType save(BoundaryType boundaryType) {
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		boundaryType.setId(String.valueOf(getNextSequence()));
		parametersMap.put("id", Long.valueOf(boundaryType.getId()));
		if (boundaryType.getParent() != null && boundaryType.getParent().getId() != null) {
			parametersMap.put("parent", boundaryType.getParent().getId());
		} else {
			parametersMap.put("parent", boundaryType.getParent());
		}
		parametersMap.put("hierarchy", boundaryType.getHierarchy());
		parametersMap.put("code", boundaryType.getCode());
		parametersMap.put("name", boundaryType.getName());
		parametersMap.put("hierarchytype", boundaryType.getHierarchyType().getId());
		parametersMap.put("localname", boundaryType.getLocalName());
		parametersMap.put("tenantid", boundaryType.getTenantId());
		parametersMap.put("createddate", new Date());
		parametersMap.put("lastmodifieddate", new Date());
		parametersMap.put("createdby", 1);
		parametersMap.put("lastmodifiedby", 1);
		namedParameterJdbcTemplate.update(BoundaryTypeQueryBuilder.getBoundaryTypeInsertquery(), parametersMap);
		return findByIdAndTenantId(Long.valueOf(boundaryType.getId()), boundaryType.getTenantId());
	}

	public BoundaryType update(BoundaryType boundaryType) {
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		if (boundaryType.getParent() != null && boundaryType.getParent().getId() != null) {
			parametersMap.put("parent", Long.valueOf(boundaryType.getParent().getId()));
		} else {
			parametersMap.put("parent", boundaryType.getParent());
		}
		parametersMap.put("hierarchy", boundaryType.getHierarchy());
		parametersMap.put("name", boundaryType.getName());
		parametersMap.put("hierarchytype", boundaryType.getHierarchyType().getId());
		parametersMap.put("localname", boundaryType.getLocalName());
		parametersMap.put("lastmodifieddate", new Date());
		parametersMap.put("lastmodifiedby", 1);
		parametersMap.put("code", boundaryType.getCode());
		parametersMap.put("tenantid", boundaryType.getTenantId());
		namedParameterJdbcTemplate.update(BoundaryTypeQueryBuilder.getBoundaryTypeUpdatequery(), parametersMap);
		return findByTenantIdAndCode(boundaryType.getTenantId(), boundaryType.getCode());
	}

	public BoundaryType findByIdAndTenantId(Long id, String tenantId) {
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		BoundaryType boundaryType = null;
		parametersMap.put("tenantId", tenantId);
		parametersMap.put("id", id);
		List<BoundaryType> boundaryTypeList = namedParameterJdbcTemplate.query(
				BoundaryTypeQueryBuilder.getBoundaryTypeByIdAndTenant(), parametersMap, new BoundaryTypeRowMapper());
		boundaryTypeList = setBoundaryTypesWithParents(boundaryTypeList);
		if(boundaryTypeList!=null && !boundaryTypeList.isEmpty())
		boundaryType = boundaryTypeList.stream().filter(i -> Long.valueOf(i.getId()).equals(id)).findAny().get();
		return boundaryType;
	}

	public List<BoundaryType> findAllByTenantId(String tenantId) {
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		parametersMap.put("tenantId", tenantId);
		List<BoundaryType> boundaryTypeList = namedParameterJdbcTemplate
				.query(BoundaryTypeQueryBuilder.getAllByTenantId(), parametersMap, new BoundaryTypeRowMapper());
		boundaryTypeList = setBoundaryTypesWithParents(boundaryTypeList);
		return boundaryTypeList;
	}

	public List<BoundaryType> findAllByTenantIdAndName(String tenantId, String name) {
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		parametersMap.put("tenantId", tenantId);
		parametersMap.put("name", name);
		List<BoundaryType> boundaryTypeList = namedParameterJdbcTemplate.query(
				BoundaryTypeQueryBuilder.getAllByTByTenantIdAndName(), parametersMap, new BoundaryTypeRowMapper());
		boundaryTypeList = setBoundaryTypesWithParents(boundaryTypeList);
		if(boundaryTypeList!=null && !boundaryTypeList.isEmpty()){
		boundaryTypeList = boundaryTypeList.parallelStream().filter(i -> i.getName().equals(name))
				.collect(Collectors.toList());
		}
		return boundaryTypeList;
	}

	public BoundaryType findByTenantIdAndCode(String tenantId, String code) {
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		parametersMap.put("tenantId", tenantId);
		parametersMap.put("code", code);
		BoundaryType boundaryType = null;
		List<BoundaryType> boundaryTypeList = namedParameterJdbcTemplate.query(
				BoundaryTypeQueryBuilder.getAllByTByTenantIdAndCode(), parametersMap, new BoundaryTypeRowMapper());
		boundaryTypeList = setBoundaryTypesWithParents(boundaryTypeList);
		if(boundaryTypeList!=null && !boundaryTypeList.isEmpty()){
		boundaryType = boundaryTypeList.parallelStream()
				.filter(i -> i.getCode().equals(code) && i.getTenantId().equals(tenantId)).findAny().get();
		}
		return boundaryType;
	}

	public BoundaryType findByNameAndHierarchyTypeName(String boundaryTypename, String hierarchyTypeName,
			String tenantId) {
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		parametersMap.put("boundaryTypename", boundaryTypename);
		parametersMap.put("hierarchyTypeName", hierarchyTypeName);
		parametersMap.put("tenantId", tenantId);
		BoundaryType boundaryType = null;
		List<BoundaryType> boundaryTypeList = namedParameterJdbcTemplate.query(
				BoundaryTypeQueryBuilder.getAllByTByNameAndHierarchyTypeName(), parametersMap,
				new BoundaryTypeRowMapper());
		boundaryTypeList = setBoundaryTypesWithParents(boundaryTypeList);
		if(boundaryTypeList!=null && !boundaryTypeList.isEmpty()){
		boundaryType = boundaryTypeList.parallelStream()
				.filter(i -> i.getName().equals(boundaryTypename)
						&& i.getHierarchyType().getName().equals(hierarchyTypeName) && i.getTenantId().equals(tenantId))
				.findAny().get();
		}
		return boundaryType;
	}

	public List<BoundaryType> getAllBoundarTypesByHierarchyTypeIdAndTenantName(final String hierarchyTypeName,
			final String tenantId) {
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		parametersMap.put("hierarchyTypeName", hierarchyTypeName);
		parametersMap.put("tenantId", tenantId);
		List<BoundaryType> boundaryTypeList = namedParameterJdbcTemplate.query(
				BoundaryTypeQueryBuilder.getAllByHierarchyTypeAndTenant(), parametersMap,
				new BoundaryTypeNameRowMapper());
		return boundaryTypeList;
	}

	public List<BoundaryType> setBoundaryTypesWithParents(List<BoundaryType> boundaryTypeList) {
		for (int i = 0; i < boundaryTypeList.size(); i++) {
			for (int j = 0; j < boundaryTypeList.size(); j++) {
				if (null != boundaryTypeList.get(i).getParent()
						&& boundaryTypeList.get(i).getParent().getId().equals(boundaryTypeList.get(j).getId())) {
					boundaryTypeList.get(i).setParent(boundaryTypeList.get(j));
				}
			}
		}
		return boundaryTypeList;
	}

}
