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

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.egov.mdms.service.MicroServiceUtil;
import org.egov.receipt.consumer.model.AccountDetail;
import org.egov.receipt.consumer.model.AppConfigValues;
import org.egov.receipt.consumer.model.Bill;
import org.egov.receipt.consumer.model.BillAccountDetail;
import org.egov.receipt.consumer.model.BillDetail;
import org.egov.receipt.consumer.model.BusinessService;
import org.egov.receipt.consumer.model.EgModules;
import org.egov.receipt.consumer.model.FinanceMdmsModel;
import org.egov.receipt.consumer.model.Function;
import org.egov.receipt.consumer.model.Functionary;
import org.egov.receipt.consumer.model.Fund;
import org.egov.receipt.consumer.model.ProcessStatus;
import org.egov.receipt.consumer.model.Receipt;
import org.egov.receipt.consumer.model.ReceiptReq;
import org.egov.receipt.consumer.model.RequestInfo;
import org.egov.receipt.consumer.model.Scheme;
import org.egov.receipt.consumer.model.TaxHeadMaster;
import org.egov.receipt.consumer.model.Tenant;
import org.egov.receipt.consumer.model.Voucher;
import org.egov.receipt.consumer.model.VoucherRequest;
import org.egov.receipt.consumer.model.VoucherResponse;
import org.egov.receipt.consumer.model.VoucherSearchRequest;
import org.egov.receipt.consumer.repository.ServiceRequestRepository;
import org.egov.receipt.custom.exception.VoucherCustomException;
import org.egov.reciept.consumer.config.PropertiesManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class VoucherServiceImpl implements VoucherService {

	@Autowired
	private PropertiesManager propertiesManager;
	@Autowired
	private MicroServiceUtil microServiceUtil;
	@Autowired
	private ServiceRequestRepository serviceRequestRepository;
	@Autowired
	private ObjectMapper mapper;

	final SimpleDateFormat dateFormatter = new SimpleDateFormat("dd/MM/yyyy");

	private static final String RECEIPTS_VOUCHER_TYPE = "Receipt";
	private static final String COLLECTIONS_EG_MODULES_ID = "10";
	private static final Logger LOGGER = LoggerFactory.getLogger(VoucherServiceImpl.class);
	private static final String COLLECTION_MODULE_NAME = "Collections";
	private LinkedHashMap<String, BigDecimal> amountMapwithGlcode;

	@Override
	/**
	 * This method is use to create the voucher specifically for receipt
	 * request.
	 */
	public VoucherResponse createReceiptVoucher(ReceiptReq receiptRequest, FinanceMdmsModel finSerMdms)
			throws Exception {
		Receipt receipt = receiptRequest.getReceipt().get(0);
		String tenantId = receipt.getTenantId();
		final StringBuilder voucher_create_url = new StringBuilder(propertiesManager.getErpURLBytenantId(tenantId)
				+ propertiesManager.getVoucherCreateUrl());
		VoucherRequest voucherRequest = new VoucherRequest();
		Voucher voucher = new Voucher();
		voucher.setTenantId(tenantId);
		this.setVoucherDetails(voucher, receipt, tenantId, receiptRequest.getRequestInfo(), finSerMdms);
		voucherRequest.setVouchers(Collections.singletonList(voucher));
		voucherRequest.setRequestInfo(receiptRequest.getRequestInfo());
		voucherRequest.setTenantId(tenantId);
		return mapper.convertValue(serviceRequestRepository.fetchResult(voucher_create_url, voucherRequest, tenantId), VoucherResponse.class);
	}

	/**
	 * Function which is used to check whether the voucher creation is set to
	 * true or false in business mapping file.
	 */
	@Override
	public boolean isVoucherCreationEnabled(ReceiptReq req, FinanceMdmsModel finSerMdms) throws Exception {
		Receipt receipt = req.getReceipt().get(0);
		String tenantId = receipt.getTenantId();
		Bill bill = receipt.getBill().get(0);
		String bsCode = bill.getBillDetails().get(0).getBusinessService();
		List<BusinessService> serviceByCode = this.getBusinessServiceByCode(tenantId, bsCode, req.getRequestInfo(), finSerMdms);
		return serviceByCode != null && !serviceByCode.isEmpty() ? serviceByCode.get(0).isVoucherCreationEnabled()
				: false;
	}

	/**
	 * Function is for cancelling the voucher based on voucher number
	 */
	@Override
	public VoucherResponse cancelReceiptVoucher(ReceiptReq receiptRequest) throws VoucherCustomException {
		Receipt receipt = receiptRequest.getReceipt().get(0);
		String tenantId = receipt.getTenantId();
		final StringBuilder voucher_cancel_url = new StringBuilder(propertiesManager.getErpURLBytenantId(tenantId)
				+ propertiesManager.getVoucherCancelUrl());
		try {
			VoucherSearchRequest vSearchReq = this.getVoucherSearchReq(receiptRequest);
			return mapper.convertValue(serviceRequestRepository.fetchResult(voucher_cancel_url, vSearchReq, tenantId), VoucherResponse.class);
		} catch (Exception e) {
			throw new VoucherCustomException(ProcessStatus.FAILED, "Failed to cancel voucher");
		}
	}

	/**
	 * 
	 * @param receiptRequest
	 * @return This function is use to set the voucher search params and return
	 *         the setted request
	 */
	private VoucherSearchRequest getVoucherSearchReq(ReceiptReq receiptRequest) {
		VoucherSearchRequest vSearchReq = new VoucherSearchRequest();
		Receipt receipt = receiptRequest.getReceipt().get(0);
		String tenantId = receipt.getTenantId();
		BillDetail billDetail = receipt.getBill().get(0).getBillDetails().get(0);
		String voucherNumber = billDetail.getVoucherHeader();
		vSearchReq.setVoucherNumbers(voucherNumber);
		vSearchReq.setTenantId(tenantId);
		RequestInfo requestInfo = receiptRequest.getRequestInfo();
		requestInfo.setAuthToken(propertiesManager.getSiAuthToken());
		vSearchReq.setRequestInfo(requestInfo);
		return vSearchReq;
	}
	
	/**
	 * 
	 * @param voucher
	 * @param receipt
	 * @param tenantId
	 * @throws Exception
	 *             Function is use to set the specific details of voucher which
	 *             is mendatory to create the voucher.
	 */
	private void setVoucherDetails(Voucher voucher, Receipt receipt, String tenantId, RequestInfo requestInfo,
			FinanceMdmsModel finSerMdms) throws Exception {
		BillDetail billDetail = receipt.getBill().get(0).getBillDetails().get(0);
		String receiptNumber = billDetail.getReceiptNumber();
		String bsCode = billDetail.getBusinessService();
		List<BusinessService> serviceByCode = this.getBusinessServiceByCode(tenantId, bsCode, requestInfo, finSerMdms);
		List<TaxHeadMaster> taxHeadMasterByBusinessServiceCode = this.getTaxHeadMasterByBusinessServiceCode(tenantId,
				bsCode, requestInfo, finSerMdms);
		BusinessService businessService = serviceByCode.get(0);
		String businessServiceName = microServiceUtil.getBusinessServiceName(tenantId, bsCode, requestInfo, finSerMdms);
		voucher.setName(businessServiceName);
		voucher.setType(RECEIPTS_VOUCHER_TYPE);
		voucher.setFund(new Fund());
		voucher.getFund().setCode(businessService.getFund());
		voucher.setFunction(new Function());
		voucher.getFunction().setCode(businessService.getFunction());
		voucher.setDepartment(businessService.getDepartment());
		voucher.setFunctionary(new Functionary());
		voucher.setServiceName(bsCode);
		voucher.setReferenceDocument(receiptNumber);
		String functionaryCode = businessService.getFunctionary() != null
				& !StringUtils.isEmpty(businessService.getFunctionary()) ? businessService.getFunctionary() : null;
		voucher.getFunctionary().setCode(functionaryCode);
		voucher.setScheme(new Scheme());
		String schemeCode = businessService.getScheme() != null & !StringUtils.isEmpty(businessService.getScheme())
				? businessService.getScheme() : null;
		voucher.getScheme().setCode(schemeCode);
		voucher.setDescription(businessServiceName + " Receipt");
		// checking Whether manualReceipt date will be consider as
		// voucherdate
		if (billDetail.getManualReceiptDate() != null && billDetail.getManualReceiptDate().longValue() != 0
				&& isManualReceiptDateEnabled(tenantId, requestInfo)) {
			voucher.setVoucherDate(dateFormatter.format(new Date(billDetail.getManualReceiptDate())));
		} else {
			voucher.setVoucherDate(dateFormatter.format(new Date(billDetail.getReceiptDate())));
		}
		EgModules egModules = this.getModuleIdByModuleName(COLLECTION_MODULE_NAME, tenantId, requestInfo);
		voucher.setModuleId(Long.valueOf(egModules != null ? egModules.getId().toString() : COLLECTIONS_EG_MODULES_ID));

		voucher.setSource(
				propertiesManager.getReceiptViewSourceUrl() + "?selectedReceipts=" + receiptNumber);

		voucher.setLedgers(new ArrayList<>());
		amountMapwithGlcode = new LinkedHashMap<>();
		// Setting glcode and amount in Map as key value pair.
		for (BillAccountDetail bad : billDetail.getBillAccountDetails()) {
			if (bad.getAdjustedAmount().compareTo(new BigDecimal(0)) != 0) {
				String taxHeadCode = bad.getTaxHeadCode();
				List<TaxHeadMaster> findFirst = taxHeadMasterByBusinessServiceCode.stream()
						.filter(tx -> tx.getTaxhead().equals(taxHeadCode)).collect(Collectors.toList());
				if (findFirst != null && findFirst.isEmpty())
					throw new VoucherCustomException(ProcessStatus.FAILED,
							"Taxhead code " + taxHeadCode + " is not mapped with BusinessServiceCode " + bsCode);
				String glcode = findFirst.get(0).getGlcode();
				if (amountMapwithGlcode.get(glcode) != null) {
					amountMapwithGlcode.put(glcode, amountMapwithGlcode.get(glcode).add(bad.getAdjustedAmount()));
				} else {
					amountMapwithGlcode.put(glcode, bad.getAdjustedAmount());
				}
			}
		}

		this.setNetReceiptAmount(receipt, requestInfo, tenantId, bsCode, finSerMdms);
		LOGGER.debug("amountMapwithGlcode  ::: {}", amountMapwithGlcode);
		// Iterating map and setting the ledger details to voucher.
		if(amountMapwithGlcode.isEmpty()){
			throw new VoucherCustomException(ProcessStatus.NA, "This receipt does not require voucher creation.");
		}
		amountMapwithGlcode.entrySet().stream().forEach(entry -> {
				AccountDetail accountDetail = new AccountDetail();
				accountDetail.setGlcode(entry.getKey());
				if (entry.getValue().compareTo(new BigDecimal(0)) == 1) {
					accountDetail.setCreditAmount(entry.getValue().doubleValue());
					accountDetail.setDebitAmount(0d);
				} else {
					accountDetail.setDebitAmount(-entry.getValue().doubleValue());
					accountDetail.setCreditAmount(0d);
				}
				accountDetail.setFunction(new Function());
				accountDetail.getFunction().setCode(businessService.getFunction());
				voucher.getLedgers().add(accountDetail);
		});
	}

	/**
	 * 
	 * @param tenantId
	 * @return Function is used to check the config value for manual receipt
	 *         date consideration.
	 * @throws VoucherCustomException 
	 */
	private boolean isManualReceiptDateEnabled(String tenantId, RequestInfo requestInfo) throws VoucherCustomException {
		requestInfo.setAuthToken(propertiesManager.getSiAuthToken());
		VoucherRequest request = new VoucherRequest(tenantId, requestInfo, null);
		StringBuilder url = new StringBuilder(propertiesManager.getErpURLBytenantId(tenantId)
				+ propertiesManager.getManualReceiptDateConfigUrl());
		AppConfigValues convertValue = null;
		try {
			convertValue = mapper.convertValue(serviceRequestRepository.fetchResult(url, request, tenantId), AppConfigValues.class);
		} catch (Exception e) {
			if (LOGGER.isErrorEnabled())
				LOGGER.error(
						"ERROR while checking the consideration of manual receipt date. So the receipt date will be consider as the voucher date");
		}
		return convertValue != null ? convertValue.getValue().equalsIgnoreCase("Yes") : false;
	}

	/**
	 * 
	 * @param receipt
	 * @param tenantId 
	 * @param businessCode 
	 * @param finSerMdms 
	 * @throws VoucherCustomException
	 *             Function is used to set the paid amount as debit in finance
	 *             system.
	 */
	private void setNetReceiptAmount(Receipt receipt, RequestInfo requestInfo, String tenantId, String businessCode, FinanceMdmsModel finSerMdms)
			throws VoucherCustomException {
		BigDecimal amountPaid = receipt.getBill().get(0).getBillDetails().get(0).getAmountPaid();
		if (amountPaid != null && amountPaid.compareTo(new BigDecimal(0)) != 0) {
			String instrumentType = receipt.getInstrument().getInstrumentType().getName();;
			String glcode = microServiceUtil.getGlcodeByInstrumentType(tenantId, businessCode, requestInfo, finSerMdms, instrumentType);
			if(glcode == null){
				throw new VoucherCustomException(ProcessStatus.FAILED, "Account code mapping is missing for Instrument Type " + instrumentType);
			}
			amountMapwithGlcode.put(glcode, new BigDecimal(-amountPaid.doubleValue()));
		}
	}

	/**
	 * 
	 * @param tenantId
	 * @param bsCode
	 * @return
	 * @throws Exception
	 *             Function is used to get the Business Services based on
	 *             business service code which is mapped in json file
	 */
	private List<BusinessService> getBusinessServiceByCode(String tenantId, String bsCode, RequestInfo requestInfo,
			FinanceMdmsModel finSerMdms) throws Exception {
		List<BusinessService> propertyTaxBusinessService = microServiceUtil.getBusinessService(tenantId, bsCode,
				requestInfo, finSerMdms);
		if (propertyTaxBusinessService.isEmpty()) {
			throw new VoucherCustomException(ProcessStatus.FAILED, "Business service is not mapped with business code : " + bsCode);
		}
		List<BusinessService> collect = propertyTaxBusinessService.stream().filter(bs -> bs.getCode().equals(bsCode))
				.collect(Collectors.toList());
		return collect;
	}

	/**
	 * 
	 * @param tenantId
	 * @param bsCode
	 * @return
	 * @throws Exception
	 *             Function is used to get the TaxHeadMaster data which is
	 *             mapped to business service code
	 */
	private List<TaxHeadMaster> getTaxHeadMasterByBusinessServiceCode(String tenantId, String bsCode,
			RequestInfo requestInfo, FinanceMdmsModel finSerMdms) throws Exception {
		List<TaxHeadMaster> taxHeadMasters = microServiceUtil.getTaxHeadMasters(tenantId, bsCode, requestInfo,
				finSerMdms);
		return taxHeadMasters;
	}

	/**
	 * 
	 * @param moduleName
	 * @param tenantId
	 * @return Function is used to return the module id which is configure in
	 *         erp setup based on module name
	 * @throws VoucherCustomException 
	 */
	private EgModules getModuleIdByModuleName(String moduleName, String tenantId, RequestInfo requestInfo) throws VoucherCustomException {
		requestInfo.setAuthToken(propertiesManager.getSiAuthToken());
		VoucherRequest request = new VoucherRequest(tenantId, requestInfo, null);
		StringBuilder url = new StringBuilder(propertiesManager.getErpURLBytenantId(tenantId) + propertiesManager.getModuleIdSearchUrl() + "?moduleName=" + moduleName);
		try {
			return mapper.convertValue(serviceRequestRepository.fetchResult(url, request, tenantId), EgModules.class);
		} catch (Exception e) {
				LOGGER.error("ERROR while checking the module id for module name {}, default value 10 is considered.",
						moduleName);
		}
		return null;
	}
	
	/*
	 * (non-Javadoc)
	 * @see org.egov.receipt.consumer.service.VoucherService#isTenantEnabledInFinanceModule(org.egov.receipt.consumer.model.ReceiptReq, org.egov.receipt.consumer.model.FinanceMdmsModel)
	 * Method which is used to check whether Tenant is enabled in Finance module or not.
	 */
	@Override
	public boolean isTenantEnabledInFinanceModule(ReceiptReq req, FinanceMdmsModel finSerMdms) throws VoucherCustomException{
		Receipt receipt = req.getReceipt().get(0);
		String tenantId = receipt.getTenantId();
		Bill bill = receipt.getBill().get(0);
		String bsCode = bill.getBillDetails().get(0).getBusinessService();
		List<Tenant> tenantList = microServiceUtil.getFinanceTenantList(tenantId, bsCode, req.getRequestInfo(), finSerMdms);
		List<Tenant> collect = tenantList.stream().filter(tenant -> tenant.getCode().equals(tenantId)).collect(Collectors.toList());
		if(collect.isEmpty()){
			throw new VoucherCustomException(ProcessStatus.NA, "TenantId "+tenantId+" is not enabled in Finance module.");
		}
		return true;
	}
	/*
	 * (non-Javadoc)
	 * @see org.egov.receipt.consumer.service.VoucherService#getVoucherByServiceAndRefDoc(org.egov.receipt.consumer.model.RequestInfo, java.lang.String, java.lang.String, java.lang.String)
	 * Method which is used to fetch the voucher details associated with business service and reference documents.
	 */
	@Override
	public VoucherResponse getVoucherByServiceAndRefDoc(RequestInfo requestInfo, String tenantId, String serviceCode, String referenceDoc) throws VoucherCustomException, UnsupportedEncodingException{
		requestInfo.setAuthToken(propertiesManager.getSiAuthToken());
		VoucherRequest request = new VoucherRequest(tenantId, requestInfo, null);
		StringBuilder url = new StringBuilder(propertiesManager.getErpURLBytenantId(tenantId)
				+ propertiesManager.getVoucherSearchUrl()
				+ "?servicecode=" + serviceCode +"&referencedocument="+URLEncoder.encode(referenceDoc,"UTF-8"));
		try {
			return mapper.convertValue(serviceRequestRepository.fetchResult(url, request, tenantId), VoucherResponse.class);
		} catch (Exception e) {
				LOGGER.error("ERROR while fetching the voucher based on Service and Reference document");
		}
		return null;
	}
}
