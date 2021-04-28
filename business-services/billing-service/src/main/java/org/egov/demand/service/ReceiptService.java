package org.egov.demand.service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.Bill;
import org.egov.demand.model.BillAccountDetail;
import org.egov.demand.model.BillDetail;
import org.egov.demand.model.BillDetail.StatusEnum;
import org.egov.demand.model.Demand;
import org.egov.demand.model.DemandCriteria;
import org.egov.demand.model.DemandDetail;
import org.egov.demand.web.contract.BillRequest;
import org.egov.demand.web.contract.DemandRequest;
import org.egov.demand.web.contract.ReceiptRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ReceiptService {

	@Autowired
	private DemandService demandService;
	

	public void updateDemandFromReceipt(ReceiptRequest receiptRequest, StatusEnum status, Boolean isReceiptCancellation) {

		if (null != receiptRequest && CollectionUtils.isEmpty(receiptRequest.getReceipt())
				|| Objects.isNull(receiptRequest)
				|| CollectionUtils.isEmpty(receiptRequest.getReceipt().get(0).getBill())) {

			log.info(" no data found in receipt for update : {} " + receiptRequest);
			return;
		}

		List<Bill> bills = receiptRequest.getReceipt().get(0).getBill();
		
		Set<String> demandIds = new HashSet<>();
		bills.forEach(bill -> bill.getBillDetails().forEach(billDetail -> {
			demandIds.add(billDetail.getDemandId());
			billDetail.setStatus(status);
		}));

		BillRequest billRequest = BillRequest.builder().requestInfo(receiptRequest.getRequestInfo()).bills(bills)
				.build();
		updateDemandFromBill(billRequest,demandIds, isReceiptCancellation);
	}

	/**
	 * Update the demand collection details based on the bill
	 * 
	 * @param billRequest
	 * @param demandIds
	 * @param isReceiptCancellation
	 * @return
	 */
	public void updateDemandFromBill(BillRequest billRequest,Set<String> demandIds, Boolean isReceiptCancellation) {

		List<Bill> bills = billRequest.getBills();
		String tenantId = bills.get(0).getTenantId();
		RequestInfo requestInfo = billRequest.getRequestInfo();

		DemandCriteria demandCriteria = DemandCriteria.builder().demandId(demandIds).tenantId(tenantId).build();
		List<Demand> demandsToBeUpdated = demandService.getDemands(demandCriteria, requestInfo);
		Map<String, Demand> demandIdMap = demandsToBeUpdated.stream()
				.collect(Collectors.toMap(Demand::getId, Function.identity()));
		
		for(Bill bill : bills) {
			
			for (BillDetail billDetail : bill.getBillDetails())
				updateDemandFromBillDetail(billDetail, demandIdMap.get(billDetail.getDemandId()), isReceiptCancellation);
			
		}
		
		demandService.updateAsync(DemandRequest.builder().demands(demandsToBeUpdated).requestInfo(billRequest.getRequestInfo()).build(), null);
	}

	/**
	 * Updates the collection amount in the incoming demand object based on the billDetail object
	 * 
	 * @param demandIdMap
	 * @param billDetail
	 */
	private void updateDemandFromBillDetail(BillDetail billDetail, Demand demand, Boolean isRecieptCancellation) {

		Map<String, List<DemandDetail>> taxHeadCodeDemandDetailgroup = demand.getDemandDetails().stream()
				.collect(Collectors.groupingBy(DemandDetail::getTaxHeadMasterCode));

		for (BillAccountDetail billAccDetail : billDetail.getBillAccountDetails()) {

			/* Ignoring billaccount details with no taxhead codes
			 * to avoid saving collection only information
			 */ 
			if(null == billAccDetail.getTaxHeadCode()) return;
			
			List<DemandDetail> currentDetails = taxHeadCodeDemandDetailgroup.get(billAccDetail.getTaxHeadCode());
			Collections.sort(currentDetails, Comparator.comparing(DemandDetail::getTaxAmount));
					
			int length = 0;
			
			if (!CollectionUtils.isEmpty(currentDetails))
				length = currentDetails.size();
			
			/* 
			 * if single demand detail corresponds to single billAccountDetail then update directly
			 */
			if (length == 1) {

				updateSingleDemandDetail(currentDetails.get(0), billAccDetail, isRecieptCancellation);
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
	private void updateSingleDemandDetail(DemandDetail currentDetail, BillAccountDetail billAccDetail,
			Boolean isRecieptCancellation) {
		
		BigDecimal oldCollectedAmount = currentDetail.getCollectionAmount();
		BigDecimal newAmount = billAccDetail.getAdjustedAmount();

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
	private void updateMultipleDemandDetails(List<DemandDetail> demandDetails, BillAccountDetail billAccDetail,
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
	 * @param demandDetails        List of details to be updated
	 * 
	 * @param amtPaid Adjusted amount from bill Acc detail
	 */
	private void updateDetailsForCancellation(List<DemandDetail> demandDetails, BigDecimal amtPaid) {

		for (DemandDetail detail : demandDetails) {

			if (amtPaid.compareTo(BigDecimal.ZERO) == 0)
				return;

			/*
			 * amount to be set in collectionAmount field of demandDetail after adjustments
			 */
			BigDecimal resultantCollectionAmt;

			BigDecimal currentDetailCollectionAmt = detail.getCollectionAmount();

			if (currentDetailCollectionAmt.compareTo(amtPaid) >= 0) {

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
	 * @param demandDetails    List of details to be updated
	 * 
	 * @param amountPaid       Adjusted amount from bill Acc detail
	 */
	private void updateDetailsForPayment(List<DemandDetail> demandDetails, BigDecimal amountPaid) {

		for (DemandDetail detail : demandDetails) {
			
			if (amountPaid.compareTo(BigDecimal.ZERO) == 0)
				return;

			if(detail.getTaxAmount().compareTo(detail.getCollectionAmount()) == 0 || detail.getTaxAmount().compareTo(BigDecimal.ZERO) == 0)
				continue;
			/*
			 * amount to be set in collectionAmount field of demandDetail after adjustments
			 */
			BigDecimal resultantCollectionAmt;

			BigDecimal currentDetailTax = detail.getTaxAmount();
			BigDecimal currentDetailCollection = detail.getCollectionAmount();

			BigDecimal currentDetailTaxCollectionDifference = currentDetailTax.subtract(currentDetailCollection);

			/*
			 * if current demandDetail difference is lesser than incoming amount of
			 * 
			 * BillAccountDetail, then add the whole value to result
			 */
			if (currentDetailTaxCollectionDifference.compareTo(amountPaid) >= 0) {

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

}
