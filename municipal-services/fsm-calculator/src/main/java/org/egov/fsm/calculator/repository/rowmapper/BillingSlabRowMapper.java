package org.egov.fsm.calculator.repository.rowmapper;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.egov.fsm.calculator.web.models.AuditDetails;
import org.egov.fsm.calculator.web.models.BillingSlab;
import org.egov.fsm.calculator.web.models.BillingSlab.SlumEnum;
import org.egov.fsm.calculator.web.models.BillingSlab.StatusEnum;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

@Component
public class BillingSlabRowMapper implements ResultSetExtractor<List<BillingSlab>> {

	@Override
	public List<BillingSlab> extractData(ResultSet rs) throws SQLException, DataAccessException {
		List<BillingSlab> billingSlabList= new ArrayList<>();
		while (rs.next()) {
			BillingSlab billingSlab = new BillingSlab();
			
			String id = rs.getString("id");
			String tenantId = rs.getString("tenantid");
			BigDecimal capacityFrom = rs.getBigDecimal("capacityfrom");
			BigDecimal capacityTo = rs.getBigDecimal("capacityto");
			String propertyType = rs.getString("propertytype");
			String slum = rs.getString("slum");
			BigDecimal price = rs.getBigDecimal("price");
			String status = rs.getString("status");
			
			
			String createdBy = rs.getString("createdby");
			String lastModifiedBy = rs.getString("lastmodifiedby");
			Long createdTime = rs.getLong("createdtime");
			Long lastModifiedTime = rs.getLong("lastmodifiedtime");

			AuditDetails audit = new AuditDetails();
			audit = audit.builder().createdBy(createdBy).lastModifiedBy(lastModifiedBy).createdTime(createdTime)
					.lastModifiedTime(lastModifiedTime).build();
			
			billingSlab = BillingSlab.builder().id(id).tenantId(tenantId).capacityFrom(capacityFrom).capacityTo(capacityTo).propertyType(propertyType).price(price).slum(SlumEnum.valueOf(slum)).status(StatusEnum.valueOf(status)).auditDetails(audit).build();
			billingSlabList.add(billingSlab);
			
		}
		return billingSlabList;
	}
	
}
