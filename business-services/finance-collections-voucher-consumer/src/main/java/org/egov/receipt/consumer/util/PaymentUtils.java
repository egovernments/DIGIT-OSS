/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) <2015>  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any Long of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.receipt.consumer.util;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.egov.receipt.consumer.model.BankContract;
import org.egov.receipt.consumer.model.BankDetails;
import org.egov.receipt.consumer.model.Bill;
import org.egov.receipt.consumer.model.BillAccountDetail;
import org.egov.receipt.consumer.model.BillDetail;
import org.egov.receipt.consumer.model.Instrument;
import org.egov.receipt.consumer.model.InstrumentType;
import org.egov.receipt.consumer.model.Receipt;
import org.egov.receipt.consumer.model.TransactionType;
import org.egov.receipt.consumer.repository.ServiceRequestRepository;
import org.egov.receipt.consumer.v2.model.BillDetailV2;
import org.egov.receipt.consumer.v2.model.BillV2;
import org.egov.receipt.consumer.v2.model.Payment;
import org.egov.receipt.consumer.v2.model.PaymentDetail;
import org.egov.receipt.consumer.v2.model.PaymentModeEnum;
import org.egov.receipt.custom.exception.VoucherCustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class PaymentUtils {
	
	private static final String HTTPS_IFSC_RAZORPAY_URL = "https://ifsc.razorpay.com/";

	@Autowired
    private ServiceRequestRepository serviceRequestRepository;
	
	@Autowired
	private ObjectMapper mapper;
    /**
     * 
     * @param payments
     * @param receipts
     * @throws VoucherCustomException
     * Method which is used to transform the Payment payload to Receipt payload for collection version-2
     */
    public void getReceiptsFromPayments(List<Payment> payments, List<Receipt> receipts) throws VoucherCustomException {
        // prepare instrument from payment
        // prepare receipt from each paymentdetails
    	for(Payment payment:payments){
    		Instrument instrument = new Instrument();
    		this.prepareInstrument(payment, instrument);
    		payment.getPaymentDetails().stream().forEach(paymentDetail -> {
    			Receipt receipt = new Receipt();
    			receipt.setInstrument(instrument);
    			this.prepareReceipt(payment, paymentDetail, receipt);
    			receipts.add(receipt);
    		});
    		
    	}
        // Aggregation of receipt based on Business service
        this.aggregateReceiptBasedOnService(receipts);
    }
/**
 * 
 * @param receipts
 * Method which is used to aggregate the paymentdetils based on the service. it will consolidate the billaccount_details in a single receipt based on business service
 */
    private void aggregateReceiptBasedOnService(List<Receipt> receipts) {
    	Map<String, List<Receipt>> businessRecptMap = new HashMap<>();
    	receipts.stream().forEach(recpt -> {
    		recpt.getBill().stream().forEach(bill -> {
    			if(businessRecptMap.containsKey(bill.getBusinessService())){
    				businessRecptMap.get(bill.getBusinessService()).add(recpt);
    			}else{
    				List<Receipt> list = new ArrayList<>();
    				list.add(recpt);
    				businessRecptMap.put(bill.getBusinessService(), list);
    			}
    		});
    	});
    	receipts.clear();
    	businessRecptMap.entrySet().forEach(entrySet -> {
    		Receipt receipt = entrySet.getValue().get(0);
			
    		BigDecimal totalAmountPaid = entrySet.getValue().stream().map(Receipt::getBill).flatMap(List::stream).map(Bill::getBillDetails).flatMap(List::stream).map(BillDetail::getAmountPaid).reduce((x,y)->x.add(y)).orElse(BigDecimal.ZERO);
    		
    		List<BillAccountDetail> billAccDetailList = entrySet.getValue().stream().map(Receipt::getBill).flatMap(List::stream).map(Bill::getBillDetails).flatMap(List::stream).map(BillDetail::getBillAccountDetails).flatMap(List::stream).collect(Collectors.toList());
    		
    		this.aggregateBillAccounDetails(billAccDetailList);
    		BillDetail billDetail = receipt.getBill().get(0).getBillDetails().get(0);
    		billDetail.setAmountPaid(totalAmountPaid);
    		receipt.getBill().get(0).getBillDetails().clear();
    		receipt.getBill().get(0).getBillDetails().add(billDetail);
    		receipt.getBill().get(0).getBillDetails().get(0).getBillAccountDetails().clear();
    		receipt.getBill().get(0).getBillDetails().get(0).setBillAccountDetails(billAccDetailList);
    		receipts.add(receipt);
    	});
    	
	}

	private void aggregateBillAccounDetails(List<BillAccountDetail> billAccDetailList) {
		Map<String, List<BillAccountDetail>> taxHeadBillAccDetailsMap = new HashMap<>();
		for(BillAccountDetail bad : billAccDetailList){
			if(taxHeadBillAccDetailsMap.containsKey(bad.getTaxHeadCode())){
				taxHeadBillAccDetailsMap.get(bad.getTaxHeadCode()).add(bad);
			}else{
				List<BillAccountDetail> list = new ArrayList<>();
				list.add(bad);
				taxHeadBillAccDetailsMap.put(bad.getTaxHeadCode(), list);
			}
		}
		billAccDetailList.clear();
		for(Entry<String, List<BillAccountDetail>> set : taxHeadBillAccDetailsMap.entrySet()){
			List<BillAccountDetail> value = set.getValue();
			BillAccountDetail bad = value.get(0);
			BigDecimal totalAmount = value.stream().map(BillAccountDetail::getAmount).reduce((prevAmount,currAmount)->prevAmount.add(currAmount)).orElse(BigDecimal.ZERO);
			BigDecimal adjustedAmount = value.stream().map(BillAccountDetail::getAdjustedAmount).reduce((prevAmount,currAmount)->prevAmount.add(currAmount)).orElse(BigDecimal.ZERO);
			bad.setAmount(totalAmount);
			bad.setAdjustedAmount(adjustedAmount);
			billAccDetailList.add(bad);
		}
	}

	private void prepareReceipt(Payment payment, PaymentDetail paymentDetail, Receipt receipt) {
		receipt.setPaymentDetailId(paymentDetail.getId());
		receipt.setAuditDetails(paymentDetail.getAuditDetails());
        receipt.setConsumerCode(paymentDetail.getBill().getConsumerCode());
        receipt.setReceiptDate(paymentDetail.getReceiptDate());
        receipt.setReceiptNumber(paymentDetail.getReceiptNumber());
        receipt.setTenantId(paymentDetail.getTenantId());
        receipt.setPaymentId(payment.getId());
//        receipt.setBill(bill);
        this.prepareBillData(payment, paymentDetail, receipt);
//        receipt.setTransactionId(transactionId);
    }

    private void prepareBillData(Payment payment, PaymentDetail paymentDetail, Receipt receipt) {
        BillV2 billv2 = paymentDetail.getBill();
        Bill bill = new Bill();
        bill.setAdditionalDetails(billv2.getAdditionalDetails());
        bill.setAuditDetails(billv2.getAuditDetails());
        bill.setId(billv2.getId());
//        bill.setIsActive(isActive);
        bill.setIsCancelled(billv2.getIsCancelled());
        bill.setMobileNumber(billv2.getMobileNumber());
        bill.setPaidBy(billv2.getPaidBy() != null ? billv2.getPaidBy() : payment.getPaidBy());
        bill.setPayerAddress(billv2.getPayerAddress());
        bill.setPayerEmail(billv2.getPayerEmail());
        bill.setPayerId(billv2.getPayerId());
        bill.setPayerName(billv2.getPayerName());
//        bill.setTaxAndPayments(taxAndPayments);
        bill.setTenantId(billv2.getTenantId());
        bill.setBusinessService(paymentDetail.getBusinessService());
//        bill.setBillDetails(billDetails);
        //prepare billdetails
        bill.setBillDetails(new ArrayList<BillDetail>());
        this.prepareBillDetailsData(paymentDetail,bill);
        receipt.getBill().add(bill);
    }

    private void prepareBillDetailsData(PaymentDetail paymentDetail, Bill bill) {
        // TODO Auto-generated method stub
        paymentDetail.getBill().getBillDetails().stream().forEach(bdv1 -> {
            BillDetail bd = new BillDetail();
            bd.setAdditionalDetails(bdv1.getAdditionalDetails());
            bd.setAmountPaid(bdv1.getAmountPaid());
//            bd.setBill(bill);
            bd.setBillDate(paymentDetail.getBill().getBillDate());
            bd.setBillDescription(bdv1.getBillDescription());
            bd.setBillNumber(paymentDetail.getBill().getBillNumber());
            bd.setBoundary(bdv1.getBoundary());
            bd.setBusinessService(paymentDetail.getBill().getBusinessService());
            bd.setCallBackForApportioning(bdv1.getCallBackForApportioning());
            bd.setCancellationRemarks(bdv1.getCancellationRemarks());
            bd.setChannel(bdv1.getChannel());
//            bd.setCollectedAmount(collectedAmount);
            bd.setCollectionModesNotAllowed(paymentDetail.getBill().getCollectionModesNotAllowed());
            bd.setCollectionType(bdv1.getCollectionType());
            bd.setConsumerCode(paymentDetail.getBill().getConsumerCode());
            bd.setDemandId(bdv1.getDemandId());
            bd.setDisplayMessage(bdv1.getDisplayMessage());
            bd.setExpiryDate(bdv1.getExpiryDate());
            bd.setFromPeriod(bdv1.getFromPeriod());
            bd.setId(bdv1.getId());
            bd.setIsAdvanceAllowed(paymentDetail.getBill().getIsAdvanceAllowed());
            bd.setManualReceiptDate(bdv1.getManualReceiptDate());
            bd.setManualReceiptNumber(bdv1.getManualReceiptNumber());
            bd.setMinimumAmount(paymentDetail.getBill().getMinimumAmountToBePaid());
            bd.setPartPaymentAllowed(paymentDetail.getBill().getPartPaymentAllowed());
            bd.setReasonForCancellation(paymentDetail.getBill().getReasonForCancellation());
            bd.setReceiptDate(paymentDetail.getReceiptDate());
            bd.setReceiptNumber(paymentDetail.getReceiptNumber());
            bd.setReceiptType(paymentDetail.getReceiptType());
//            bd.setStateId(stateId);
            bd.setStatus(paymentDetail.getBill().getStatus().name());
            bd.setTenantId(bdv1.getTenantId());
            bd.setToPeriod(bdv1.getToPeriod());
            bd.setTotalAmount(paymentDetail.getBill().getTotalAmount());
            bd.setVoucherHeader(bdv1.getVoucherHeader());
            bd.setBillAccountDetails(new ArrayList<>());
            this.preapreBillAccountDetails(bd,bdv1);
            bill.getBillDetails().add(bd);
        });
    }

    private void preapreBillAccountDetails(BillDetail bd, BillDetailV2 bdv1) {
        bd.setBillAccountDetails(bdv1.getBillAccountDetails());
//    	bdv1.getBillAccountDetails().stream().
    }

    private void prepareInstrument(Payment payment, Instrument instrument) throws VoucherCustomException {
        instrument.setAmount(payment.getTotalAmountPaid());
        instrument.setIfscCode(payment.getIfscCode());
        if(payment.getIfscCode() != null && !payment.getIfscCode().isEmpty()){
        	populateBankDetails(instrument,payment.getIfscCode());
        }
        instrument.setPaymentId(payment.getId());
        instrument.setInstrumentDate(payment.getInstrumentDate());
        instrument.setInstrumentNumber(payment.getInstrumentNumber());
        instrument.setInstrumentStatus(payment.getInstrumentStatus());
        InstrumentType instrumentType = new InstrumentType();
		if (payment.getPaymentMode().name().equalsIgnoreCase("DD"))
			instrumentType.setName(payment.getPaymentMode().name().toUpperCase());
		else
			instrumentType.setName(this.toCamelCase(payment.getPaymentMode().name()));
        instrument.setInstrumentType(instrumentType);
        instrument.setTenantId(payment.getTenantId());
        instrument.setTransactionDate(new Date(payment.getTransactionDate()));
        instrument.setTransactionNumber(payment.getTransactionNumber());
        instrument.setTransactionType(TransactionType.Debit);
    }
    
    /**
     * Method which is used to populate the Bank Details based on ifsc code
     * @param instrument
     * @param ifscCode
     * @throws VoucherCustomException
     */
    private void populateBankDetails(Instrument instrument, String ifscCode) throws VoucherCustomException {
    	Object resultGet = serviceRequestRepository.fetchResultGet(HTTPS_IFSC_RAZORPAY_URL+ifscCode);
    	BankDetails bankDetails = mapper.convertValue(resultGet, BankDetails.class);
    	BankContract bank = BankContract.builder().name(bankDetails.getBankName()).code(bankDetails.getBankCode()).build();
		instrument.setBank(bank );
		instrument.setBranchName(bankDetails.getBranchName());
	}

	private String toCamelCase(String str){
    	return new StringBuilder(str.toUpperCase().substring(0,1)).append(str.substring(1).toLowerCase()).toString();
    }
}
