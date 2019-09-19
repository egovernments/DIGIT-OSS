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

import java.util.Collections;
import java.util.Date;

import org.egov.mdms.service.MicroServiceUtil;
import org.egov.receipt.consumer.model.FinanceMdmsModel;
import org.egov.receipt.consumer.model.FinancialStatus;
import org.egov.receipt.consumer.model.Instrument;
import org.egov.receipt.consumer.model.InstrumentContract;
import org.egov.receipt.consumer.model.InstrumentRequest;
import org.egov.receipt.consumer.model.InstrumentResponse;
import org.egov.receipt.consumer.model.InstrumentVoucherContract;
import org.egov.receipt.consumer.model.Receipt;
import org.egov.receipt.consumer.model.ReceiptReq;
import org.egov.receipt.consumer.model.RequestInfo;
import org.egov.receipt.consumer.model.VoucherResponse;
import org.egov.receipt.consumer.repository.ServiceRequestRepository;
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

	@Autowired
	private PropertiesManager propertiesManager;
	
	@Autowired
    private ServiceRequestRepository serviceRequestRepository;
    
    @Autowired
	private ObjectMapper mapper;
    
    @Autowired
	private MicroServiceUtil microServiceUtil;

	/**
	 * 
	 * @param receiptRequest
	 * @param voucherResponse
	 * @return
	 * Function is used to create the instrument for created voucher.
	 * @throws VoucherCustomException 
	 */
	public InstrumentResponse createInstrument(ReceiptReq receiptRequest, VoucherResponse voucherResponse, FinanceMdmsModel finSerMdms) throws VoucherCustomException {
		
			Receipt receipt = receiptRequest.getReceipt().get(0);
			FinancialStatus status  = microServiceUtil.getFinancialStatusByCode(receipt.getTenantId(), receiptRequest.getRequestInfo(), finSerMdms, FINANCE_STATUS_NEW);
			Instrument instrument = receipt.getInstrument();
			InstrumentContract instrumentContract = instrument.toContract();
			instrumentContract.setFinancialStatus(status);
			if (voucherResponse != null) {
				prepareInstrumentVoucher(instrumentContract, voucherResponse.getVouchers().get(0).getVoucherNumber(), receipt.getReceiptNumber());
			}
			StringBuilder url = new StringBuilder(propertiesManager.getInstrumentHostUrl() + propertiesManager.getInstrumentCreate());
			InstrumentRequest request = new InstrumentRequest();
			request.setInstruments(Collections.singletonList(instrumentContract));
			request.setRequestInfo(receiptRequest.getRequestInfo());
			return mapper.convertValue(serviceRequestRepository.fetchResult(url, request, receipt.getTenantId()), InstrumentResponse.class);
		
	}

	private void prepareInstrumentVoucher(InstrumentContract instrumentContract, String voucherNumber,
			String receiptNumber) {

		InstrumentVoucherContract ivContract = new InstrumentVoucherContract();
		ivContract.setVoucherHeaderId(voucherNumber);
		ivContract.setReceiptHeaderId(receiptNumber);
		instrumentContract.setInstrumentVouchers(Collections.singletonList(ivContract));
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
		prepareInstrumentVoucher(instrumentContract, receipt.getBill().get(0).getBillDetails().get(0).getVoucherHeader(), receipt.getReceiptNumber());
		StringBuilder url = new StringBuilder(propertiesManager.getInstrumentHostUrl() + propertiesManager.getInstrumentCancel());
		InstrumentRequest request = new InstrumentRequest();
		request.setInstruments(Collections.singletonList(instrumentContract));
		request.setRequestInfo(requestInfo);
		mapper.convertValue(serviceRequestRepository.fetchResult(url, request, receipt.getTenantId()), InstrumentResponse.class);
	}
}
