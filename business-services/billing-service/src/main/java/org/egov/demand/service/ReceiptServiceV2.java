package org.egov.demand.service;

import static org.egov.demand.util.Constants.ADVANCE_TAXHEAD_JSONPATH_CODE;
import static org.egov.demand.util.Constants.MDMS_CODE_FILTER;
import static org.egov.demand.util.Constants.MODULE_NAME;
import static org.egov.demand.util.Constants.TAXHEAD_MASTERNAME;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.BillAccountDetailV2;
import org.egov.demand.model.BillDetailV2;
import org.egov.demand.model.BillV2;
import org.egov.demand.model.Demand;
import org.egov.demand.model.DemandCriteria;
import org.egov.demand.model.DemandDetail;
import org.egov.demand.model.PaymentBackUpdateAudit;
import org.egov.demand.util.Constants;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.BillRequestV2;
import org.egov.demand.web.contract.DemandRequest;
import org.egov.demand.web.validator.DemandValidatorV1;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.jayway.jsonpath.DocumentContext;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ReceiptServiceV2 {

	@Autowired
	private DemandService demandService;
	
	@Autowired
	DemandValidatorV1 demandValidatorV1;
	
	@Autowired
	private Util util;


	public void updateDemandFromReceipt(BillRequestV2 billReq, Boolean isReceiptCancellation) {

		if (billReq == null || billReq != null && CollectionUtils.isEmpty(billReq.getBills())) {

			log.info(" no data found in payment for update : {} " + billReq);
			return;
		}

		Set<String> demandIds = new HashSet<>();
		billReq.getBills().forEach(bill -> {

			bill.getBillDetails().forEach(billDetail -> {
				demandIds.add(billDetail.getDemandId());
			});
		});


		updateDemandFromBill(billReq,demandIds, isReceiptCancellation);
	}

	/**
	 * Update the demand collection details based on the bill
	 * 
	 * @param billRequest
	 * @param demandIds
	 * @param isReceiptCancellation
	 * @return
	 */
	public void updateDemandFromBill(BillRequestV2 billRequest,Set<String> demandIds, Boolean isReceiptCancellation) {

		List<BillV2> bills = billRequest.getBills();
		String tenantId = bills.get(0).getTenantId();
		RequestInfo requestInfo = billRequest.getRequestInfo();
		Map<String, String> mapOfBillIdAndStatus = new HashMap<>();

		DemandCriteria demandCriteria = DemandCriteria.builder().demandId(demandIds).tenantId(tenantId).build();
		List<Demand> demandsToBeUpdated = demandService.getDemands(demandCriteria, requestInfo);
		Map<String, Demand> demandIdMap = demandsToBeUpdated.stream().collect(Collectors.toMap(Demand::getId, Function.identity()));
		DocumentContext mdmsData = getTaxHeadMaster(tenantId,billRequest.getRequestInfo());

		for (BillV2 bill : bills) {
			String advanceTaxhead = getAdvanceTaxhead(bill.getBusinessService(), mdmsData);
			mapOfBillIdAndStatus.put(bill.getId(), bill.getStatus().toString());
			for (BillDetailV2 billDetail : bill.getBillDetails())
				updateDemandFromBillDetail(billDetail, demandIdMap.get(billDetail.getDemandId()), isReceiptCancellation,advanceTaxhead);
		}

		String paymentId = util.getValueFromAdditionalDetailsForKey(bills.get(0).getAdditionalDetails(),
				Constants.PAYMENT_ID_KEY);

		PaymentBackUpdateAudit paymentBackUpdateAudit = PaymentBackUpdateAudit.builder()
				.isReceiptCancellation(isReceiptCancellation)
				.isBackUpdateSucces(true)
				.paymentId(paymentId)
				.tenantId(tenantId)
				.build();
		
		DemandRequest demandRequest = DemandRequest.builder()
				.requestInfo(billRequest.getRequestInfo())
				.demands(demandsToBeUpdated)
				.build();
		
		demandService.updateAsync(demandRequest, paymentBackUpdateAudit);

	}

	/**
	 * Updates the collection amount in the incoming demand object based on the billDetail object
	 * 
	 * @param billDetail
	 */
	private void updateDemandFromBillDetail(BillDetailV2 billDetail, Demand demand, Boolean isRecieptCancellation, String advanceTaxHead) {

		if(billDetail.getAmount().compareTo(BigDecimal.ZERO) != 0 
				&& billDetail.getAmountPaid().compareTo(BigDecimal.ZERO) == 0)
			return; 
		
		Map<String, List<DemandDetail>> taxHeadCodeDemandDetailgroup = demand.getDemandDetails().stream()
				.collect(Collectors.groupingBy(DemandDetail::getTaxHeadMasterCode));

		for (BillAccountDetailV2 billAccDetail : billDetail.getBillAccountDetails()) {

			/* Ignoring billaccount details with no taxhead codes
			 * to avoid saving collection only information
			 */ 
			if(null == billAccDetail.getTaxHeadCode()) return;
			
			List<DemandDetail> currentDetails = taxHeadCodeDemandDetailgroup.get(billAccDetail.getTaxHeadCode());
					
			int length = 0;
			
			if (!CollectionUtils.isEmpty(currentDetails)) {
				length = currentDetails.size();
				Collections.sort(currentDetails, Comparator.comparing(DemandDetail::getTaxAmount));
			}
			
			/* 
			 * if single demand detail corresponds to single billAccountDetail then update directly
			 */
			if (length == 1) {

				updateSingleDemandDetail(currentDetails.get(0), billAccDetail, isRecieptCancellation, advanceTaxHead);
			}
			/*
			 * if multiple demandDetails point to one BillAccountDetial
			 */
			else if (length > 1) {

				updateMultipleDemandDetails(currentDetails, billAccDetail, isRecieptCancellation);
			} else {

				/*
				 * if no demand detail found for the corresponding billAccountDetail 
				 * then add the new DemandDetail in the demand
				 */
				DemandDetail newAdvanceDetail = DemandDetail.builder()
						.taxHeadMasterCode(billAccDetail.getTaxHeadCode())
						.taxAmount(billAccDetail.getAmount())
						.collectionAmount(BigDecimal.ZERO)
						.tenantId(demand.getTenantId())
						.demandId(demand.getId())
						.build();
				
				demand.getDemandDetails().add(newAdvanceDetail);
			}
		}
	}

	
	/**
	 * Method to handle update if single demandDetail is presnt for a BillAccountDetail
	 * 
	 * @param currentDetail         the demand detail object to be updated
	 * 
	 * @param billAccDetail         bill account detail object from which values
	 *                              needs to fetched
	 *                              
	 * @param isRecieptCancellation if the call is made for payment or cancellation
	 */
	private void updateSingleDemandDetail(DemandDetail currentDetail, BillAccountDetailV2 billAccDetail,
			Boolean isRecieptCancellation, String advanceTaxHead) {
		
		BigDecimal oldCollectedAmount = currentDetail.getCollectionAmount();
		BigDecimal newAmount = billAccDetail.getAdjustedAmount();

		if(advanceTaxHead!=null && billAccDetail.getTaxHeadCode().equalsIgnoreCase(advanceTaxHead))
			currentDetail.setTaxAmount(billAccDetail.getAmount().add(oldCollectedAmount));

		if (isRecieptCancellation)
			currentDetail.setCollectionAmount(oldCollectedAmount.subtract(newAmount));
		else
			currentDetail.setCollectionAmount(oldCollectedAmount.add(newAmount));
	}
	
	
	/**
	 * Method to handle update if multiple demand details are present for a single Bill account detail
	 * 
	 * @param demandDetails List of demand details to updated
	 * @param billAccDetail the bill account detail with the paid-amount/Adjusted amount
	 * @param isRecieptCancellation to identify if the method call is for payment or cancellation
	 */
	private void updateMultipleDemandDetails(List<DemandDetail> demandDetails, BillAccountDetailV2 billAccDetail,
			Boolean isRecieptCancellation) {

		BigDecimal amtPaid = billAccDetail.getAdjustedAmount();

		if (!isRecieptCancellation)
			updateDetailsForPayment(demandDetails, amtPaid);
		else
			updateDetailsForCancellation(demandDetails, amtPaid);

	}

	/**
	 * Method to handle receipt cancellation in case of  multiple Demand detail present for a single billAccountDetail
	 * 
	 * The incoming list of demand details are sorted in Ascending to aid adjusting negative values first
	 * 
	 * @param demandDetails        List of details to be updated
	 * 
	 * @param amtPaid Adjusted amount from bill Acc detail
	 */
	private void updateDetailsForCancellation(List<DemandDetail> demandDetails, BigDecimal amtPaid) {
		
		if (amtPaid.compareTo(BigDecimal.ZERO) == 0)
			return;

		for (DemandDetail detail : demandDetails) {

			if(detail.getTaxAmount().compareTo(BigDecimal.ZERO) == 0)
				continue;
			/*
			 * amount to be set in collectionAmount field of demandDetail after adjustments
			 */
			BigDecimal resultantCollectionAmt;

			BigDecimal currentDetailCollectionAmt = detail.getCollectionAmount();
			Boolean isTaxPositive = detail.getTaxAmount().compareTo(BigDecimal.ZERO) > 0;

			if (isTaxPositive && currentDetailCollectionAmt.compareTo(amtPaid) >= 0) {

				resultantCollectionAmt = currentDetailCollectionAmt.subtract(amtPaid);
				amtPaid = BigDecimal.ZERO;
			} else {

				resultantCollectionAmt = BigDecimal.ZERO;
				amtPaid = amtPaid.subtract(currentDetailCollectionAmt);
			}

			detail.setCollectionAmount(resultantCollectionAmt);
		}
	}

	/**
	 * Method to handle payment in case of multiple Demand details present for a
	 * single billAccountDetail
	 * 
	 * The incoming list of demand details are sorted in Ascending to aid adjusting negative values first
	 * 
	 * @param demandDetails    List of details to be updated
	 * 
	 * @param amountPaid       Adjusted amount from bill Acc detail
	 */
	private void updateDetailsForPayment(List<DemandDetail> demandDetails, BigDecimal amountPaid) {

		for (DemandDetail detail : demandDetails) {

			if(detail.getTaxAmount().compareTo(detail.getCollectionAmount()) == 0 || detail.getTaxAmount().compareTo(BigDecimal.ZERO) == 0)
				continue;
			/*
			 * amount to be set in collectionAmount field of demandDetail after adjustments
			 */
			BigDecimal resultantCollectionAmt;

			BigDecimal currentDetailTax = detail.getTaxAmount();
			BigDecimal currentDetailCollection = detail.getCollectionAmount();

			BigDecimal currentDetailTaxCollectionDifference = currentDetailTax.subtract(currentDetailCollection);
			Boolean isTaxPositive = detail.getTaxAmount().compareTo(BigDecimal.ZERO) > 0;
			/*
			 * if current demandDetail  i sPositive AND difference is lesser than incoming amount of
			 * 
			 * BillAccountDetail, then add the whole value to result
			 * 
			 * In case of negative value the exact tax will be adjusted.
			 */
			if (isTaxPositive && currentDetailTaxCollectionDifference.compareTo(amountPaid) >= 0) {

				resultantCollectionAmt = currentDetailCollection.add(amountPaid);
				amountPaid = BigDecimal.ZERO;
			} else {
				/*
				 * if difference of demandDetail is lesser than Incoming amount, then add the
				 * 
				 * difference to resulantAmount and subtract the same from incoming amount
				 */
				resultantCollectionAmt = currentDetailCollection.add(currentDetailTaxCollectionDifference);
				amountPaid = amountPaid.subtract(currentDetailTaxCollectionDifference);
			}

			detail.setCollectionAmount(resultantCollectionAmt);
		}
	}


	/**
	 * Fetches the required master data from MDMS service
	 * @return
	 */
	private DocumentContext getTaxHeadMaster(String tenantId, RequestInfo requestInfo){
		/*
		 * Preparing the mdms request with billing service master and calling the mdms search API
		 */
		MdmsCriteriaReq mdmsReq = util.prepareMdMsRequest(tenantId, MODULE_NAME, Collections.singletonList(TAXHEAD_MASTERNAME), MDMS_CODE_FILTER,
				requestInfo);
		DocumentContext mdmsData = util.getAttributeValues(mdmsReq);

		return mdmsData;
	}


	private String getAdvanceTaxhead(String businessService, DocumentContext mdmsData){
		// Create the jsonPath to fetch the advance taxhead for the given businessService
		String jsonpath = ADVANCE_TAXHEAD_JSONPATH_CODE;
		jsonpath = jsonpath.replace("{}",businessService);

		List<String> taxHeads = mdmsData.read(jsonpath);

		if(CollectionUtils.isEmpty(taxHeads))
			return null;

		String advanceTaxHeadCode =  taxHeads.get(0);

		return advanceTaxHeadCode;
	}

}
