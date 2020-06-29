package org.egov.collection.repository.rowmapper;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.egov.collection.model.AuditDetails;
import org.egov.collection.web.contract.Bill;
import org.egov.collection.web.contract.Bill.StatusEnum;
import org.egov.collection.web.contract.BillAccountDetail;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.egov.collection.web.contract.BillDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class BillRowMapper implements ResultSetExtractor<List<Bill>> {

	@Autowired
	private ObjectMapper mapper;

	@Override
	public List<Bill> extractData(ResultSet rs) throws SQLException {

		Map<String, Bill> billMap = new LinkedHashMap<>();
		Map<String, BillDetail> billDetailMap = new HashMap<>();

		while (rs.next()) {

			String billId = rs.getString("b_id");
			Bill bill = billMap.get(billId);

			if (bill == null) {

				AuditDetails auditDetails = new AuditDetails();
				auditDetails.setCreatedBy(rs.getString("b_createdby"));
				auditDetails.setCreatedTime((Long) rs.getObject("b_createdtime"));
				auditDetails.setLastModifiedBy(rs.getString("b_lastmodifiedby"));
				auditDetails.setLastModifiedTime((Long) rs.getObject("b_lastmodifiedtime"));

				bill = Bill.builder().id(billId).totalAmount(BigDecimal.ZERO).tenantId(rs.getString("b_tenantid"))
						.status(StatusEnum.fromValue(rs.getString("b_status")))
						.businessService(rs.getString("b_businessService"))
						.billNumber(rs.getString("b_billnumber"))
						.billDate(rs.getLong("b_billdate"))
						.consumerCode(rs.getString("b_consumerCode"))
						.partPaymentAllowed(rs.getBoolean("b_partpaymentallowed"))
						.isAdvanceAllowed(rs.getBoolean("b_isadvanceallowed"))
						.auditDetails(auditDetails).build();
				
				if(null != rs.getString("b_collectionmodesnotallowed")) {
					bill.setCollectionModesNotAllowed(
							Arrays.asList(rs.getString("b_collectionmodesnotallowed").split(",")));
				}

				PGobject obj = (PGobject) rs.getObject("b_additionalDetails");
				bill.setAdditionalDetails(getJsonValue(obj));

				billMap.put(bill.getId(), bill);
				billDetailMap.clear();
			}

			String detailId = rs.getString("bd_id");
			BillDetail billDetail = billDetailMap.get(detailId);

			if (billDetail == null) {

				billDetail = BillDetail.builder().id(detailId).tenantId(rs.getString("bd_tenantid"))
						.billId(rs.getString("bd_billid")).demandId(rs.getString("demandid"))
						.fromPeriod(rs.getLong("fromperiod")).toPeriod(rs.getLong("toperiod"))
						.amount(rs.getBigDecimal("bd_amount")).amountPaid(rs.getBigDecimal("bd_amountpaid"))
						.expiryDate(rs.getLong("bd_expirydate")).build();
				
				PGobject obj = (PGobject) rs.getObject("bd_additionalDetails");
				billDetail.setAdditionalDetails(getJsonValue(obj));

				billDetailMap.put(billDetail.getId(), billDetail);

				if (bill.getId().equals(billDetail.getBillId())) {
					bill.addBillDetail(billDetail);
					bill.setTotalAmount(bill.getTotalAmount().add(billDetail.getAmount()));
				}
			}

			BillAccountDetail billAccDetail = BillAccountDetail.builder().id(rs.getString("ad_id"))
					.tenantId(rs.getString("ad_tenantid")).billDetailId(rs.getString("ad_billdetailid"))
					.order(rs.getInt("ad_order")).amount(rs.getBigDecimal("ad_amount"))
					.adjustedAmount(rs.getBigDecimal("ad_adjustedamount")).taxHeadCode(rs.getString("ad_taxheadcode"))
					.demandDetailId(rs.getString("ad_demanddetailid")).build();
			
			PGobject obj = (PGobject) rs.getObject("ad_additionalDetails");
			billAccDetail.setAdditionalDetails(getJsonValue(obj));

			if (billDetail.getId().equals(billAccDetail.getBillDetailId()))
				billDetail.addBillAccountDetail(billAccDetail);

		}

		return new ArrayList<>(billMap.values());
	}

	private JsonNode getJsonValue(PGobject pGobject) {
		try {
			if (Objects.isNull(pGobject) || Objects.isNull(pGobject.getValue()))
				return null;
			else
				return mapper.readTree(pGobject.getValue());
		} catch (IOException e) {
			throw new CustomException("SERVER_ERROR",
					"Exception occurred while parsing the additionalDetail json : " + e.getMessage());
		}
	}
}
