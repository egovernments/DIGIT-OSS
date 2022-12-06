package org.egov.demand.repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.egov.demand.model.AuditDetails;
import org.egov.demand.model.BillAccountDetailV2;
import org.egov.demand.model.BillDetailV2;
import org.egov.demand.model.BillSearchCriteria;
import org.egov.demand.model.BillV2;
import org.egov.demand.model.BillV2.BillStatus;
import org.egov.demand.model.UpdateBillCriteria;
import org.egov.demand.repository.querybuilder.BillQueryBuilder;
import org.egov.demand.repository.rowmapper.BillRowMapperV2;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.BillRequestV2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class BillRepositoryV2 {

	@Autowired
	private BillQueryBuilder billQueryBuilder;
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private Util util;
	
	@Autowired
	private BillRowMapperV2 searchBillRowMapper;
	
	public List<BillV2> findBill(BillSearchCriteria billCriteria){
		
		List<Object> preparedStatementValues = new ArrayList<>();
		String queryStr = billQueryBuilder.getBillQuery(billCriteria, preparedStatementValues);
		log.debug("query:::"+queryStr+"  preparedStatementValues::"+preparedStatementValues);
		return jdbcTemplate.query(queryStr, preparedStatementValues.toArray(), searchBillRowMapper);
	}
	
	@Transactional
	public void saveBill(BillRequestV2 billRequest){
		
		List<BillV2> bills = billRequest.getBills();
		
		jdbcTemplate.batchUpdate(BillQueryBuilder.INSERT_BILL_QUERY, new BatchPreparedStatementSetter() {
			
			@Override
			public void setValues(PreparedStatement ps, int index) throws SQLException {
				BillV2 bill = bills.get(index);

				AuditDetails auditDetails = bill.getAuditDetails();
				
				ps.setString(1, bill.getId());
				ps.setString(15, bill.getUserId());
				ps.setString(16, bill.getConsumerCode());
				ps.setString(2, bill.getTenantId());
				ps.setString(3, bill.getPayerName());
				ps.setString(4, bill.getPayerAddress());
				ps.setString(5, bill.getPayerEmail());
				ps.setObject(6, null);
				ps.setObject(7, null);
				ps.setString(8, auditDetails.getCreatedBy());
				ps.setLong(9, auditDetails.getCreatedTime());
				ps.setString(10, auditDetails.getLastModifiedBy());
				ps.setLong(11, auditDetails.getLastModifiedTime());
				ps.setString(12, bill.getMobileNumber());
				ps.setString(13, bill.getStatus().toString());
				ps.setObject(14, util.getPGObject(bill.getAdditionalDetails()));
			}
			
			@Override
			public int getBatchSize() {
				return bills.size();
			}
		});
		saveBillDetails(billRequest);
	}
	
	public void saveBillDetails(BillRequestV2 billRequest) {

		List<BillV2> bills = billRequest.getBills();
		List<BillDetailV2> billDetails = new ArrayList<>();
		List<BillAccountDetailV2> billAccountDetails = new ArrayList<>();
		AuditDetails auditDetails = bills.get(0).getAuditDetails();
		
		Map<String, BillV2> billDetailIdAndBillMap = new HashMap<>();

		for (BillV2 bill : bills) {
			
			List<BillDetailV2> tempBillDetails = bill.getBillDetails();
			billDetails.addAll(tempBillDetails);

			for (BillDetailV2 billDetail : tempBillDetails) {
				
				billDetailIdAndBillMap.put(billDetail.getId(), bill);
				billAccountDetails.addAll(billDetail.getBillAccountDetails());
			}
		}

		jdbcTemplate.batchUpdate(BillQueryBuilder.INSERT_BILLDETAILS_QUERY, new BatchPreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement ps, int index) throws SQLException {
				BillDetailV2 billDetail = billDetails.get(index);
				BillV2 bill = billDetailIdAndBillMap.get(billDetail.getId());

				ps.setString(1, billDetail.getId());
				ps.setString(2, billDetail.getTenantId());
				ps.setString(3, billDetail.getBillId());
				ps.setString(4, billDetail.getDemandId());
				ps.setLong(5, billDetail.getFromPeriod());
				ps.setLong(6, billDetail.getToPeriod());
				ps.setString(7, bill.getBusinessService());
				ps.setString(8, bill.getBillNumber());
				ps.setLong(9, bill.getBillDate());
				ps.setString(10, bill.getConsumerCode());
				ps.setString(11, null);
				ps.setString(12, null);
				ps.setString(13, null);
				ps.setObject(14, null);
				ps.setObject(15, billDetail.getAmount());
				// apportioning logic does not reside in billing service anymore 
				ps.setBoolean(16, false);
				ps.setObject(17, null);
				ps.setString(18, null);
				ps.setString(19, auditDetails.getCreatedBy());
				ps.setLong(20, auditDetails.getCreatedTime());
				ps.setString(21, auditDetails.getLastModifiedBy());
				ps.setLong(22, auditDetails.getLastModifiedTime());
				ps.setObject(23, null);
				ps.setLong(24, billDetail.getExpiryDate());
				ps.setObject(25,util.getPGObject(billDetail.getAdditionalDetails()));
			}

			@Override
			public int getBatchSize() {
				return billDetails.size();
			}
		});

		saveBillAccountDetail(billAccountDetails, auditDetails);
	}

	public void saveBillAccountDetail(List<BillAccountDetailV2> billAccountDetails, AuditDetails auditDetails) {

		jdbcTemplate.batchUpdate(BillQueryBuilder.INSERT_BILLACCOUNTDETAILS_QUERY, new BatchPreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement ps, int index) throws SQLException {
				BillAccountDetailV2 billAccountDetail = billAccountDetails.get(index);

				ps.setString(1, billAccountDetail.getId());
				ps.setString(2, billAccountDetail.getTenantId());
				ps.setString(3, billAccountDetail.getBillDetailId());
				ps.setString(4, billAccountDetail.getDemandDetailId());
				ps.setObject(5, billAccountDetail.getOrder());
				ps.setBigDecimal(6, billAccountDetail.getAmount());
				ps.setObject(7, billAccountDetail.getAdjustedAmount());
				ps.setObject(8, null);
				ps.setString(9, null);
				ps.setString(10, auditDetails.getCreatedBy());
				ps.setLong(11, auditDetails.getCreatedTime());
				ps.setString(12, auditDetails.getLastModifiedBy());
				ps.setLong(13, auditDetails.getLastModifiedTime());
				ps.setString(14, billAccountDetail.getTaxHeadCode());
			}

			@Override
			public int getBatchSize() {
				return billAccountDetails.size();
			}
		});
	}

	/**
	 * executes query to update bill status to expired 
	 * @param billIds
	 */
	public Integer updateBillStatus(UpdateBillCriteria updateBillCriteria) {

		Set<String> consumerCodes = updateBillCriteria.getConsumerCodes();
		if(CollectionUtils.isEmpty(consumerCodes))
			return 0;
		
		List<BillV2> bills =  findBill(BillSearchCriteria.builder()
				.service(updateBillCriteria.getBusinessService())
				.tenantId(updateBillCriteria.getTenantId())
				.consumerCode(consumerCodes)
				.build());
		
		if (CollectionUtils.isEmpty(bills))
			return 0;

		BillStatus status = bills.get(0).getStatus();
		if (!status.equals(BillStatus.ACTIVE)) {
			if (status.equals(BillStatus.PAID) || status.equals(BillStatus.PARTIALLY_PAID))
				return -1;
			else
				return 0;
		}

		if (BillStatus.CANCELLED.equals(updateBillCriteria.getStatusToBeUpdated())) {

			updateBillCriteria.setBillIds(Stream.of(bills.get(0).getId()).collect(Collectors.toSet()));
			updateBillCriteria.setAdditionalDetails(
					util.jsonMerge(updateBillCriteria.getAdditionalDetails(), bills.get(0).getAdditionalDetails()));

		} else {

			updateBillCriteria.setBillIds(bills.stream().map(BillV2::getId).collect(Collectors.toSet()));
		}
		
		List<Object> preparedStmtList = new ArrayList<>();
		String queryStr = billQueryBuilder.getBillStatusUpdateQuery(updateBillCriteria, preparedStmtList);
		return jdbcTemplate.update(queryStr, preparedStmtList.toArray());
	}
	
}
