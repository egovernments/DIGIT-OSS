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
package org.egov.demand.repository.rowmapper;

import org.egov.demand.model.AuditDetail;
import org.egov.demand.model.TaxPeriod;
import org.egov.demand.model.enums.PeriodCycle;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class TaxPeriodRowMapper implements RowMapper<TaxPeriod> {

    @Override
    public TaxPeriod mapRow(ResultSet rs, int rowNum) throws SQLException {
        TaxPeriod taxPeriod = new TaxPeriod();
        taxPeriod.setId(rs.getString("id"));
        taxPeriod.setService(rs.getString("service"));
        taxPeriod.setCode(rs.getString("code"));
        taxPeriod.setFromDate(rs.getLong("fromDate"));
        taxPeriod.setToDate(rs.getLong("toDate"));
        taxPeriod.setFinancialYear(rs.getString("financialYear"));
        taxPeriod.setTenantId(rs.getString("tenantId"));
        String periodCycle = rs.getString("periodcycle");
        taxPeriod.setPeriodCycle(PeriodCycle.fromValue(periodCycle));

        AuditDetail auditDetail = new AuditDetail();
        auditDetail.setCreatedBy(rs.getString("createdby"));
        auditDetail.setLastModifiedBy(rs.getString("lastmodifiedby"));
        auditDetail.setCreatedTime(rs.getLong("createddate"));
        auditDetail.setLastModifiedTime(rs.getLong("lastmodifieddate"));

        taxPeriod.setAuditDetail(auditDetail);

        return taxPeriod;
    }
}
