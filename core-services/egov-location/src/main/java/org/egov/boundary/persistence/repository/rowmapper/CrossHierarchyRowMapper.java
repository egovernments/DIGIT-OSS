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
import org.egov.boundary.web.contract.CrossHierarchy;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component
public class CrossHierarchyRowMapper implements RowMapper<CrossHierarchy> {

	@Override
	public CrossHierarchy mapRow(final ResultSet rs, final int rowNum) throws SQLException {
		final CrossHierarchy crossHierarchy = new CrossHierarchy();

		crossHierarchy.setId(rs.getLong("id"));
		crossHierarchy.setTenantId(rs.getString("tenantid"));
		crossHierarchy.setCode(rs.getString("code"));

		if (rs.getLong("child") != 0) {
			Boundary child = Boundary.builder().id(rs.getLong("child")).build();
			crossHierarchy.setChild(child);
		}
		if (rs.getLong("parent") != 0) {
			Boundary parent = Boundary.builder().id(rs.getLong("parent")).build();
			crossHierarchy.setParent(parent);
		}
		if (rs.getLong("parenttype") != 0) {
			BoundaryType parentType = BoundaryType.builder().id(String.valueOf(rs.getLong("parenttype"))).build();
			crossHierarchy.setParentType(parentType);
		}
		if (rs.getLong("childtype") != 0) {
			BoundaryType childType = BoundaryType.builder().id(String.valueOf(rs.getLong("childtype"))).build();
			crossHierarchy.setChildType(childType);
		}
		return crossHierarchy;
	}

}
