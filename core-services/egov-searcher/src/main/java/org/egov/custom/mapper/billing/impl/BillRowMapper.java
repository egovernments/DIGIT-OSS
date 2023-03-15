package org.egov.custom.mapper.billing.impl;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.egov.custom.mapper.billing.impl.Bill.StatusEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

@Component
public class BillRowMapper implements ResultSetExtractor<List<Bill>>{
	
	@Autowired
	private RestTemplate rest;
	
	@Value("${egov.user.contextpath}")
	private String userContext;
	
	@Value("${egov.user.searchpath}")
	private String userSearchPath;

	@Override
	@SuppressWarnings("unchecked")
	public List<Bill> extractData(ResultSet rs) throws SQLException {
		
		Map<String, Bill> billMap = new LinkedHashMap<>();
		Map<String, BillDetail> billDetailMap = new HashMap<>();
		Set<String> userIds = new HashSet<>();

		while (rs.next()) {

			String billId = rs.getString("b_id");
			Bill bill = billMap.get(billId);

			if (bill == null) {

				AuditDetails auditDetails = new AuditDetails();
				auditDetails.setCreatedBy(rs.getString("b_createdby"));
				auditDetails.setCreatedTime((Long) rs.getObject("b_createddate"));
				auditDetails.setLastModifiedBy(rs.getString("b_lastmodifiedby"));
				auditDetails.setLastModifiedTime((Long) rs.getObject("b_lastmodifieddate"));
				
				Address address = new Address();
				address.setDoorNo(rs.getString("ptadd_doorno"));
				address.setCity(rs.getString("ptadd_city"));
				address.setLandmark(rs.getString("ptadd_landmark"));
				address.setPincode(rs.getString("ptadd_pincode"));
				address.setLocality(rs.getString("ptadd_locality"));
				User user = User.builder().id(rs.getString("ptown_userid")).build();
								
				bill = Bill.builder()
					.id(billId)
					.totalAmount(BigDecimal.ZERO)
					.tenantId(rs.getString("b_tenantid"))
					.payerName(rs.getString("b_payername"))
					.payerAddress(rs.getString("b_payeraddress"))
					.payerEmail(rs.getString("b_payeremail"))
					.mobileNumber(rs.getString("mobilenumber"))
					.status(StatusEnum.fromValue(rs.getString("b_status")))
					.businessService(rs.getString("bd_businessService"))
					.billNumber(rs.getString("bd_billno"))
					.billDate(rs.getLong("bd_billDate"))
					.consumerCode(rs.getString("bd_consumerCode"))
					.partPaymentAllowed(rs.getBoolean("bd_partpaymentallowed"))
					.isAdvanceAllowed(rs.getBoolean("bd_isadvanceallowed"))
					.additionalDetails(rs.getObject("b_additionalDetails"))
					.auditDetails(auditDetails)
					.fileStoreId(rs.getString("b_filestoreid"))
					.address(address)
					.user(user)
					.build();
				
				userIds.add(user.getId());

				billMap.put(bill.getId(), bill);
				billDetailMap.clear();
			}
			
			String detailId = rs.getString("bd_id");
			BillDetail billDetail = billDetailMap.get(detailId);
				
			if (billDetail == null) {
				
				billDetail = BillDetail.builder()
					.id(detailId)
					.tenantId(rs.getString("bd_tenantid"))
					.billId(rs.getString("bd_billid"))
					.demandId(rs.getString("demandid"))
					.fromPeriod(rs.getLong("fromperiod"))
					.toPeriod(rs.getLong("toperiod"))
					.amount(rs.getBigDecimal("bd_totalamount"))
					.expiryDate(rs.getLong("bd_expirydate"))
					.build();
				
				billDetailMap.put(billDetail.getId(), billDetail);

				if (bill.getId().equals(billDetail.getBillId())) {
					bill.addBillDetailsItem(billDetail);
					bill.setTotalAmount(bill.getTotalAmount().add(billDetail.getAmount()));
				}
			}
			
			BillAccountDetail billAccDetail = BillAccountDetail.builder()
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
		
		List<Bill> bills = new ArrayList<>(billMap.values());
		
		if(!CollectionUtils.isEmpty(userIds))
			assignUsersToBill(bills, userIds);
		
		return bills;
	}
	
	private void assignUsersToBill(List<Bill> bills, Set<String> userIds) {
		UserSearchCriteria userCriteria = UserSearchCriteria.builder().uuid(userIds).build();
		UserResponse res = rest.postForObject(userContext.concat(userSearchPath), userCriteria, UserResponse.class);
		Map<String, String> users = res.getUsers().stream().collect(Collectors.toMap(User::getUuid, User::getName));
		bills.forEach(bill -> bill.getUser().setName(users.get(bill.getUser().getId())));
	}
	
}
