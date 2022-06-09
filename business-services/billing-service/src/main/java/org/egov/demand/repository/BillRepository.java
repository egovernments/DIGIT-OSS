package org.egov.demand.repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.AuditDetails;
import org.egov.demand.model.Bill;
import org.egov.demand.model.BillAccountDetail;
import org.egov.demand.model.BillDetail;
import org.egov.demand.model.BillSearchCriteria;
import org.egov.demand.model.BillV2.BillStatus;
import org.egov.demand.model.BusinessServiceDetail;
import org.egov.demand.repository.querybuilder.BillQueryBuilder;
import org.egov.demand.repository.rowmapper.BillRowMapper;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.BillRequest;
import org.egov.demand.web.contract.BillResponse;
import org.egov.demand.web.contract.BusinessServiceDetailCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class BillRepository {

	@Autowired
	private BillQueryBuilder billQueryBuilder;
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Autowired
	private Util util;
	
	@Autowired
	private BillRowMapper searchBillRowMapper;
	
	@Autowired
	private BusinessServiceDetailRepository businessServiceDetailRepository;
	
	public List<Bill> findBill(BillSearchCriteria billCriteria){
		
		List<Object> preparedStatementValues = new ArrayList<>();
		String queryStr = billQueryBuilder.getBillQuery(billCriteria, preparedStatementValues);
		log.debug("query:::"+queryStr+"  preparedStatementValues::"+preparedStatementValues);
		
		return jdbcTemplate.query(queryStr, preparedStatementValues.toArray(), searchBillRowMapper);
	}
	
	@Transactional
	public void saveBill(BillRequest billRequest){
		
		RequestInfo requestInfo = billRequest.getRequestInfo();
		List<Bill> bills = billRequest.getBills();
		
		log.debug("saveBill requestInfo:"+requestInfo);
		log.debug("saveBill bills:"+bills);
		jdbcTemplate.batchUpdate(BillQueryBuilder.INSERT_BILL_QUERY, new BatchPreparedStatementSetter() {
			
			@Override
			public void setValues(PreparedStatement ps, int index) throws SQLException {
				Bill bill = bills.get(index);

				BillStatus status = BillStatus.ACTIVE;
				if(!ObjectUtils.isEmpty(bill.getIsCancelled()) &&  bill.getIsCancelled() == true)
					status = BillStatus.CANCELLED;
				
				AuditDetails auditDetails = bill.getAuditDetails();
				
				ps.setString(1, bill.getId());
				ps.setString(2, bill.getTenantId());
				ps.setString(3, bill.getPayerName());
				ps.setString(4, bill.getPayerAddress());
				ps.setString(5, bill.getPayerEmail());
				ps.setObject(6, bill.getIsActive());
				ps.setObject(7, bill.getIsCancelled());
				ps.setString(8, auditDetails.getCreatedBy());
				ps.setLong(9, auditDetails.getCreatedTime());
				ps.setString(10, auditDetails.getLastModifiedBy());
				ps.setLong(11, auditDetails.getLastModifiedTime());
				ps.setString(12, bill.getMobileNumber());
				ps.setString(13, status.toString());
				ps.setObject(14, util.getPGObject(bill.getAdditionalDetails()));
			}
			
			@Override
			public int getBatchSize() {
				return bills.size();
			}
		});
		saveBillDetails(billRequest);
	}
	
	public void saveBillDetails(BillRequest billRequest){
		
		List<Bill> bills = billRequest.getBills();
		List<BillDetail> billDetails = new ArrayList<>();
		List<BillAccountDetail> billAccountDetails = new ArrayList<>();
		AuditDetails auditDetails = bills.get(0).getAuditDetails();
		
		for(Bill bill:bills){
			List<BillDetail> tempBillDetails  = bill.getBillDetails();
			billDetails.addAll(tempBillDetails);
			
			for(BillDetail billDetail : tempBillDetails){
				billAccountDetails.addAll(billDetail.getBillAccountDetails());
			}
		}
		log.debug("saveBillDeails tempBillDetails:"+billDetails);
		jdbcTemplate.batchUpdate(BillQueryBuilder.INSERT_BILLDETAILS_QUERY, new BatchPreparedStatementSetter() {
				
			
			@Override
			public void setValues(PreparedStatement ps, int index) throws SQLException {
				BillDetail billDetail = billDetails.get(index);

				ps.setString(1, billDetail.getId());
				ps.setString(2, billDetail.getTenantId());
				ps.setString(3, billDetail.getBill());
				ps.setString(4, billDetail.getDemandId());
				ps.setLong(5, billDetail.getFromPeriod());
				ps.setLong(6, billDetail.getToPeriod());
				ps.setString(7, billDetail.getBusinessService());
				ps.setString(8, billDetail.getBillNumber());
				ps.setLong(9, billDetail.getBillDate());
				ps.setString(10, billDetail.getConsumerCode());
				ps.setString(11, billDetail.getConsumerType());
				ps.setString(12, null);
				ps.setString(13, null);
				ps.setObject(14, billDetail.getMinimumAmount());
				ps.setObject(15, billDetail.getTotalAmount());
				// apportioning logic does not reside in billing service anymore 
				ps.setBoolean(16, false);
				ps.setObject(17, billDetail.getPartPaymentAllowed());
				
				String collectionModesNotAllowed = null != billDetail.getCollectionModesNotAllowed()
						? StringUtils.join(billDetail.getCollectionModesNotAllowed(), ",")
						: null;
				ps.setString(18, collectionModesNotAllowed);
				
				ps.setString(19, auditDetails.getCreatedBy());
				ps.setLong(20, auditDetails.getCreatedTime());
				ps.setString(21, auditDetails.getLastModifiedBy());
				ps.setLong(22, auditDetails.getLastModifiedTime());
				ps.setBoolean(23, billDetail.getIsAdvanceAllowed());
				ps.setLong(24, billDetail.getExpiryDate());
				
			}
				
			@Override
			public int getBatchSize() {
				return billDetails.size();
			}
		});
		saveBillAccountDetail(billAccountDetails, auditDetails);
	}
	
	public void saveBillAccountDetail(List<BillAccountDetail> billAccountDetails, AuditDetails auditDetails){
		log.debug("saveBillAccountDetail billAccountDetails:"+billAccountDetails);

		jdbcTemplate.batchUpdate(BillQueryBuilder.INSERT_BILLACCOUNTDETAILS_QUERY, new BatchPreparedStatementSetter() {
				
			@Override
			public void setValues(PreparedStatement ps, int index) throws SQLException {
				BillAccountDetail billAccountDetail = billAccountDetails.get(index);
				
				ps.setString(1, billAccountDetail.getId());
				ps.setString(2, billAccountDetail.getTenantId());
				ps.setString(3, billAccountDetail.getBillDetail());
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

	@Deprecated
	public List<Bill> apportion(BillRequest billRequest) {

		RequestInfo requestInfo = billRequest.getRequestInfo();
		List<Bill> inputBills = billRequest.getBills();
		List<Bill> reqBills = null;
		BillRequest inputBillrequest = new BillRequest();
		Map<String, BillDetail> responseBillDetailsMap = new HashMap<>();
		inputBillrequest.setRequestInfo(requestInfo);

		BusinessServiceDetailCriteria businessCriteria = BusinessServiceDetailCriteria.builder()
				.tenantId(inputBills.get(0).getTenantId()).build();
		
		Map<String, BusinessServiceDetail> businessServicesMap = businessServiceDetailRepository
				.getBussinessServiceDetail(requestInfo, businessCriteria).stream()
				.filter(BusinessServiceDetail::getCallBackForApportioning)
				.collect(Collectors.toMap(BusinessServiceDetail::getBusinessService, Function.identity()));

		for (String businessService : businessServicesMap.keySet()) {

			String url = businessServicesMap.get(businessService).getCallBackApportionURL();
			reqBills = new ArrayList<>();
			for (Bill bill : inputBills) {

				Bill reqBill = bill;
				List<BillDetail> reqbillDetails = new ArrayList<>();
				for (BillDetail billDetail : reqBill.getBillDetails())
					if (billDetail.getBusinessService().equalsIgnoreCase(businessService))
						reqbillDetails.add(billDetail);
				reqBill.setBillDetails(reqbillDetails);
				reqBills.add(reqBill);
			}
			inputBillrequest.setBills(reqBills);
			List<Bill> responseBills = restTemplate.postForObject("http://pt-calculator-v2:8080"+url, billRequest, BillResponse.class).getBill();
			for (Bill bill : responseBills) {
				for (BillDetail detail : bill.getBillDetails())
					responseBillDetailsMap.put(detail.getId(), detail);
			}
		}
		return getApportionedBillList(inputBills, responseBillDetailsMap);
	}

	private List<Bill> getApportionedBillList(List<Bill> inputBills, Map<String, BillDetail> responseBillDetailsMap) {

		for (Bill bill : inputBills) {
			List<BillDetail> billDetails = new ArrayList<>();
			for (BillDetail detail : bill.getBillDetails()) {

				String id = detail.getId();
				if (id != null)
					billDetails.add(responseBillDetailsMap.get(id));
				else
					billDetails.add(detail);
			}
			bill.setBillDetails(billDetails);
		}
		return inputBills;
	}
}
