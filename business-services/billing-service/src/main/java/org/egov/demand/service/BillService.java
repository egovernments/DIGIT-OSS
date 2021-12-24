/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.demand.service;

import static org.egov.demand.util.Constants.CONSUMERCODES_REPLACE_TEXT;
import static org.egov.demand.util.Constants.EG_BS_BILL_NO_DEMANDS_FOUND_KEY;
import static org.egov.demand.util.Constants.EG_BS_BILL_NO_DEMANDS_FOUND_MSG;
import static org.egov.demand.util.Constants.TENANTID_REPLACE_TEXT;
import static org.egov.demand.util.Constants.URL_NOT_CONFIGURED_FOR_DEMAND_UPDATE_KEY;
import static org.egov.demand.util.Constants.URL_NOT_CONFIGURED_FOR_DEMAND_UPDATE_MSG;
import static org.egov.demand.util.Constants.URL_NOT_CONFIGURED_REPLACE_TEXT;
import static org.egov.demand.util.Constants.URL_PARAMS_FOR_SERVICE_BASED_DEMAND_APIS;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.Bill;
import org.egov.demand.model.BillAccountDetail;
import org.egov.demand.model.BillDetail;
import org.egov.demand.model.BillSearchCriteria;
import org.egov.demand.model.BusinessServiceDetail;
import org.egov.demand.model.Demand;
import org.egov.demand.model.DemandCriteria;
import org.egov.demand.model.DemandDetail;
import org.egov.demand.model.GenerateBillCriteria;
import org.egov.demand.model.TaxAndPayment;
import org.egov.demand.model.TaxHeadMaster;
import org.egov.demand.model.TaxHeadMasterCriteria;
import org.egov.demand.model.enums.DemandStatus;
import org.egov.demand.repository.BillRepository;
import org.egov.demand.repository.IdGenRepo;
import org.egov.demand.repository.ServiceRequestRepository;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.BillRequest;
import org.egov.demand.web.contract.BillResponse;
import org.egov.demand.web.contract.BusinessServiceDetailCriteria;
import org.egov.demand.web.contract.RequestInfoWrapper;
import org.egov.demand.web.contract.User;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BillService {

	@Autowired
	private KafkaTemplate<String, Object> kafkaTemplate;

	@Autowired
	private ResponseFactory responseFactory;

	@Autowired
	private ApplicationProperties appProps;

	@Autowired
	private BillRepository billRepository;

	@Autowired
	private DemandService demandService;

	@Autowired
	private BusinessServDetailService businessServDetailService;

	@Autowired
	private TaxHeadMasterService taxHeadService;
	
	@Autowired
	private Util util;
	
	@Autowired
	private ServiceRequestRepository restRepository;
	
	@Autowired
	private IdGenRepo idGenRepo;
	
	@Value("${kafka.topics.billgen.topic.name}")
	private String notifTopicName;
	
	/**
	 * Fetches the bill for given parameters
	 * 
	 * Searches the respective bill
	 * if nothing found then generates bill for the same criteria
	 * if bill found then checks the validity of the bill
	 * 	return the bill if valid
	 * else update the demands belonging to the bill then generate a new bill
	 * 
	 * @param moduleCode
	 * @param consumerCodes
	 * @return
	 */
	public BillResponse fetchBill(GenerateBillCriteria billCriteria, RequestInfoWrapper requestInfoWrapper) {
		
		RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();
		BillResponse res = searchBill(billCriteria.toBillSearchCriteria(), requestInfo);
		List<Bill> bills = res.getBill();
		
		/* 
		 * If no existing bills found then Generate new bill 
		 */
		if (CollectionUtils.isEmpty(bills))
			return generateBill(billCriteria, requestInfo);
		
		Bill bill = bills.get(0);
		
		/*
		 * Collecting the businessService code and the list of consumer codes for those service codes 
		 * whose demands needs to be updated.
		 * 
		 * grouping by service code
		 * mapping of consumerCode to collect the value of map as list of consumerCodes
		 */
		Map<String, List<String>> serviceAndConsumerCodeListMap = bill.getBillDetails().stream()
				.filter(detail -> detail.getExpiryDate().compareTo(System.currentTimeMillis()) < 0)
				.collect(Collectors.groupingBy(BillDetail::getBusinessService,
						Collectors.mapping(BillDetail::getConsumerCode, Collectors.toList())));
		
		
		/*
		 * If none of the billDetails in the bills needs to be updated then return the search result
		 */
		if(CollectionUtils.isEmpty(serviceAndConsumerCodeListMap))
			return res;
		else {
			
			updateDemandsForexpiredBillDetails(serviceAndConsumerCodeListMap, billCriteria.getTenantId(), requestInfoWrapper);
			return generateBill(billCriteria, requestInfo);
		}
	}
	
	/**
	 * To make calls to respective service which updates the demands belonging to
	 * the arguments passed
	 * 
	 * @param serviceAndConsumerCodeListMap
	 * @param tenantId
	 */
	private void updateDemandsForexpiredBillDetails(Map<String, List<String>> serviceAndConsumerCodeListMap,
			String tenantId, RequestInfoWrapper requestInfoWrapper) {

		Map<String, String> serviceUrlMap = appProps.getBusinessCodeAndDemandUpdateUrlMap();

		for (Entry<String, List<String>> entry : serviceAndConsumerCodeListMap.entrySet()) {

			String url = serviceUrlMap.get(entry.getKey());

			if (StringUtils.isEmpty(url))
				throw new CustomException(URL_NOT_CONFIGURED_FOR_DEMAND_UPDATE_KEY,
						URL_NOT_CONFIGURED_FOR_DEMAND_UPDATE_MSG.replace(URL_NOT_CONFIGURED_REPLACE_TEXT,
								entry.getKey()));

			StringBuilder completeUrl = new StringBuilder(url)
					.append(URL_PARAMS_FOR_SERVICE_BASED_DEMAND_APIS.replace(TENANTID_REPLACE_TEXT, tenantId).replace(
							CONSUMERCODES_REPLACE_TEXT, entry.getValue().toString().replace("[", "").replace("]", "")));

			log.info("the url : " + completeUrl);
			restRepository.fetchResult(completeUrl.toString(), requestInfoWrapper);
		}
	}


	/**
	 * Searches the bills from DB for given criteria and enriches them with TaxAndPayments array
	 * 
	 * @param billCriteria
	 * @param requestInfo
	 * @return
	 */
	public BillResponse searchBill(BillSearchCriteria billCriteria, RequestInfo requestInfo) {

		List<Bill> bills = billRepository.findBill(billCriteria);
		Map<String, TaxAndPayment> serviceCodeAndTaxAmountMap = new HashMap<>();

		bills.forEach(bill -> {

			serviceCodeAndTaxAmountMap.clear();
			bill.getBillDetails()
					.forEach(billDetail -> updateServiceCodeAndTaxAmountMap(serviceCodeAndTaxAmountMap, billDetail));
			bill.setTaxAndPayments(new ArrayList<>(serviceCodeAndTaxAmountMap.values()));
		});

		return BillResponse.builder().resposneInfo(responseFactory.getResponseInfo(requestInfo, HttpStatus.OK))
				.bill(bills).build();
	}
	
	/**
	 * Generate bill based on the given criteria
	 * 
	 * @param billCriteria
	 * @param requestInfo
	 * @return
	 */
	public BillResponse generateBill(GenerateBillCriteria billCriteria, RequestInfo requestInfo) {

		Set<String> demandIds = new HashSet<>();
		Set<String> consumerCodes = new HashSet<>();

		if (billCriteria.getDemandId() != null)
			demandIds.add(billCriteria.getDemandId());

		if (billCriteria.getConsumerCode() != null)
			consumerCodes.addAll(billCriteria.getConsumerCode());

		DemandCriteria demandCriteria = DemandCriteria.builder()
				.businessService(billCriteria.getBusinessService())
				.mobileNumber(billCriteria.getMobileNumber())
				.tenantId(billCriteria.getTenantId())
				.email(billCriteria.getEmail())
				.consumerCode(consumerCodes)
				.status(DemandStatus.ACTIVE.toString())
				.receiptRequired(false)
				.demandId(demandIds)
				.build();

		/* Fetching demands for the given bill search criteria */
		List<Demand> demands = demandService.getDemands(demandCriteria, requestInfo);

		List<Bill> bills;

		if (!demands.isEmpty())
			bills = prepareBill(demands, requestInfo);
		else
			throw new CustomException(EG_BS_BILL_NO_DEMANDS_FOUND_KEY, EG_BS_BILL_NO_DEMANDS_FOUND_MSG);

		BillRequest billRequest = BillRequest.builder().bills(bills).requestInfo(requestInfo).build();
		kafkaTemplate.send(notifTopicName, null, billRequest);
		return create(billRequest);
	}

	/**
	 * Prepares the bill object from the list of given demands
	 * 
	 * @param demands demands for which bill should be generated
	 * @param requestInfo 
	 * @return
	 */
	private List<Bill> prepareBill(List<Demand> unGroupedDemands, RequestInfo requestInfo) {
		
		List<Bill> bills = new ArrayList<>();
		Map<String, List<Demand>> businessAndconsumerCodeDemandMap = unGroupedDemands.stream()
				.collect(Collectors.groupingBy(demand -> demand.getBusinessService() + "-" + demand.getConsumerCode()));

		for (Entry<String, List<Demand>> entry : businessAndconsumerCodeDemandMap.entrySet()) {

			List<Demand> demandsForCurrentBusinessAndConsumer = entry.getValue();
			/*
			 * map to keep check on the values of total amount for each business in bill
			 */
			Map<String, TaxAndPayment> serviceCodeAndTaxAmountMap = new HashMap<>();
			User payer = null != demandsForCurrentBusinessAndConsumer.get(0).getPayer()
					? demandsForCurrentBusinessAndConsumer.get(0).getPayer()
					: new User();

			List<BillDetail> billDetails = new ArrayList<>();
			/*
			 * Fetching Required master data
			 */
			String tenantId = demandsForCurrentBusinessAndConsumer.get(0).getTenantId();
			String businessService = demandsForCurrentBusinessAndConsumer.get(0).getBusinessService();
			Set<String> businessCodeSet = new HashSet<>();
			businessCodeSet.add(businessService);
			Set<String> taxHeadCodes = new HashSet<>();

			for (Demand demand : demandsForCurrentBusinessAndConsumer) {

				demand.getDemandDetails().forEach(detail -> taxHeadCodes.add(detail.getTaxHeadMasterCode()));
			}

			Map<String, TaxHeadMaster> taxHeadMap = getTaxHeadMaster(taxHeadCodes, tenantId, requestInfo);
			Map<String, BusinessServiceDetail> businessMap = getBusinessService(businessCodeSet, tenantId, requestInfo);
			List<String> billNumbers = null;

			billNumbers = getBillNumbers(requestInfo, tenantId, businessService,
					demandsForCurrentBusinessAndConsumer.size());
			/*
			 * looping demand to create bill-detail and account-details object
			 * 
			 * setting ids to the same
			 */
			String billId = UUID.randomUUID().toString();
			int i = 0;
			for (Demand demand : demandsForCurrentBusinessAndConsumer) {

				/* bill detail Gen */
				BillDetail billDetail = getBillDetailForDemand(demand, taxHeadMap, businessMap);

				/* setting ids for billDetail and billAccountDetails */
				String billDetailId = UUID.randomUUID().toString();
				billDetail.setId(billDetailId);
				billDetail.setBill(billId);
				billDetail.setBillNumber(billNumbers.get(i++));

				for (BillAccountDetail accDetail : billDetail.getBillAccountDetails()) {

					accDetail.setId(UUID.randomUUID().toString());
					accDetail.setBillDetail(billDetailId);
				}

				/* updating total amount in map for business-code per bill detail */
				updateServiceCodeAndTaxAmountMap(serviceCodeAndTaxAmountMap, billDetail);
				billDetails.add(billDetail);
			}

			Bill bill = Bill.builder()
				.taxAndPayments(new ArrayList<>(serviceCodeAndTaxAmountMap.values()))
				.auditDetails(util.getAuditDetail(requestInfo))
				.payerAddress(payer.getPermanentAddress())
				.mobileNumber(payer.getMobileNumber())
				.payerName(payer.getName())
				.billDetails(billDetails)
				.tenantId(tenantId)
				.isCancelled(null)
				.isActive(true)
				.id(billId)
				.build();
		
			bills.add(bill);
		}
		return bills;
	}

	private List<String> getBillNumbers(RequestInfo requestInfo, String tenantId, String module, int count) {

		String billNumberFormat = appProps.getBillNumberFormat();
		billNumberFormat = billNumberFormat.replace(appProps.getModuleReplaceStirng(), module);

		if (appProps.getIsTenantLevelBillNumberingEnabled())
			billNumberFormat = billNumberFormat.replace(appProps.getTenantIdReplaceString(), "_".concat(tenantId.split("\\.")[tenantId.length()-1]));
		else
			billNumberFormat = billNumberFormat.replace(appProps.getTenantIdReplaceString(), "");

		return idGenRepo.getId(requestInfo, tenantId, "billnumberid", billNumberFormat, count);
	}

	/**
	 * updates the total amount to be paid for each business service code
	 * 
	 * in serviceCodeAndTaxAmountMap from the incoming BillDetail object.
	 * 
	 * @param serviceCodeAndTaxAmountMap
	 * @param billDetail
	 */
	private void updateServiceCodeAndTaxAmountMap(Map<String, TaxAndPayment> serviceCodeAndTaxAmountMap,
			BillDetail billDetail) {

		String businessCode = billDetail.getBusinessService();
		BigDecimal amountFromBillDetail = billDetail.getTotalAmount();
		BigDecimal collectedAmt = BigDecimal.ZERO;
		
		for (BillAccountDetail accDeatil : billDetail.getBillAccountDetails()) {
			collectedAmt = collectedAmt.add(accDeatil.getAdjustedAmount());
		}

		/* if business code already exists then add the amounts */
		if (serviceCodeAndTaxAmountMap.containsKey(businessCode)) {

			TaxAndPayment taxAndPayment = serviceCodeAndTaxAmountMap.get(businessCode);
			BigDecimal existingAmount = taxAndPayment.getTaxAmount();
			taxAndPayment.setTaxAmount(existingAmount.add(amountFromBillDetail));
		}else {
			/* if code not present already then put a new entry */
			TaxAndPayment taxAndPayment = TaxAndPayment.builder()
					.businessService(businessCode)
					.taxAmount(amountFromBillDetail)
					.build();
			
			serviceCodeAndTaxAmountMap.put(businessCode, taxAndPayment);
		}
	}

	/**
	 * Method to create BillDetail object from demand
	 *  
	 * @param demand
	 * @param taxHeadMap
	 * @param businessDetailMap
	 * @return
	 */
	private BillDetail getBillDetailForDemand(Demand demand, Map<String, TaxHeadMaster> taxHeadMap,
			Map<String, BusinessServiceDetail> businessDetailMap) {
		
		Long startPeriod = demand.getTaxPeriodFrom();
		Long endPeriod = demand.getTaxPeriodTo();
		String tenantId = demand.getTenantId();

		BigDecimal collectedAmountForDemand = BigDecimal.ZERO;
		BigDecimal totalAmountForDemand = BigDecimal.ZERO;
		
		BusinessServiceDetail business = businessDetailMap.get(demand.getBusinessService());

		/*
		 * Map to store the bill account detail object with TaxHead code
		 * To accommodate conversion of multiple DemandDetails with same tax head code to single BillAccountDetail
		 */
		Map<String, BillAccountDetail> taxCodeAccountdetailMap = new HashMap<>();
		
		for(DemandDetail demandDetail : demand.getDemandDetails()) {
			
			
			TaxHeadMaster taxHead = taxHeadMap.get(demandDetail.getTaxHeadMasterCode());
			BigDecimal amountForAccDeatil = demandDetail.getTaxAmount().subtract(demandDetail.getCollectionAmount());

			addOrUpdateBillAccDetailInTaxCodeAccDetailMap(demand, taxCodeAccountdetailMap, demandDetail, taxHead);

			/* Total tax and collection for the whole demand/bill-detail */
			totalAmountForDemand = totalAmountForDemand.add(amountForAccDeatil);
			collectedAmountForDemand = collectedAmountForDemand.add(demandDetail.getCollectionAmount());
		}
		
		
		Long billexpiryTime = demand.getBillExpiryTime();
		if (null == billexpiryTime || 0 == billexpiryTime) {

			Calendar cal = Calendar.getInstance();
			cal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DATE), 23, 59, 59);
			billexpiryTime = cal.getTimeInMillis();
		}
		return BillDetail.builder()
				.billAccountDetails(new ArrayList<>(taxCodeAccountdetailMap.values()))
				.collectionModesNotAllowed(business.getCollectionModesNotAllowed())
				.partPaymentAllowed(business.getPartPaymentAllowed())
				.isAdvanceAllowed(business.getIsAdvanceAllowed())
				.minimumAmount(demand.getMinimumAmountPayable())
				.collectedAmount(collectedAmountForDemand)
				.consumerCode(demand.getConsumerCode())
				.consumerType(demand.getConsumerType())
				.billDate(System.currentTimeMillis())
				.businessService(business.getCode())
				.totalAmount(totalAmountForDemand)
				.expiryDate(billexpiryTime)
				.demandId(demand.getId())
				.fromPeriod(startPeriod)
				.toPeriod(endPeriod)
				.tenantId(tenantId)
				.billNumber(null)
				.status(null)
				.id(null)
				.build();
	}

	/**
	 * creates/ updates bill-account details based on the tax-head code
	 * in taxCodeAccDetailMap
	 * 
	 * @param startPeriod
	 * @param endPeriod
	 * @param tenantId
	 * @param taxCodeAccDetailMap
	 * @param demandDetail
	 * @param taxHead
	 * @param amountForAccDeatil
	 */
	private void addOrUpdateBillAccDetailInTaxCodeAccDetailMap(Demand demand, Map<String, BillAccountDetail> taxCodeAccDetailMap,
			DemandDetail demandDetail, TaxHeadMaster taxHead) {
		
		String tenantId = demand.getTenantId();

		BigDecimal newAmountForAccDeatil = demandDetail.getTaxAmount().subtract(demandDetail.getCollectionAmount());
		/*
		 * 	BAD - BillAccountDetail
		 * 
		 *  To handle repeating tax-head codes in demand
		 *  
		 *  And merge them in to single BAD 
		 * 
		 *  if taxHeadCode found in map then add the amount to existing BAD
		 *  
		 *  else create and add a new BAD
		 */
		if (taxCodeAccDetailMap.containsKey(taxHead.getCode())) {

			BillAccountDetail existingAccDetail = taxCodeAccDetailMap.get(taxHead.getCode());
			BigDecimal existingAmtForAccDetail = existingAccDetail.getAmount();
			existingAccDetail.setAmount(existingAmtForAccDetail.add(newAmountForAccDeatil));
			
		} else {

			BillAccountDetail accountDetail = BillAccountDetail.builder()
					.demandDetailId(demandDetail.getId())
					.adjustedAmount(BigDecimal.ZERO)
					.taxHeadCode(taxHead.getCode())
					.amount(newAmountForAccDeatil)
					.order(taxHead.getOrder())
					.tenantId(tenantId)
					.build();
		
			taxCodeAccDetailMap.put(taxHead.getCode(), accountDetail);
		}
	}


	/**
	 * Fetches the tax-head master data for the given tax-head codes
	 * 
	 * @param demands  list of demands for which tax-heads needs to searched
	 * @param tenantId tenant-id of the request
	 * @param info     RequestInfo object
	 * @return returns a map of tax-head code as key and tax-head object as value
	 */
	private Map<String, TaxHeadMaster> getTaxHeadMaster(Set<String> taxHeadCodes, String tenantId, RequestInfo info) {

		TaxHeadMasterCriteria taxHeadCriteria = TaxHeadMasterCriteria.builder().tenantId(tenantId).code(taxHeadCodes)
				.build();
		List<TaxHeadMaster> taxHeads = taxHeadService.getTaxHeads(taxHeadCriteria, info).getTaxHeadMasters();

		if (taxHeads.isEmpty())
			throw new CustomException("EG_BS_TAXHEADCODE_EMPTY", "No taxhead masters found for the given codes");

		return taxHeads.stream().collect(Collectors.toMap(TaxHeadMaster::getCode, Function.identity()));
	}

	
	/**
	 * To Fetch the businessServiceDetail master based on the business codes
	 * 
	 * @param businessService
	 * @param tenantId
	 * @param requestInfo
	 * @return returns a map with business code and businessDetail object
	 */
	private Map<String, BusinessServiceDetail> getBusinessService(Set<String> businessService, String tenantId, RequestInfo requestInfo) {
		List<BusinessServiceDetail> businessServiceDetails = businessServDetailService.searchBusinessServiceDetails(BusinessServiceDetailCriteria.builder().businessService(businessService).tenantId(tenantId).build(), requestInfo)
				.getBusinessServiceDetails();
		return businessServiceDetails.stream().collect(Collectors.toMap(BusinessServiceDetail::getCode, Function.identity()));
	}
	
	public BillResponse getBillResponse(List<Bill> bills) {
		BillResponse billResponse = new BillResponse();
		billResponse.setBill(bills);
		return billResponse;
	}

	/**
	 * Publishes the bill request to kafka topic and returns bill response
	 * 
	 * @param billRequest
	 * @return billResponse object containing bills from the request
	 */
	public BillResponse sendBillToKafka(BillRequest billRequest) {

		try {
			kafkaTemplate.send(appProps.getCreateBillTopic(), appProps.getCreateBillTopicKey(), billRequest);
		} catch (Exception e) {
			log.debug("BillService createAsync:" + e);
			throw new CustomException("EGBS_BILL_SAVE_ERROR", e.getMessage());

		}
		return getBillResponse(billRequest.getBills());
	}
	
	public BillResponse create(BillRequest billRequest) {
		billRepository.saveBill(billRequest);
		return getBillResponse(billRequest.getBills());
	}
	

	@Deprecated
	public BillResponse apportion(BillRequest billRequest) {
		return new BillResponse(responseFactory.getResponseInfo(billRequest.getRequestInfo(), HttpStatus.OK), billRepository.apportion(billRequest));
	}
}