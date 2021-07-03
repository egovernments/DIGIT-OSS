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

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.demand.model.AuditDetails;
import org.egov.demand.model.Demand;
import org.egov.demand.model.Demand.StatusEnum;
import org.egov.demand.model.DemandDetail;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.User;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;

@Component
public class DemandRowMapper implements ResultSetExtractor<List<Demand>> {
	

	@Autowired
	private Util util;
	
	@Override
	public List<Demand> extractData(ResultSet rs) throws SQLException, DataAccessException {

		Map<String, Demand> demandMap = new LinkedHashMap<>();
		String demandIdRsName = "did";

		while (rs.next()) {

			String demandId = rs.getString(demandIdRsName);
			Demand demand = demandMap.get(demandId);

			if (demand == null) {

				demand = new Demand();
				demand.setId(demandId);
				demand.setBusinessService(rs.getString("dbusinessservice"));
				demand.setConsumerCode(rs.getString("dconsumerCode"));
				demand.setConsumerType(rs.getString("dconsumerType"));
				demand.setTaxPeriodFrom(rs.getLong("dtaxPeriodFrom"));
				demand.setTaxPeriodTo(rs.getLong("dtaxPeriodTo"));
				demand.setTenantId(rs.getString("dtenantid"));
				demand.setBillExpiryTime(rs.getLong("dbillexpirytime"));
				demand.setStatus(StatusEnum.fromValue(rs.getString("status")));
				demand.setIsPaymentCompleted(rs.getBoolean("ispaymentcompleted"));
				demand.setMinimumAmountPayable(rs.getBigDecimal("dminimumAmountPayable"));
				
				PGobject adDetail = (PGobject) rs.getObject("demandadditionaldetails");	
				JsonNode json = util.getJsonValue(adDetail);
				demand.setAdditionalDetails(json);
				
				String payerId = rs.getString("payer");
				if (null != payerId) {
					demand.setPayer(User.builder().uuid(payerId).build());
				}

				AuditDetails auditDetail = new AuditDetails();
				auditDetail.setCreatedBy(rs.getString("dcreatedby"));
				auditDetail.setLastModifiedBy(rs.getString("dlastModifiedby"));
				auditDetail.setCreatedTime(rs.getLong("dcreatedtime"));
				auditDetail.setLastModifiedTime(rs.getLong("dlastModifiedtime"));
				demand.setAuditDetails(auditDetail);

				demand.setDemandDetails(new ArrayList<>());
				demandMap.put(demand.getId(), demand);
			}

			DemandDetail demandDetail = new DemandDetail();
			demandDetail.setId(rs.getString("dlid"));
			demandDetail.setDemandId(rs.getString("dldemandid"));

			demandDetail.setTaxHeadMasterCode(rs.getString("dltaxheadcode"));
			;
			demandDetail.setTenantId(rs.getString("dltenantid"));
			demandDetail.setTaxAmount(rs.getBigDecimal("dltaxamount"));
			demandDetail.setCollectionAmount(rs.getBigDecimal("dlcollectionamount"));

			AuditDetails dlauditDetail = new AuditDetails();
			dlauditDetail.setCreatedBy(rs.getString("dlcreatedby"));
			dlauditDetail.setCreatedTime(rs.getLong("dlcreatedtime"));
			dlauditDetail.setLastModifiedBy(rs.getString("dllastModifiedby"));
			dlauditDetail.setLastModifiedTime(rs.getLong("dllastModifiedtime"));
			demandDetail.setAuditDetails(dlauditDetail);

			if (demand.getId().equals(demandDetail.getDemandId()))
				demand.getDemandDetails().add(demandDetail);
		}
		return new ArrayList<>(demandMap.values());
	}
	
}