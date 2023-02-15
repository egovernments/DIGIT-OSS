package org.egov.demand.repository.rowmapper;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.demand.model.AuditDetails;
import org.egov.demand.model.BillAccountDetailV2;
import org.egov.demand.model.BillDetailV2;
import org.egov.demand.model.BillV2;
import org.egov.demand.model.BillV2.BillStatus;
import org.egov.demand.util.Util;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

@Component
public class BillRowMapperV2 implements ResultSetExtractor<List<BillV2>>{

	@Autowired
	private Util util;

	@Override
	public List<BillV2> extractData(ResultSet rs) throws SQLException {

		Map<String, BillV2> billMap = new LinkedHashMap<>();
		Map<String, BillDetailV2> billDetailMap = new HashMap<>();

		while (rs.next()) {

			String billId = rs.getString("b_id");
			BillV2 bill = billMap.get(billId);

			if (bill == null) {

				AuditDetails auditDetails = new AuditDetails();
				auditDetails.setCreatedBy(rs.getString("b_createdby"));
				auditDetails.setCreatedTime((Long) rs.getObject("b_createddate"));
				auditDetails.setLastModifiedBy(rs.getString("b_lastmodifiedby"));
				auditDetails.setLastModifiedTime((Long) rs.getObject("b_lastmodifieddate"));
				
				
				bill = BillV2.builder()
					.id(billId)
					.totalAmount(BigDecimal.ZERO)
					.tenantId(rs.getString("b_tenantid"))
					.userId(rs.getString("b_payerid"))
					.payerName(rs.getString("b_payername"))
					.payerAddress(rs.getString("b_payeraddress"))
					.payerEmail(rs.getString("b_payeremail"))
					.mobileNumber(rs.getString("mobilenumber"))
					.status(BillStatus.fromValue(rs.getString("b_status")))
					.businessService(rs.getString("bd_businessService"))
					.billNumber(rs.getString("bd_billno"))
					.billDate(rs.getLong("bd_billDate"))
					.consumerCode(rs.getString("bd_consumerCode"))
					.fileStoreId(rs.getString("b_fileStoreId"))
					.additionalDetails(util.getJsonValue((PGobject) rs.getObject("b_additionalDetails")))
					.auditDetails(auditDetails)
					.build();

				billMap.put(bill.getId(), bill);
				billDetailMap.clear();
			}
			
			String detailId = rs.getString("bd_id");
			BillDetailV2 billDetail = billDetailMap.get(detailId);
				
			if (billDetail == null) {
				
				billDetail = BillDetailV2.builder()
					.id(detailId)
					.tenantId(rs.getString("bd_tenantid"))
					.billId(rs.getString("bd_billid"))
					.demandId(rs.getString("demandid"))
					.fromPeriod(rs.getLong("fromperiod"))
					.toPeriod(rs.getLong("toperiod"))
					.amount(rs.getBigDecimal("bd_totalamount"))
					.expiryDate(rs.getLong("bd_expirydate"))
					.additionalDetails(util.getJsonValue((PGobject) rs.getObject("bd_additionaldetails")))
					.build();

				billDetailMap.put(billDetail.getId(), billDetail);

				if (bill.getId().equals(billDetail.getBillId())) {
					bill.addBillDetailsItem(billDetail);
					bill.setTotalAmount(bill.getTotalAmount().add(billDetail.getAmount()));
				}
			}
			
			BillAccountDetailV2 billAccDetail = BillAccountDetailV2.builder()
				.id(rs.getString("ad_id"))
				.tenantId(rs.getString("ad_tenantid"))
				.billDetailId(rs.getString("ad_billdetail"))
				.order(rs.getInt("ad_orderno"))
				.amount(rs.getBigDecimal("ad_amount"))
				.adjustedAmount(rs.getBigDecimal("ad_adjustedamount"))
				.taxHeadCode(rs.getString("ad_taxheadcode"))
				.demandDetailId(rs.getString("demanddetailid"))
				.build();

			if (billDetail.getId().equals(billAccDetail.getBillDetailId()))
				billDetail.addBillAccountDetailsItem(billAccDetail);

		}
		
		return new ArrayList<>(billMap.values());
	}
}
