package org.egov.demand.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.egov.demand.model.AuditDetail;
import org.egov.demand.model.CollectedReceipt;
import org.egov.demand.model.enums.Status;
import org.springframework.jdbc.core.RowMapper;

public class CollectedReceiptsRowMapper implements RowMapper<CollectedReceipt> {

	@Override
	public CollectedReceipt mapRow(ResultSet rs, int rowNum) throws SQLException {

		CollectedReceipt receipt=new CollectedReceipt();
		
		receipt.setBusinessService(rs.getString("businessservice"));
		receipt.setConsumerCode(rs.getString("consumercode"));
		receipt.setReceiptAmount(rs.getDouble("receiptamount"));
		receipt.setReceiptDate(rs.getLong("receiptdate"));
		receipt.setReceiptNumber(rs.getString("receiptnumber"));
		receipt.setStatus(Status.fromValue(rs.getString("status")));
		receipt.setTenantId(rs.getString("tenantid"));
		
		AuditDetail auditDetail=new AuditDetail();
		
		auditDetail.setCreatedBy(rs.getString("createdby"));
		auditDetail.setCreatedTime(rs.getLong("createddate"));
		auditDetail.setLastModifiedBy(rs.getString("lastmodifiedby"));
		auditDetail.setLastModifiedTime(rs.getLong("lastmodifieddate"));
		
		receipt.setAuditDetail(auditDetail);
		
		return receipt;
	}

}
