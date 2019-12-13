package org.egov.demand.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.demand.model.AuditDetails;
import org.egov.demand.model.Bill;
import org.egov.demand.model.BillAccountDetail;
import org.egov.demand.model.BillDetail;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class BillRowMapper implements ResultSetExtractor<List<Bill>>{

	@Override
	public List<Bill> extractData(ResultSet rs) throws SQLException {
		
		Map<String, Bill> billMap = new LinkedHashMap<>();
		Map<String, BillDetail> billDetailMap = new HashMap<>();

		while (rs.next()) {

			String billId = rs.getString("b_id");
			Bill bill = billMap.get(billId);

			if (bill == null) {

				bill = new Bill();
				bill.setId(billId);
				bill.setTenantId(rs.getString("b_tenantid"));
				bill.setPayerName(rs.getString("b_payername"));
				bill.setPayerAddress(rs.getString("b_payeraddress"));
				bill.setPayerEmail(rs.getString("b_payeremail"));
				bill.setIsActive(rs.getBoolean("b_isactive"));
				bill.setIsCancelled(rs.getBoolean("b_iscancelled"));
				bill.setMobileNumber(rs.getString("mobilenumber"));

				AuditDetails auditDetails = new AuditDetails();
				auditDetails.setCreatedBy(rs.getString("b_createdby"));
				auditDetails.setCreatedTime((Long) rs.getObject("b_createddate"));
				auditDetails.setLastModifiedBy(rs.getString("b_lastmodifiedby"));
				auditDetails.setLastModifiedTime((Long) rs.getObject("b_lastmodifieddate"));

				bill.setAuditDetails(auditDetails);

				billMap.put(bill.getId(), bill);
			}

			String detailId = rs.getString("bd_id");
			BillDetail billDetail = billDetailMap.get(detailId);
				
			if (billDetail == null) {
				billDetail = new BillDetail();
				billDetail.setId(detailId);
				billDetail.setTenantId(rs.getString("bd_tenantid"));
				billDetail.setBill(rs.getString("bd_billid"));
				billDetail.setBusinessService(rs.getString("bd_businessservice"));
				billDetail.setBillNumber(rs.getString("bd_billno"));
				billDetail.setBillDate(rs.getLong("bd_billdate"));
					 
				billDetail.setDemandId(rs.getString("demandid"));
				billDetail.setFromPeriod(rs.getLong("fromperiod"));
				billDetail.setToPeriod(rs.getLong("toperiod"));

				billDetail.setConsumerCode(rs.getString("bd_consumercode"));
				billDetail.setConsumerType(rs.getString("bd_consumertype"));
				billDetail.setMinimumAmount(rs.getBigDecimal("bd_minimumamount"));
				billDetail.setTotalAmount(rs.getBigDecimal("bd_totalamount"));
				billDetail.setPartPaymentAllowed(rs.getBoolean("bd_partpaymentallowed"));
				billDetail.setIsAdvanceAllowed(rs.getBoolean("bd_isadvanceallowed"));
				billDetail.setExpiryDate(rs.getLong("bd_expirydate"));
				billDetail.setCollectionModesNotAllowed(Arrays.asList(rs.getString("bd_collectionmodesnotallowed").split(",")));

				billDetailMap.put(billDetail.getId(), billDetail);

				if (bill.getId().equals(billDetail.getBill()))
					bill.addBillDetailsItem(billDetail);
			}

			BillAccountDetail billAccDetail = new BillAccountDetail();
			billAccDetail.setId(rs.getString("ad_id"));
			billAccDetail.setTenantId(rs.getString("ad_tenantid"));
			billAccDetail.setBillDetail(rs.getString("ad_billdetail"));
			billAccDetail.setGlcode(rs.getString("ad_glcode"));
			billAccDetail.setOrder(rs.getInt("ad_orderno"));

			billAccDetail.setAmount(rs.getBigDecimal("ad_amount"));
			billAccDetail.setAdjustedAmount(rs.getBigDecimal("ad_adjustedamount"));
			billAccDetail.setTaxHeadCode(rs.getString("ad_taxheadcode"));
			billAccDetail.setDemandDetailId(rs.getString("demanddetailid"));

			if (billDetail.getId().equals(billAccDetail.getBillDetail()))
				billDetail.addBillAccountDetailsItem(billAccDetail);

		}
		log.debug("converting map to list object ::: " + billMap.values());
		return new ArrayList<>(billMap.values());
	}

}
