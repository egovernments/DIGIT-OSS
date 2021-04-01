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

import org.egov.boundary.domain.model.Boundary;
import org.egov.boundary.web.contract.BoundaryType;
import org.egov.boundary.web.contract.HierarchyType;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component
public class BoundaryRowMapper implements RowMapper<Boundary> {

	@Override
	public Boundary mapRow(final ResultSet rs, final int rowNum) throws SQLException {

		BoundaryType boundaryType = BoundaryType.builder().id(String.valueOf(rs.getLong("btId")))
				.hierarchy(rs.getLong("btHierarchy")).name(rs.getString("btName")).createdBy(rs.getLong("btCreatedBy"))
				.lastModifiedBy(rs.getLong("btLastModifiedBy")).localName(rs.getString("btLocalName"))
				.code(rs.getString("btCode")).tenantId(rs.getString("btTenantId")).build();

		if (rs.getDate("btCreatedDate") != null) {
			boundaryType.setCreatedDate(rs.getDate("btCreatedDate").getTime());
		}
		if (rs.getDate("btLastModifiedDate") != null) {
			boundaryType.setLastModifiedDate(rs.getDate("btLastModifiedDate").getTime());
		}

		HierarchyType hierarchyType = new HierarchyType();
		hierarchyType.setId(rs.getLong("btHierarchyType"));
		boundaryType.setHierarchyType(hierarchyType);

		final Boundary boundary = Boundary.builder().id(rs.getLong("bId")).name(rs.getString("bName"))
				.localName(rs.getString("bLocalName")).boundaryNum(rs.getLong("bBoundaryNum"))
				.fromDate(rs.getDate("bFromdate")).toDate(rs.getDate("bToDate")).bndryId(rs.getLong("bBndryid"))
				.materializedPath(rs.getString("bMaterialiedPath")).code(rs.getString("bCode"))
				.isHistory(rs.getBoolean("bHistory")).createdBy(rs.getLong("bCreatedBy"))
				.lastModifiedBy(rs.getLong("bLastModifiedBy")).tenantId(rs.getString("bTenantId"))
				.boundaryType(boundaryType).build();

		if (rs.getDate("bCreatedDate") != null) {
			boundary.setCreatedDate(rs.getDate("bCreatedDate").getTime());
		}
		if (rs.getDate("bLastModifiedDate") != null) {
			boundary.setLastModifiedDate(rs.getDate("bLastModifiedDate").getTime());
		}

		if (rs.getFloat("bLongitude") != 0) {
			boundary.setLongitude(rs.getFloat("bLongitude"));
		}
		if (rs.getFloat("bLatitude") != 0) {
			boundary.setLatitude(rs.getFloat("bLatitude"));
		}
		if (rs.getLong("bParent") != 0) {
			Boundary parent = Boundary.builder().id(rs.getLong("bParent")).build();
			boundary.setParent(parent);
		}
		return boundary;

	}

}
