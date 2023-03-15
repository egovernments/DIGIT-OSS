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
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */
package org.egov.demand.service;

import static org.egov.demand.util.Constants.ADVANCE_TAXHEAD_JSONPATH_CODE;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.amendment.model.Amendment;
import org.egov.demand.amendment.model.AmendmentCriteria;
import org.egov.demand.amendment.model.AmendmentUpdate;
import org.egov.demand.amendment.model.enums.AmendmentStatus;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.ApportionDemandResponse;
import org.egov.demand.model.AuditDetails;
import org.egov.demand.model.BillV2.BillStatus;
import org.egov.demand.model.Demand;
import org.egov.demand.model.DemandApportionRequest;
import org.egov.demand.model.DemandCriteria;
import org.egov.demand.model.DemandDetail;
import org.egov.demand.model.PaymentBackUpdateAudit;
import org.egov.demand.model.UpdateBillCriteria;
import org.egov.demand.repository.AmendmentRepository;
import org.egov.demand.repository.BillRepositoryV2;
import org.egov.demand.repository.DemandRepository;
import org.egov.demand.repository.ServiceRequestRepository;
import org.egov.demand.util.DemandEnrichmentUtil;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.DemandRequest;
import org.egov.demand.web.contract.DemandResponse;
import org.egov.demand.web.contract.User;
import org.egov.demand.web.contract.UserResponse;
import org.egov.demand.web.contract.UserSearchRequest;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.egov.demand.web.validator.DemandValidatorV1;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DemandService {

	@Autowired
	private DemandRepository demandRepository;

	@Autowired
	private ApplicationProperties applicationProperties;

	@Autowired
	private ResponseFactory responseInfoFactory;

	@Autowired
	private DemandEnrichmentUtil demandEnrichmentUtil;
	
	@Autowired
	private ServiceRequestRepository serviceRequestRepository;
	
	@Autowired
	private AmendmentRepository amendmentRepository;
	
	@Autowired
	private BillRepositoryV2 billRepoV2;
	
	@Autowired
	private ObjectMapper mapper;
	
	@Autowired
	private Util util;

	@Autowired
	private DemandValidatorV1 demandValidatorV1;
	
	/**
	 * Method to create new demand 
	 * 
	 * generates ids and saves to the repository
	 * 
	 * @param demandRequest
	 * @return
	 */
	public DemandResponse create(DemandRequest demandRequest) {

		DocumentContext mdmsData = util.getMDMSData(demandRequest.getRequestInfo(),
				demandRequest.getDemands().get(0).getTenantId());

		demandValidatorV1.validatedemandForCreate(demandRequest, true, mdmsData);

		log.info("the demand request in create async : {}", demandRequest);

		RequestInfo requestInfo = demandRequest.getRequestInfo();
		List<Demand> demands = demandRequest.getDemands();
		AuditDetails auditDetail = util.getAuditDetail(requestInfo);
		
		List<AmendmentUpdate> amendmentUpdates = consumeAmendmentIfExists(demands, auditDetail);
		generateAndSetIdsForNewDemands(demands, auditDetail);

		List<Demand> demandsToBeCreated = new ArrayList<>();
		List<Demand> demandToBeUpdated = new ArrayList<>();

		String businessService = demandRequest.getDemands().get(0).getBusinessService();
		Boolean isAdvanceAllowed = util.getIsAdvanceAllowed(businessService, mdmsData);

		if(isAdvanceAllowed){
			apportionAdvanceIfExist(demandRequest,mdmsData,demandsToBeCreated,demandToBeUpdated);
		}
		else {
			demandsToBeCreated.addAll(demandRequest.getDemands());
		}

		save(new DemandRequest(requestInfo,demandsToBeCreated));
		if (!CollectionUtils.isEmpty(amendmentUpdates))
			amendmentRepository.updateAmendment(amendmentUpdates);

		if(!CollectionUtils.isEmpty(demandToBeUpdated))
			update(new DemandRequest(requestInfo,demandToBeUpdated), null);
		
		billRepoV2.updateBillStatus(
				UpdateBillCriteria.builder()
				.statusToBeUpdated(BillStatus.EXPIRED)
				.businessService(businessService)
				.consumerCodes(demands.stream().map(Demand::getConsumerCode).collect(Collectors.toSet()))
				.tenantId(demands.get(0).getTenantId())
				.build()
				);
		return new DemandResponse(responseInfoFactory.getResponseInfo(requestInfo, HttpStatus.CREATED), demands);
	}

	/**
	 * Method to generate and set ids, Audit details to the demand 
	 * and demand-detail object
	 * 
	 */
	private void generateAndSetIdsForNewDemands(List<Demand> demands, AuditDetails auditDetail) {

		/*
		 * looping demands to set ids and collect demand details in another list
		 */
		for (Demand demand : demands) {

			String demandId = UUID.randomUUID().toString();
			String tenantId = demand.getTenantId();
			demand.setAuditDetails(auditDetail);
			demand.setId(demandId);

			for (DemandDetail demandDetail : demand.getDemandDetails()) {

				if (Objects.isNull(demandDetail.getCollectionAmount()))
					demandDetail.setCollectionAmount(BigDecimal.ZERO);
				demandDetail.setId(UUID.randomUUID().toString());
				demandDetail.setAuditDetails(auditDetail);
				demandDetail.setTenantId(tenantId);
				demandDetail.setDemandId(demandId);
			}
		}
	}

	
	/**
	 * Update method for demand flow 
	 * 
	 * updates the existing demands and inserts in case of new
	 * 
	 * @param demandRequest demand request object to be updated
	 * @return
	 */
	public DemandResponse updateAsync(DemandRequest demandRequest, PaymentBackUpdateAudit paymentBackUpdateAudit) {

		log.debug("the demand service : " + demandRequest);
		DocumentContext mdmsData = util.getMDMSData(demandRequest.getRequestInfo(),
				demandRequest.getDemands().get(0).getTenantId());

		demandValidatorV1.validateForUpdate(demandRequest, mdmsData);

		RequestInfo requestInfo = demandRequest.getRequestInfo();
		List<Demand> demands = demandRequest.getDemands();
		AuditDetails auditDetail = util.getAuditDetail(requestInfo);

		List<Demand> newDemands = new ArrayList<>();

		for (Demand demand : demands) {

			String demandId = demand.getId();

			if (StringUtils.isEmpty(demandId)) {
				/*
				 * If demand id is empty then gen new demand Id
				 */
				newDemands.add(demand);
			} else {

				demand.setAuditDetails(auditDetail);
				for (DemandDetail detail : demand.getDemandDetails()) {

					if (StringUtils.isEmpty(detail.getId())) {
						/*
						 * If id is empty for demand detail treat it as new
						 */
						detail.setId(UUID.randomUUID().toString());
						detail.setCollectionAmount(BigDecimal.ZERO);
					}
					detail.setAuditDetails(auditDetail);
					detail.setDemandId(demandId);
					detail.setTenantId(demand.getTenantId());
				}
			}
			util.updateDemandPaymentStatus(demand, null != paymentBackUpdateAudit);
		}

		generateAndSetIdsForNewDemands(newDemands, auditDetail);

		update(demandRequest, paymentBackUpdateAudit);
		String businessService = demands.get(0).getBusinessService();
		String tenantId = demands.get(0).getTenantId();
		
		UpdateBillCriteria updateBillCriteria = UpdateBillCriteria.builder()
				.consumerCodes(demands.stream().map(Demand::getConsumerCode).collect(Collectors.toSet()))
				.businessService(businessService)
				.tenantId(tenantId)
				.build();
		
		if (ObjectUtils.isEmpty(paymentBackUpdateAudit)) {
			
			updateBillCriteria.setStatusToBeUpdated(BillStatus.EXPIRED);
			billRepoV2.updateBillStatus(updateBillCriteria);
		} else {
			
			updateBillCriteria.setStatusToBeUpdated(BillStatus.PAID);
			billRepoV2.updateBillStatus(updateBillCriteria);
		}
		// producer.push(applicationProperties.getDemandIndexTopic(), demandRequest);
		return new DemandResponse(responseInfoFactory.getResponseInfo(requestInfo, HttpStatus.CREATED), demands);
	}


	/**
	 * Search method to fetch demands from DB
	 * 
	 * @param demandCriteria
	 * @param requestInfo
	 * @return
	 */
	public List<Demand> getDemands(DemandCriteria demandCriteria, RequestInfo requestInfo) {

		demandValidatorV1.validateDemandCriteria(demandCriteria, requestInfo);

		UserSearchRequest userSearchRequest = null;
		List<User> payers = null;
		List<Demand> demands = null;
		
		String userUri = applicationProperties.getUserServiceHostName()
				.concat(applicationProperties.getUserServiceSearchPath());
		
		/*
		 * user type is CITIZEN by default because only citizen can have demand or payer can be null
		 */
		String citizenTenantId = demandCriteria.getTenantId().split("\\.")[0];
		
		/*
		 * If payer related data is provided first then user search has to be made first followed by demand search
		 */
		if (demandCriteria.getEmail() != null || demandCriteria.getMobileNumber() != null) {
			
			userSearchRequest = UserSearchRequest.builder().requestInfo(requestInfo)
					.tenantId(citizenTenantId).emailId(demandCriteria.getEmail())
					.mobileNumber(demandCriteria.getMobileNumber()).build();
			
			payers = mapper.convertValue(serviceRequestRepository.fetchResult(userUri, userSearchRequest), UserResponse.class).getUser();
			
			if(CollectionUtils.isEmpty(payers))
				return new ArrayList<>();
			
			Set<String> ownerIds = payers.stream().map(User::getUuid).collect(Collectors.toSet());
			demandCriteria.setPayer(ownerIds);
			demands = demandRepository.getDemands(demandCriteria);
			
		} else {
			
			/*
			 * If no payer related data given then search demand first then enrich payer(user) data
			 */
			demands = demandRepository.getDemands(demandCriteria);
			if (!demands.isEmpty()) {

				Set<String> payerUuids = demands.stream().filter(demand -> null != demand.getPayer())
						.map(demand -> demand.getPayer().getUuid()).collect(Collectors.toSet());

				if (!CollectionUtils.isEmpty(payerUuids)) {

					userSearchRequest = UserSearchRequest.builder().requestInfo(requestInfo).uuid(payerUuids).build();

					payers = mapper.convertValue(serviceRequestRepository.fetchResult(userUri, userSearchRequest),
							UserResponse.class).getUser();
				}
			}
		}
		
		if (!CollectionUtils.isEmpty(demands) && !CollectionUtils.isEmpty(payers))
			demands = demandEnrichmentUtil.enrichPayer(demands, payers);

		return demands;
	}

	public void save(DemandRequest demandRequest) {
		demandRepository.save(demandRequest);
	}

	public void update(DemandRequest demandRequest, PaymentBackUpdateAudit paymentBackUpdateAudit) {
		demandRepository.update(demandRequest, paymentBackUpdateAudit);
	}


	/**
	 * Calls the demand apportion API if any advance amoount is available for that comsumer code
	 * @param demandRequest The demand request for create
	 * @param mdmsData The master data for billing service
	 * @param demandToBeCreated The list which maintains the demand that has to be created in the system
	 * @param demandToBeUpdated The list which maintains the demand that has to be updated in the system
	 */
	private void apportionAdvanceIfExist(DemandRequest demandRequest, DocumentContext mdmsData,List<Demand> demandToBeCreated,List<Demand> demandToBeUpdated){
		List<Demand> demands = demandRequest.getDemands();
		RequestInfo requestInfo = demandRequest.getRequestInfo();

		for(Demand demand : demands) {
			String businessService = demand.getBusinessService();
			String consumerCode = demand.getConsumerCode();
			String tenantId = demand.getTenantId();

			// Searching demands based on consumer code of the current demand (demand which has to be created)
			DemandCriteria searchCriteria = DemandCriteria.builder().tenantId(tenantId).consumerCode(Collections.singleton(consumerCode)).businessService(businessService).build();
			List<Demand> demandsFromSearch = demandRepository.getDemands(searchCriteria);

			// If no demand is found means there is no advance available. The current demand is added for creation
			if (CollectionUtils.isEmpty(demandsFromSearch)){
				demandToBeCreated.add(demand);
				continue;
			}

			// Fetch the demands containing advance amount
			List<Demand> demandsToBeApportioned = getDemandsContainingAdvance(demandsFromSearch, mdmsData);

			// If no demand is found with advance amount the code continues to next demand and adds the current demand for creation
			if(CollectionUtils.isEmpty(demandsToBeApportioned)){
				demandToBeCreated.add(demand);
				continue;
			}

			// The current demand is added to get apportioned
			demandsToBeApportioned.add(demand);

			DemandApportionRequest apportionRequest = DemandApportionRequest.builder().requestInfo(requestInfo).demands(demandsToBeApportioned).tenantId(tenantId).build();

			Object response = serviceRequestRepository.fetchResult(util.getApportionURL(), apportionRequest);
			ApportionDemandResponse apportionDemandResponse = mapper.convertValue(response, ApportionDemandResponse.class);

			// Only the current demand is to be created rest all are to be updated
			apportionDemandResponse.getDemands().forEach(demandFromResponse -> {
				if(demandFromResponse.getId().equalsIgnoreCase(demand.getId()))
					demandToBeCreated.add(demandFromResponse);
				else demandToBeUpdated.add(demandFromResponse);
			});
		}

	}


	/**
	 * Returns demands which has advance amount avaialable for apportion
	 * @param demands List of demands from which demands with advance has to be picked
	 * @param mdmsData Master Data for billing service
	 * @return
	 */
	private List<Demand> getDemandsContainingAdvance(List<Demand> demands,DocumentContext mdmsData){

		Set<Demand> demandsWithAdvance = new HashSet<>();

		// Create the jsonPath to fetch the advance taxhead for the given businessService
		String businessService = demands.get(0).getBusinessService();
		String jsonpath = ADVANCE_TAXHEAD_JSONPATH_CODE;
		jsonpath = jsonpath.replace("{}",businessService);

		// Apply the jsonPath on the master Data to fetch the value. The output will be an array with single element
		List<String> taxHeads = mdmsData.read(jsonpath);

		if(CollectionUtils.isEmpty(taxHeads))
			throw new CustomException("NO TAXHEAD FOUND","No Advance taxHead found for businessService: "+businessService);

		String advanceTaxHeadCode =  taxHeads.get(0);

		/*
		* Loop through each demand and each demandDetail to find the demandDetail for which advance amount is available
		* */

		for (Demand demand : demands){

			for(DemandDetail demandDetail : demand.getDemandDetails()){

				if(demandDetail.getTaxHeadMasterCode().equalsIgnoreCase(advanceTaxHeadCode)
						&& demandDetail.getTaxAmount().compareTo(demandDetail.getCollectionAmount()) != 0){
					demandsWithAdvance.add(demand);
					break;
				}
			}
		}

		return new ArrayList<>(demandsWithAdvance);
	}
	
	/**
	 * Method to add demand details from amendment if exists in DB
	 * @param demandRequest
	 */
	private List<AmendmentUpdate> consumeAmendmentIfExists(List<Demand> demands, AuditDetails auditDetails) {

		List<AmendmentUpdate> updateListForConsumedAmendments = new ArrayList<>();
		Set<String> consumerCodes = demands.stream().map(Demand::getConsumerCode).collect(Collectors.toSet());

		/*
		 * Search amendments for all consumer-codes and keep in map of list based on consumer-codes
		 */
		AmendmentCriteria amendmentCriteria = AmendmentCriteria.builder()
				.tenantId(demands.get(0).getTenantId())
				.status(Stream.of(AmendmentStatus.ACTIVE.toString()).collect(Collectors.toSet()))
				.consumerCode(consumerCodes)
				.build();
		List<Amendment> amendmentsFromSearch = amendmentRepository.getAmendments(amendmentCriteria);
		Map<String, List<Amendment>> mapOfConsumerCodeAndAmendmentsList = amendmentsFromSearch.stream()
				.collect(Collectors.groupingBy(Amendment::getConsumerCode)); 
		
		/*
		 * Add demand-details in to demand from all amendments existing for that consumer-code
		 * 
		 * Add the amendment to update list for consumed
		 */
		for (Demand demand : demands) {
		
			
			List<Amendment> amendments = mapOfConsumerCodeAndAmendmentsList.get(demand.getConsumerCode());
			if (CollectionUtils.isEmpty(amendments))
				continue;
			
			for (Amendment amendment : amendments) {
				
				demand.getDemandDetails().addAll(amendment.getDemandDetails());
				
				AmendmentUpdate amendmentUpdate = AmendmentUpdate.builder()
						.additionalDetails(amendment.getAdditionalDetails())
						.amendedDemandId(demand.getId())
						.amendmentId(amendment.getAmendmentId())
						.auditDetails(auditDetails)
						.status(AmendmentStatus.CONSUMED)
						.tenantId(demand.getTenantId())
						.build();
				updateListForConsumedAmendments.add(amendmentUpdate);
			}
		}

		return updateListForConsumedAmendments;
	}
	
}