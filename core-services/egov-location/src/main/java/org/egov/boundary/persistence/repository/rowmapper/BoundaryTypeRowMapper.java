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

package org.egov.boundary.persistence.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.egov.boundary.web.contract.BoundaryType;
import org.egov.boundary.web.contract.HierarchyType;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component
public class BoundaryTypeRowMapper implements RowMapper<BoundaryType> {

	@Override
	public BoundaryType mapRow(final ResultSet rs, final int rowNum) throws SQLException {

		BoundaryType boundaryType = BoundaryType.builder().id(String.valueOf(rs.getLong("btId")))
				.hierarchy(rs.getLong("btHierarchy")).name(rs.getString("btName")).createdBy(rs.getLong("btCreatedBy"))
				.lastModifiedBy(rs.getLong("btLastModifiedBy")).localName(rs.getString("btLocalName"))
				.code(rs.getString("btCode")).tenantId(rs.getString("btTenantId")).build();

		HierarchyType hierarchyType = new HierarchyType();
		hierarchyType.setId(rs.getLong("htId"));
		hierarchyType.setName(rs.getString("htName"));
		hierarchyType.setCode(rs.getString("htCode"));
		hierarchyType.setTenantId(rs.getString("htTenantId"));
		hierarchyType.setLocalName(rs.getString("htLocalName"));
		hierarchyType.setCreatedBy(rs.getLong("htCreatedBy"));
		hierarchyType.setLastModifiedBy(rs.getLong("htLastModifiedBy"));
		hierarchyType.setCreatedDate(rs.getDate("htCreatedDate").getTime());
		hierarchyType.setLastModifiedDate(rs.getDate("htLastModifiedDate").getTime());
		boundaryType.setHierarchyType(hierarchyType);

		if (rs.getDate("btCreatedDate") != null) {
			boundaryType.setCreatedDate(rs.getDate("btCreatedDate").getTime());
		}
		if (rs.getDate("btLastModifiedDate") != null) {
			boundaryType.setLastModifiedDate(rs.getDate("btLastModifiedDate").getTime());
		}

		if (rs.getLong("btParent") != 0) {
			BoundaryType parent = BoundaryType.builder().id(String.valueOf(rs.getLong("btParent"))).build();
			boundaryType.setParent(parent);
		}

		return boundaryType;
	}

}
