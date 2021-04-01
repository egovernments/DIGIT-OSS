/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) <2015>  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.boundary.persistence.repository;

import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.egov.boundary.domain.model.Boundary;
import org.egov.boundary.persistence.repository.querybuilder.CrossHierarchyQueryBuilder;
import org.egov.boundary.persistence.repository.rowmapper.BoundaryMapper;
import org.egov.boundary.persistence.repository.rowmapper.CrossHierarchyLocationNameRowMapper;
import org.egov.boundary.persistence.repository.rowmapper.CrossHierarchyRowMapper;
import org.egov.boundary.web.contract.CrossHierarchy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class CrossHierarchyRepository {

	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	private JdbcTemplate jdbcTemplate;

	@Autowired
	public CrossHierarchyRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate, JdbcTemplate jdbcTemplate) {
		this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
		this.jdbcTemplate = jdbcTemplate;
	}

	private static final String SELECT_NEXT_CROSSHIERARCHY_SEQUENCE = "select nextval('seq_eg_crosshierarchy')";

	private Long getNextSequence() {
		return jdbcTemplate.queryForObject(SELECT_NEXT_CROSSHIERARCHY_SEQUENCE, Long.class);
	}

	public List<CrossHierarchy> findCrossHierarchiesByParentIdAndTenantId(final Long id, final String tenantId) {
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		parametersMap.put("parent", id);
		parametersMap.put("tenantId", tenantId);
		List<CrossHierarchy> crossHierarchyList = namedParameterJdbcTemplate.query(
				CrossHierarchyQueryBuilder.getCrossHierarchiesByParentIdAndTenantId(), parametersMap,
				new CrossHierarchyRowMapper());
		return crossHierarchyList;
	}

	public CrossHierarchy save(final CrossHierarchy crossHierarchy) {
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		crossHierarchy.setId(getNextSequence());
		parametersMap.put("id", crossHierarchy.getId());
		if (crossHierarchy.getParent() != null && crossHierarchy.getParent().getId() != null) {
			parametersMap.put("parent", crossHierarchy.getParent().getId());
		}
		if (crossHierarchy.getChild() != null && crossHierarchy.getChild().getId() != null) {
			parametersMap.put("child", crossHierarchy.getChild().getId());
		}
		if (crossHierarchy.getParentType() != null && crossHierarchy.getParentType().getId() != null) {
			parametersMap.put("parenttype", Long.valueOf(crossHierarchy.getParentType().getId()));
		} else {
			parametersMap.put("parenttype", crossHierarchy.getParentType());
		}
		if (crossHierarchy.getChildType() != null && crossHierarchy.getChildType().getId() != null) {
			parametersMap.put("childtype", Long.valueOf(crossHierarchy.getChildType().getId()));
		} else {
			parametersMap.put("childtype", crossHierarchy.getChildType());
		}
		parametersMap.put("tenantid", crossHierarchy.getTenantId());
		parametersMap.put("code", crossHierarchy.getCode());
		parametersMap.put("createdby", 1);
		parametersMap.put("lastmodifiedby", 1);
		parametersMap.put("createddate", new Date());
		parametersMap.put("lastmodifieddate", new Date());
		namedParameterJdbcTemplate.update(CrossHierarchyQueryBuilder.getInsertCrossHierarchy(), parametersMap);
		return findByIdAndTenantId(crossHierarchy.getId(), crossHierarchy.getTenantId());
	}

	public CrossHierarchy update(final CrossHierarchy crossHierarchy) {

		Map<String, Object> parametersMap = new HashMap<String, Object>();
		if (crossHierarchy.getParent() != null && crossHierarchy.getParent().getId() != null) {
			parametersMap.put("parent", crossHierarchy.getParent().getId());
		}
		if (crossHierarchy.getChild() != null && crossHierarchy.getChild().getId() != null) {
			parametersMap.put("child", crossHierarchy.getChild().getId());
		}
		if (crossHierarchy.getParentType() != null && crossHierarchy.getParentType().getId() != null) {
			parametersMap.put("parenttype", Long.valueOf(crossHierarchy.getParentType().getId()));
		} else {
			parametersMap.put("parenttype", crossHierarchy.getParentType());
		}
		if (crossHierarchy.getChildType() != null && crossHierarchy.getChildType().getId() != null) {
			parametersMap.put("childtype", Long.valueOf(crossHierarchy.getChildType().getId()));
		} else {
			parametersMap.put("childtype", crossHierarchy.getChildType());
		}
		parametersMap.put("tenantid", crossHierarchy.getTenantId());
		parametersMap.put("code", crossHierarchy.getCode());
		parametersMap.put("lastmodifiedby", 1);
		parametersMap.put("lastmodifieddate", new Date());
		namedParameterJdbcTemplate.update(CrossHierarchyQueryBuilder.getUpdateCrossHierarchy(), parametersMap);
		return findByCodeAndTenantId(crossHierarchy.getCode(), crossHierarchy.getTenantId());
	}

	public List<CrossHierarchy> findActiveBoundariesByNameAndBndryTypeNameAndHierarchyTypeNameAndTenantId(
			String boundaryTypeName, String hierarchyTypeName, String parenthierarchyTypeName, String name,
			String tenantId) {
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		parametersMap.put("boundaryTypeName", boundaryTypeName);
		parametersMap.put("hierarchyTypeName", hierarchyTypeName);
		parametersMap.put("parenthierarchyTypeName", parenthierarchyTypeName);
		parametersMap.put("name", name);
		parametersMap.put("tenantId", tenantId);
		List<CrossHierarchy> crossHierarchyList = namedParameterJdbcTemplate.query(
				CrossHierarchyQueryBuilder.getActiveBoundariesByNameAndBndryTypeNameAndHierarchyTypeNameAndTenantId(),
				parametersMap, new CrossHierarchyLocationNameRowMapper());

		return crossHierarchyList;
	}

	public CrossHierarchy findByIdAndTenantId(Long id, String tenantId) {
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		parametersMap.put("id", id);
		parametersMap.put("tenantId", tenantId);
		CrossHierarchy crossHierarchy = null;
		List<CrossHierarchy> crossHierarchyList = namedParameterJdbcTemplate.query(
				CrossHierarchyQueryBuilder.getCrossHierarchyByIdAndTenant(), parametersMap,
				new CrossHierarchyRowMapper());
		if (crossHierarchyList != null && !crossHierarchyList.isEmpty()) {
			crossHierarchy = crossHierarchyList.get(0);
		}
		if (crossHierarchy != null) {
			Map<String, Object> parametersMap1 = new HashMap<String, Object>();
			parametersMap1.put("tenantId", tenantId);
			List<Boundary> boundaryList = namedParameterJdbcTemplate.query(
					CrossHierarchyQueryBuilder.getCrossHierarchyChildernByParentIdAndTenant(), parametersMap1,
					new BoundaryMapper());
			boundaryList = setBoundariesWithChilds(boundaryList);
			for (Boundary boundary : boundaryList) {
				if (boundary.getId().equals(crossHierarchy.getParent().getId())) {
					crossHierarchy.setParent(boundary);
				}
				if (boundary.getId().equals(crossHierarchy.getChild().getId())) {
					crossHierarchy.setChild(boundary);
				}
			}
		}
		return crossHierarchy;
	}

	public List<CrossHierarchy> findAllByTenantId(String tenantId) {
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		parametersMap.put("tenantId", tenantId);
		List<CrossHierarchy> crossHierarchyList = namedParameterJdbcTemplate.query(
				CrossHierarchyQueryBuilder.getAllCrossHierarchyByTenantId(), parametersMap,
				new CrossHierarchyRowMapper());
		if (crossHierarchyList != null && !crossHierarchyList.isEmpty()) {
			Map<String, Object> parametersMap1 = new HashMap<String, Object>();
			parametersMap1.put("tenantId", tenantId);
			List<Boundary> boundaryList = namedParameterJdbcTemplate.query(
					CrossHierarchyQueryBuilder.getCrossHierarchyChildernByParentIdAndTenant(), parametersMap1,
					new BoundaryMapper());
			boundaryList = setBoundariesWithChilds(boundaryList);
			for (CrossHierarchy crossHierarchy : crossHierarchyList) {
				for (Boundary boundary : boundaryList) {
					if (boundary.getId().equals(crossHierarchy.getParent().getId())) {
						crossHierarchy.setParent(boundary);
					}
					if (boundary.getId().equals(crossHierarchy.getChild().getId())) {
						crossHierarchy.setChild(boundary);
					}
				}
			}
		}
		return crossHierarchyList;
	}

	public CrossHierarchy findByCodeAndTenantId(String code, String tenantId) {
		Map<String, Object> parametersMap = new HashMap<String, Object>();
		parametersMap.put("code", code);
		parametersMap.put("tenantId", tenantId);
		CrossHierarchy crossHierarchy = null;
		List<CrossHierarchy> crossHierarchyList = namedParameterJdbcTemplate.query(
				CrossHierarchyQueryBuilder.getCrossHierarchyByCodeAndTenant(), parametersMap,
				new CrossHierarchyRowMapper());
		if (crossHierarchyList != null && !crossHierarchyList.isEmpty()) {
			crossHierarchy = crossHierarchyList.get(0);
		}
		if (crossHierarchy != null) {
			Map<String, Object> parametersMap1 = new HashMap<String, Object>();
			parametersMap1.put("tenantId", tenantId);
			List<Boundary> boundaryList = namedParameterJdbcTemplate.query(
					CrossHierarchyQueryBuilder.getCrossHierarchyChildernByParentIdAndTenant(), parametersMap1,
					new BoundaryMapper());
			boundaryList = setBoundariesWithChilds(boundaryList);
			for (Boundary boundary : boundaryList) {
				if (boundary.getId().equals(crossHierarchy.getParent().getId())) {
					crossHierarchy.setParent(boundary);
				}
				if (boundary.getId().equals(crossHierarchy.getChild().getId())) {
					crossHierarchy.setChild(boundary);
				}
			}
		}
		return crossHierarchy;
	}

	public List<Boundary> setBoundariesWithChilds(List<Boundary> boundaryList) {
		for (int i = 0; i < boundaryList.size(); i++) {
			Set<Boundary> children = new HashSet<Boundary>();
			for (int j = 0; j < boundaryList.size(); j++) {
				if (boundaryList.get(j).getParent() != null
						&& boundaryList.get(j).getParent().getId().equals(boundaryList.get(i).getId())) {
					children.add(boundaryList.get(j));
				}
			}
			if (!children.isEmpty())
				boundaryList.get(i).setChildren(children);
		}
		return boundaryList;
	}

}
