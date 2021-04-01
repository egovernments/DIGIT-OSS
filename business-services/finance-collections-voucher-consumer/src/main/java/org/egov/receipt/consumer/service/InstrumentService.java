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

package org.egov.receipt.consumer.service;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.egov.mdms.service.MicroServiceUtil;
import org.egov.receipt.consumer.model.AccountDetail;
import org.egov.receipt.consumer.model.FinanceMdmsModel;
import org.egov.receipt.consumer.model.FinancialStatus;
import org.egov.receipt.consumer.model.Instrument;
import org.egov.receipt.consumer.model.InstrumentContract;
import org.egov.receipt.consumer.model.InstrumentRequest;
import org.egov.receipt.consumer.model.InstrumentResponse;
import org.egov.receipt.consumer.model.InstrumentSearchContract;
import org.egov.receipt.consumer.model.InstrumentVoucherContract;
import org.egov.receipt.consumer.model.ProcessStatus;
import org.egov.receipt.consumer.model.Receipt;
import org.egov.receipt.consumer.model.ReceiptReq;
import org.egov.receipt.consumer.model.RequestInfo;
import org.egov.receipt.consumer.model.Voucher;
import org.egov.receipt.consumer.model.VoucherResponse;
import org.egov.receipt.consumer.model.VoucherSearchCriteria;
import org.egov.receipt.consumer.repository.ServiceRequestRepository;
import org.egov.receipt.consumer.v2.model.PaymentRequest;
import org.egov.receipt.custom.exception.VoucherCustomException;
import org.egov.reciept.consumer.config.PropertiesManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;


@Service
public class InstrumentService {

	public static final Logger LOGGER = LoggerFactory.getLogger(InstrumentService.class);

	private static final String FINANCE_STATUS_NEW = "New";

	private static final String FINANCE_STATUS_CANCELLED = "Cancelled";
	
	final SimpleDateFormat dateFormatter = new SimpleDateFormat("dd/MM/yyyy");

	@Autowired
	private PropertiesManager propertiesManager;
	
	@Autowired
    private ServiceRequestRepository serviceRequestRepository;
    
    @Autowired
	private ObjectMapper mapper;
    
    @Autowired
	private MicroServiceUtil microServiceUtil;
    
    @Autowired
	private VoucherService voucherService;

	/**
	 * 
	 * @param receiptRequest
	 * @param voucherResponse
	 * @return
	 * Function is used to create the instrument for created voucher.
	 * @throws VoucherCustomException 
	 */
	public InstrumentResponse createInstrument(ReceiptReq receiptRequest, VoucherResponse voucherResponse, FinanceMdmsModel finSerMdms, String collectionVersion) throws VoucherCustomException {
		
			Receipt receipt = receiptRequest.getReceipt().get(0);
			
			FinancialStatus status  = microServiceUtil.getFinancialStatusByCode(receipt.getTenantId(), receiptRequest.getRequestInfo(), finSerMdms, FINANCE_STATUS_NEW);
			Instrument instrument = receipt.getInstrument();
			String receiptNumber = collectionVersion != null && collectionVersion.equalsIgnoreCase("V2") ? instrument.getPaymentId() : receipt.getBill().get(0).getBillDetails().get(0).getReceiptNumber();
			InstrumentContract instrumentContract = instrument.toContract();
			instrumentContract.setFinancialStatus(status);
			if (voucherResponse != null) {
				prepareInstrumentVoucher(instrumentContract, voucherResponse, receiptNumber);
			}
			StringBuilder url = new StringBuilder(propertiesManager.getInstrumentHostUrl() + propertiesManager.getInstrumentCreate());
			InstrumentRequest request = new InstrumentRequest();
			request.setInstruments(Collections.singletonList(instrumentContract));
			request.setRequestInfo(receiptRequest.getRequestInfo());
			LOGGER.info("request : {}, Instrument : {}", request, instrumentContract);
			LOGGER.info("InstrumentType : {}", instrumentContract.getInstrumentType().getName());
			return mapper.convertValue(serviceRequestRepository.fetchResult(url, request, receipt.getTenantId()), InstrumentResponse.class);
		
	}

	private void prepareInstrumentVoucher(InstrumentContract instrumentContract, VoucherResponse voucherResponse,
			String receiptNumber) {

		voucherResponse.getVouchers().stream().forEach(voucher -> {
			InstrumentVoucherContract ivContract = new InstrumentVoucherContract();
			ivContract.setReceiptHeaderId(receiptNumber);	
			ivContract.setVoucherHeaderId(voucher.getVoucherNumber());
			instrumentContract.getInstrumentVouchers().add(ivContract);
		});
	}

	/**
	 * 
	 * @param receipt
	 * Function is used to cancel the instruments
	 * @throws VoucherCustomException 
	 */
	public void cancelInstrument(ReceiptReq receiptReq, FinanceMdmsModel finSerMdms) throws VoucherCustomException {
		RequestInfo requestInfo = receiptReq.getRequestInfo();
		Receipt receipt = receiptReq.getReceipt().get(0);
		FinancialStatus status  = microServiceUtil.getFinancialStatusByCode(receipt.getTenantId(), requestInfo , finSerMdms, FINANCE_STATUS_CANCELLED);
		Instrument instrument = receipt.getInstrument();
		InstrumentContract instrumentContract = instrument.toContract();
		if(instrument.getTransactionDateInput() != null){
			instrumentContract.setTransactionDate(new Date(instrument.getTransactionDateInput()));
		}
		instrumentContract.setFinancialStatus(status);
		String voucherNumber = receipt.getBill().get(0).getBillDetails().get(0).getVoucherHeader();
		//		prepareInstrumentVoucher(instrumentContract, receipt.getBill().get(0).getBillDetails().get(0).getVoucherHeader(), receipt.getReceiptNumber());
		prepareInstrumentVoucher(instrumentContract, VoucherResponse.builder().vouchers(Collections.singletonList(Voucher.builder().voucherNumber(voucherNumber).build())).build(), receipt.getReceiptNumber());
		StringBuilder url = new StringBuilder(propertiesManager.getInstrumentHostUrl() + propertiesManager.getInstrumentCancel());
		InstrumentRequest request = new InstrumentRequest();
		request.setInstruments(Collections.singletonList(instrumentContract));
		request.setRequestInfo(requestInfo);
		mapper.convertValue(serviceRequestRepository.fetchResult(url, request, receipt.getTenantId()), InstrumentResponse.class);
	}
	
	public void cancelInstrumentForPayment(PaymentRequest payRequest, FinanceMdmsModel finSerMdms) throws VoucherCustomException {
		
		RequestInfo requestInfo = payRequest.getRequestInfo();
		String paymentId = payRequest.getPayment().getId();
		String tenantId = payRequest.getPayment().getTenantId();
		FinancialStatus cancelStatus  = microServiceUtil.getFinancialStatusByCode(tenantId, requestInfo , finSerMdms, FINANCE_STATUS_CANCELLED);
		FinancialStatus newStatus  = microServiceUtil.getFinancialStatusByCode(tenantId, requestInfo , finSerMdms, FINANCE_STATUS_NEW);
		List<InstrumentContract> instruments = microServiceUtil.getInstruments(InstrumentSearchContract.builder().receiptIds(paymentId).build(), requestInfo, tenantId);
		if(instruments != null && !instruments.isEmpty()){
			InstrumentContract instrumentContract = instruments.get(0);
			if(instrumentContract.getFinancialStatus().getCode().equalsIgnoreCase(newStatus.getCode())){
				instrumentContract .setFinancialStatus(cancelStatus);
			StringBuilder url = new StringBuilder(propertiesManager.getInstrumentHostUrl() + propertiesManager.getInstrumentCancel());
				InstrumentRequest request = new InstrumentRequest();
				request.setInstruments(Collections.singletonList(instrumentContract));
				request.setRequestInfo(requestInfo);
				mapper.convertValue(serviceRequestRepository.fetchResult(url, request, tenantId), InstrumentResponse.class);
			}else{
				throw new VoucherCustomException(ProcessStatus.FAILED, String.format("Instrument for Payment : %1$s is already in %2$s state. So we can not process further to cancel the payment.", paymentId, instrumentContract.getFinancialStatus().getCode()));
			}
		}else{
			throw new VoucherCustomException(ProcessStatus.FAILED, String.format("Instrument for Payment : %1$s is not exist", paymentId));
		}
	}

	public void processDishonorIntruments(InstrumentRequest request) throws IllegalArgumentException, VoucherCustomException {
		List<InstrumentContract> instruments = request.getInstruments();
		VoucherResponse reversalVoucher = voucherService.processReversalVoucher(instruments, request.getRequestInfo());
		instruments.get(0).getDishonor().setReversalVoucherId(reversalVoucher.getVouchers().get(0).getVoucherNumber());
		this.updateInstruments(instruments, request.getRequestInfo());
	}

	private void updateInstruments(List<InstrumentContract> instruments, RequestInfo requestInfo) throws IllegalArgumentException, VoucherCustomException {
		StringBuilder url = new StringBuilder(propertiesManager.getInstrumentHostUrl() + propertiesManager.getInstrumentCancel());
		InstrumentRequest request = new InstrumentRequest();
		request.setInstruments(instruments);
		request.setRequestInfo(requestInfo);
		mapper.convertValue(serviceRequestRepository.fetchResult(url, request, instruments.get(0).getTenantId()), InstrumentResponse.class);
	}
	
}
