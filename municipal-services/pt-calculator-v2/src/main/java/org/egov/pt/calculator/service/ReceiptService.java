/*
package org.egov.pt.calculator.service;

import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;

import org.egov.pt.calculator.repository.Repository;
import org.egov.pt.calculator.util.CalculatorConstants;
import org.egov.pt.calculator.util.CalculatorUtils;
import org.egov.pt.calculator.web.models.ReceiptSearchCriteria;
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


	*/
/**
	 * Gets all receipts corresponding to the given demand
	 * @param assessmentYear
	 * @param demand
	 * @param requestInfoWrapper
	 * @return
	 *//*

	public List<Receipt> getReceiptsFromDemand(Demand demand, RequestInfoWrapper requestInfoWrapper) {
        ReceiptSearchCriteria criteria = new ReceiptSearchCriteria();
        criteria.setTenantId(demand.getTenantId());
        criteria.setPropertyId(demand.getConsumerCode());
        criteria.setFromDate(demand.getTaxPeriodFrom());
        criteria.setToDate(demand.getTaxPeriodTo());
		return getReceiptsFromPropertyAndFY(criteria, requestInfoWrapper);
	}

	*/
/**
	 * Gets all receipts corresponding to the given property and financial year
	 * @param tenantid
	 * @param propertyId
	 * @param requestInfoWrapper
	 * @return
	 *//*

	public List<Receipt> getReceiptsFromPropertyAndFY( ReceiptSearchCriteria receiptSearchCriteria,  RequestInfoWrapper requestInfoWrapper) {
//		List<String> consumercodes =  getCosumerCodesForDemandFromCurrentFinancialYear (assessmentYear, propertyId);
		List<Receipt> receipts = new LinkedList<>();
		receipts = getReceipts(receiptSearchCriteria, requestInfoWrapper);
		if(!CollectionUtils.isEmpty(receipts))
			receipts.sort(Comparator.comparing(receipt -> receipt.getBill().get(0).getBillDetails().get(0).getReceiptDate()));
		return receipts;
	}



    */
/**
     * Fetches the receipts for the given params
     * @param receiptSearchCriteria
     * @param requestInfoWrapper
     * @return
     *//*

	private List<Receipt> 	getReceipts(ReceiptSearchCriteria receiptSearchCriteria, RequestInfoWrapper requestInfoWrapper) {

		StringBuilder url = utils.getReceiptSearchUrl(receiptSearchCriteria);
		return mapper.convertValue(repository.fetchResult(url, requestInfoWrapper), ReceiptRes.class).getReceipts();
	}
}
*/
