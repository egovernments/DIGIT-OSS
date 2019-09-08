package org.egov.pt.calculator.service;

import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;

import org.egov.pt.calculator.repository.Repository;
import org.egov.pt.calculator.util.CalculatorConstants;
import org.egov.pt.calculator.util.CalculatorUtils;
import org.egov.pt.calculator.web.models.collections.Receipt;
import org.egov.pt.calculator.web.models.collections.ReceiptRes;
import org.egov.pt.calculator.web.models.demand.BillDetail;
import org.egov.pt.calculator.web.models.demand.Demand;
import org.egov.pt.calculator.web.models.property.RequestInfoWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ReceiptService {

	@Autowired
	private Repository repository;
	
	@Autowired
	private CalculatorUtils utils;
	
	@Autowired
	private ObjectMapper mapper;
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	private static final String CONSUMERCODEQUERYFORCURRENTFINANCIALYEAR = "SELECT CONCAT(propertyid,':',assessmentnumber) "
			+ "FROM eg_pt_assessment where assessmentyear=? AND propertyId=?";


	/**
	 * Gets all receipts corresponding to the given demand
	 * @param assessmentYear
	 * @param demand
	 * @param requestInfoWrapper
	 * @return
	 */
	public List<Receipt> getReceiptsFromConsumerCode(String assessmentYear, Demand demand, RequestInfoWrapper requestInfoWrapper) {
		return getReceiptsFromPropertyAndFY(assessmentYear, demand.getTenantId(), demand.getConsumerCode().split(":")[0], requestInfoWrapper);
	}

	/**
	 * Gets all receipts corresponding to the given property and financial year
	 * @param assessmentYear
	 * @param tenantid
	 * @param propertyId
	 * @param requestInfoWrapper
	 * @return
	 */
	public List<Receipt> getReceiptsFromPropertyAndFY(String assessmentYear, String tenantid, String propertyId, RequestInfoWrapper requestInfoWrapper) {
		List<String> consumercodes =  getCosumerCodesForDemandFromCurrentFinancialYear (assessmentYear, propertyId);
		List<Receipt> receipts = new LinkedList<>();
		if(!CollectionUtils.isEmpty(consumercodes))
			receipts = getReceipts(tenantid, consumercodes, requestInfoWrapper);
		if(!CollectionUtils.isEmpty(receipts))
			receipts.sort(Comparator.comparing(receipt -> receipt.getBill().get(0).getBillDetails().get(0).getReceiptDate()));
		return receipts;
	}



	/**
	 * searches the latest collected date of the particular demand 
	 * 
	 * @param demand
	 * @param requestInfoWrapper
	 * @return latestCollectedTime
	 */
/*	public Long getInterestLatestCollectedTime(String assessmentYear, Demand demand, RequestInfoWrapper requestInfoWrapper) {

		List<String> consumercodes =  getCosumerCodesForDemandFromCurrentFinancialYear (assessmentYear, demand.getConsumerCode().split(":")[0]);
		List<Receipt> receipts = getReceipts(demand.getTenantId(), consumercodes, requestInfoWrapper);
		long latestCollectedDate = 0l;

		if (CollectionUtils.isEmpty(receipts)) return latestCollectedDate;

		for (Receipt receipt : receipts) {
			
			BillDetail detail = receipt.getBill().get(0).getBillDetails().get(0);
			if (CalculatorConstants.ALLOWED_RECEIPT_STATUS.contains(detail.getStatus())
					&& detail.getReceiptDate().compareTo(latestCollectedDate) > 0)
				latestCollectedDate = detail.getReceiptDate();
		}
		return latestCollectedDate;
	}*/

	private List<String> getCosumerCodesForDemandFromCurrentFinancialYear(String assessmentYear, String propertyId) {

		String[] pstmtList = new String[] { assessmentYear, propertyId };
		return jdbcTemplate.queryForList(CONSUMERCODEQUERYFORCURRENTFINANCIALYEAR, pstmtList, String.class);
	}

	/**
	 * private method to search receipts
	 * @param demand
	 * @param requestInfoWrapper
	 */
	private List<Receipt> 	getReceipts(String tenantId,List<String> consumerCodes, RequestInfoWrapper requestInfoWrapper) {

		StringBuilder url = utils.getReceiptSearchUrl(tenantId, consumerCodes);
		return mapper.convertValue(repository.fetchResult(url, requestInfoWrapper), ReceiptRes.class).getReceipts();
	}
}
