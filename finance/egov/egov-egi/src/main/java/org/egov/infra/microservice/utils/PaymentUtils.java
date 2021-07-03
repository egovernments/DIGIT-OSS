/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2017  eGovernments Foundation
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
 *            Further, all user interfaces, including but not limited to citizen facing interfaces,
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines,
 *            please contact contact@egovernments.org
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 *
 */

package org.egov.infra.microservice.utils;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.egov.infra.microservice.models.Bill;
import org.egov.infra.microservice.models.BillDetail;
import org.egov.infra.microservice.models.BillDetailV2;
import org.egov.infra.microservice.models.BillV2;
import org.egov.infra.microservice.models.BusinessService;
import org.egov.infra.microservice.models.BusinessServiceCriteria;
import org.egov.infra.microservice.models.BusinessServiceMapping;
import org.egov.infra.microservice.models.Department;
import org.egov.infra.microservice.models.Instrument;
import org.egov.infra.microservice.models.InstrumentType;
import org.egov.infra.microservice.models.Payment;
import org.egov.infra.microservice.models.PaymentDetail;
import org.egov.infra.microservice.models.Receipt;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class PaymentUtils {
    @Autowired
    private MicroserviceUtils microserviceUtils;
    
    public void getReceiptsFromPayments(List<Payment> payments, List<Receipt> receipts) {
        // prepare instrument from payment
        // prepare receipt from each paymentdetails
        Set<String> businessServices = new HashSet<>();
        if(payments!=null && !payments.isEmpty()) {
        payments.stream().forEach(payment -> {
            Instrument instrument = new Instrument();
            this.prepareInstrument(payment, instrument);
            payment.getPaymentDetails().stream().forEach(paymentDetail -> {
                Receipt receipt = new Receipt();
                receipt.setInstrument(instrument);
                receipt.setPaymentId(payment.getId());
                this.prepareReceipt(payment, paymentDetail, receipt);
                businessServices.add(paymentDetail.getBusinessService());
                receipts.add(receipt);
            });
        });
        this.setFinanceSpecificData(receipts);
        }
    }

    private void prepareReceipt(Payment payment, PaymentDetail paymentDetail, Receipt receipt) {
        receipt.setAuditDetails(paymentDetail.getAuditDetails());
        receipt.setConsumerCode(paymentDetail.getBill().getConsumerCode());
        receipt.setReceiptDate(paymentDetail.getReceiptDate());
        receipt.setReceiptNumber(paymentDetail.getReceiptNumber());
        receipt.setTenantId(paymentDetail.getTenantId());
        receipt.setService(paymentDetail.getBusinessService());
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
        bill.setPaidBy(StringUtils.defaultIfBlank(billv2.getPaidBy(), payment.getPaidBy()));
        bill.setPayerAddress(billv2.getPayerAddress());
        bill.setPayerEmail(billv2.getPayerEmail());
        bill.setPayerId(billv2.getPayerId());
        bill.setPayerName(StringUtils.defaultIfBlank(billv2.getPayerName(), payment.getPayerName()));
//        bill.setTaxAndPayments(taxAndPayments);
        bill.setTenantId(billv2.getTenantId());
        bill.setBillDetails(new ArrayList<BillDetail>());
//        bill.setBillDetails(billDetails);
        //prepare billdetails
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
//            bd.setDepartment(department);
//            bd.setFunction(function);
//            bd.setFund(fund);
            bd.setId(bdv1.getId());
            bd.setIsAdvanceAllowed(paymentDetail.getBill().getIsAdvanceAllowed());
            bd.setManualReceiptDate(bdv1.getManualReceiptDate() != null ? bdv1.getManualReceiptDate() : paymentDetail.getManualReceiptDate());
            bd.setManualReceiptNumber(bdv1.getManualReceiptNumber() != null ? bdv1.getManualReceiptNumber() : paymentDetail.getManualReceiptNumber());
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
    }

    private void prepareInstrument(Payment payment, Instrument instrument) {
        instrument.setAmount(payment.getTotalAmountPaid());
        instrument.setInstrumentDate(payment.getInstrumentDate());
        instrument.setInstrumentNumber(payment.getInstrumentNumber());
        instrument.setInstrumentStatus(payment.getInstrumentStatus().name());
        InstrumentType instrumentType = new InstrumentType();
        instrumentType.setName(payment.getPaymentMode().name());
        instrument.setInstrumentType(instrumentType);
        instrument.setTenantId(payment.getTenantId());
        instrument.setTransactionDate(new Date(payment.getTransactionDate()));
        instrument.setTransactionNumber(payment.getTransactionNumber());
        instrument.setIfscCode(payment.getIfscCode());
    }
    
    private void setFinanceSpecificData(List<Receipt> receipts){
        List<String> businessServices = receipts.stream().map(Receipt::getBill).flatMap(x -> x.stream()).map(Bill::getBillDetails).flatMap(x-> x.stream()).map(BillDetail::getBusinessService).collect(Collectors.toList());
        if(businessServices != null && !businessServices.isEmpty()){
            BusinessServiceCriteria criteria = new BusinessServiceCriteria();
            criteria.setCode(StringUtils.join(businessServices,","));
            criteria.setVoucherCreationEnabled(true);
            List<BusinessServiceMapping> businessServiceMapping = microserviceUtils.getBusinessServiceMappingBySearchCriteria(criteria );
            Map<String, BusinessServiceMapping> bsmMap = new HashMap();
            businessServiceMapping.stream().forEach(basm -> bsmMap.put(basm.getCode(), basm));
            receipts.stream().map(Receipt::getBill).flatMap(x -> x.stream()).map(Bill::getBillDetails).flatMap(x -> x.stream()).forEach(bd -> {
                String businessService = bd.getBusinessService();
                if(bsmMap.get(businessService) != null){
                    BusinessServiceMapping serviceMapping = bsmMap.get(businessService);
                    bd.setDepartment(serviceMapping.getDepartment());
                    bd.setFund(serviceMapping.getFund());
                    bd.setFunction(serviceMapping.getFunction());
                }
            });          
        }
    }
}
