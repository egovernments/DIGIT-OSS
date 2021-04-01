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
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component
public class BoundaryMapper implements RowMapper<Boundary> {

	@Override
	public Boundary mapRow(final ResultSet rs, final int rowNum) throws SQLException {

		final Boundary boundary = Boundary.builder().id(rs.getLong("id")).name(rs.getString("name"))
				.boundaryNum(rs.getLong("boundarynum")).fromDate(rs.getDate("fromdate")).toDate(rs.getDate("todate"))
				.bndryId(rs.getLong("bndryid")).materializedPath(rs.getString("materializedpath"))
				.isHistory(rs.getBoolean("ishistory")).createdBy(rs.getLong("createdby"))
				.lastModifiedBy(rs.getLong("lastmodifiedby")).tenantId(rs.getString("tenantid")).build();

		if (rs.getDate("createddate") != null) {
			boundary.setCreatedDate(rs.getDate("createddate").getTime());
		}
		if (rs.getDate("lastmodifieddate") != null) {
			boundary.setLastModifiedDate(rs.getDate("lastmodifieddate").getTime());
		}
		if (rs.getFloat("longitude") != 0) {
			boundary.setLongitude(rs.getFloat("longitude"));
		}
		if (rs.getFloat("latitude") != 0) {
			boundary.setLongitude(rs.getFloat("latitude"));
		}
		if (rs.getLong("parent") != 0) {
			Boundary parent = Boundary.builder().id(rs.getLong("parent")).build();
			boundary.setParent(parent);
		}
		return boundary;
	}
}
