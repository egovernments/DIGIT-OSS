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

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.AuditDetails;
import org.egov.demand.model.Bill;
import org.egov.demand.model.BillDetail;
import org.egov.demand.model.ConsolidatedTax;
import org.egov.demand.model.Demand;
import org.egov.demand.model.DemandCriteria;
import org.egov.demand.model.DemandDetail;
import org.egov.demand.model.DemandDetailCriteria;
import org.egov.demand.model.DemandDue;
import org.egov.demand.model.DemandDueCriteria;
import org.egov.demand.model.DemandUpdateMisRequest;
import org.egov.demand.repository.DemandRepository;
import org.egov.demand.repository.ServiceRequestRepository;
import org.egov.demand.util.DemandEnrichmentUtil;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.BillRequest;
import org.egov.demand.web.contract.DemandDetailResponse;
import org.egov.demand.web.contract.DemandDueResponse;
import org.egov.demand.web.contract.DemandRequest;
import org.egov.demand.web.contract.DemandResponse;
import org.egov.demand.web.contract.User;
import org.egov.demand.web.contract.UserResponse;
import org.egov.demand.web.contract.UserSearchRequest;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.egov.tracer.kafka.LogAwareKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DemandService {

	@Autowired
	private DemandRepository demandRepository;

	@Autowired
	private LogAwareKafkaTemplate<String, Object> kafkaTemplate;

	@Autowired
	private ApplicationProperties applicationProperties;

	@Autowired
	private ResponseFactory responseInfoFactory;

	@Autowired
	private DemandEnrichmentUtil demandEnrichmentUtil;
	
	@Autowired
	private ServiceRequestRepository serviceRequestRepository;
	
	@Autowired
	private ObjectMapper mapper;
	
	@Autowired
	private Util util;
	
	/**
	 * Method to create new demand 
	 * 
	 * generates ids and saves to the repositroy
	 * 
	 * @param demandRequest
	 * @return
	 */
	public DemandResponse create(DemandRequest demandRequest) {

		log.info("the demand request in create async : {}", demandRequest);

		RequestInfo requestInfo = demandRequest.getRequestInfo();
		List<Demand> demands = demandRequest.getDemands();
		AuditDetails auditDetail = util.getAuditDetail(requestInfo);

		generateAndSetIdsForNewDemands(demands, auditDetail);
		save(demandRequest);
		//producer.push(applicationProperties.getDemandIndexTopic(), demandRequest);
		return new DemandResponse(responseInfoFactory.getResponseInfo(requestInfo, HttpStatus.CREATED), demands);
	}

	/**
	 * Method to generate and set ids, Audit details to the demand 
	 * and demand-detail object
	 * 
	 * @param demandRequest Demand request from the create/update flow
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
	public DemandResponse updateAsync(DemandRequest demandRequest) {

		log.debug("the demand service : " + demandRequest);

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
		}

		generateAndSetIdsForNewDemands(newDemands, auditDetail);

		update(demandRequest);
		//producer.push(applicationProperties.getDemandIndexTopic(), demandRequest);
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

	public void update(DemandRequest demandRequest) {
		demandRepository.update(demandRequest);
	}
	
	/*
	 * 
	 * 
	 * @deprecated methods
	 * 
	 * 
	 * 
	 */
	
	@Deprecated
	public void saveCollectedReceipts(BillRequest billRequest) {
		List<BillDetail> billDetails = new ArrayList<>();
		for (Bill bill : billRequest.getBills()) {
			for (BillDetail detail : bill.getBillDetails())
				billDetails.add(detail);
		}
		demandRepository.saveCollectedReceipts(billDetails, billRequest.getRequestInfo());
	}
	
	/**
	 * Method to update only the collection amount in a demand
	 * 
	 * @param demandRequest
	 * @return
	 */
	@Deprecated
	public DemandResponse updateCollection(DemandRequest demandRequest) {

		log.debug("the demand service : " + demandRequest);
		RequestInfo requestInfo = demandRequest.getRequestInfo();
		List<Demand> demands = demandRequest.getDemands();
		AuditDetails auditDetail = util.getAuditDetail(requestInfo);

		Map<String, Demand> demandMap = demands.stream().collect(Collectors.toMap(Demand::getId, Function.identity()));
		Map<String, DemandDetail> demandDetailMap = new HashMap<>();
		for (Demand demand : demands) {
			for (DemandDetail demandDetail : demand.getDemandDetails())
				demandDetailMap.put(demandDetail.getId(), demandDetail);
		}
		DemandCriteria demandCriteria = DemandCriteria.builder().demandId(demandMap.keySet())
				.tenantId(demands.get(0).getTenantId()).build();
		List<Demand> existingDemands = demandRepository.getDemands(demandCriteria);
		 
		for (Demand demand : existingDemands) {

			AuditDetails demandAuditDetail = demand.getAuditDetails();
			demandAuditDetail.setLastModifiedBy(auditDetail.getLastModifiedBy());
			demandAuditDetail.setLastModifiedTime(auditDetail.getLastModifiedTime());

			for (DemandDetail demandDetail : demand.getDemandDetails()) {
				DemandDetail demandDetail2 = demandDetailMap.get(demandDetail.getId());
				BigDecimal tax = demandDetail.getTaxAmount().subtract(demandDetail2.getCollectionAmount());
				if(tax.doubleValue()>=0){
				//demandDetail.setTaxAmount(tax);
				demandDetail.setCollectionAmount(demandDetail.getCollectionAmount().add(demandDetail2.getCollectionAmount()));
				}
				
				AuditDetails demandDetailAudit = demandDetail.getAuditDetails();
				demandDetailAudit.setLastModifiedBy(auditDetail.getLastModifiedBy());
				demandDetailAudit.setLastModifiedTime(auditDetail.getLastModifiedTime());
			}
		}
		demandRequest.setDemands(existingDemands);
		kafkaTemplate.send(applicationProperties.getUpdateDemandTopic(), demandRequest);
		return new DemandResponse(responseInfoFactory.getResponseInfo(requestInfo, HttpStatus.CREATED),
				existingDemands);
	}
	
	@Deprecated
	/**
	 * Method to search only demand details
	 * 
	 * @param demandDetailCriteria
	 * @param requestInfo
	 * @return
	 */
	public DemandDetailResponse getDemandDetails(DemandDetailCriteria demandDetailCriteria, RequestInfo requestInfo) {

		return new DemandDetailResponse(responseInfoFactory.getResponseInfo(requestInfo, HttpStatus.OK),
				demandRepository.getDemandDetails(demandDetailCriteria));
	}
	
	@Deprecated
	//Demand update consumer code (update mis)
	public DemandResponse updateMISAsync(DemandUpdateMisRequest demandRequest) {

		kafkaTemplate.send(applicationProperties.getUpdateMISTopicName(), demandRequest);

		return new DemandResponse(responseInfoFactory.getResponseInfo(new RequestInfo(), HttpStatus.CREATED), null);
	}
	
	@Deprecated
	//update mis update method calling from kafka
	public void updateMIS(DemandUpdateMisRequest demandRequest){
		demandRepository.updateMIS(demandRequest);
	}
	
	@Deprecated
	public DemandDueResponse getDues(DemandDueCriteria demandDueCriteria, RequestInfo requestInfo) {
		
		Long currDate = new Date().getTime();
		Double currTaxAmt = 0d;
		Double currCollAmt = 0d;
		Double arrTaxAmt = 0d;
		Double arrCollAmt = 0d;

		DemandCriteria demandCriteria = DemandCriteria.builder().tenantId(demandDueCriteria.getTenantId())
				.businessService(demandDueCriteria.getBusinessService())
				.consumerCode(demandDueCriteria.getConsumerCode()).receiptRequired(false).build();
		
		List<Demand> demands = getDemands(demandCriteria, requestInfo);
		for (Demand demand : demands) {
			if (demand.getTaxPeriodFrom() <= currDate && currDate <= demand.getTaxPeriodTo()) {
				for (DemandDetail detail : demand.getDemandDetails()) {
					currTaxAmt = currTaxAmt + detail.getTaxAmount().doubleValue();
					currCollAmt = currCollAmt + detail.getCollectionAmount().doubleValue();
				}
			} else if(currDate > demand.getTaxPeriodTo()){
				for (DemandDetail detail : demand.getDemandDetails()) {
					arrTaxAmt = arrTaxAmt + detail.getTaxAmount().doubleValue();
					arrCollAmt = arrCollAmt + detail.getCollectionAmount().doubleValue();
				}
			}
		}
		ConsolidatedTax consolidatedTax = ConsolidatedTax.builder().arrearsBalance(arrTaxAmt - arrCollAmt)
				.currentBalance(currTaxAmt - currCollAmt).arrearsDemand(arrTaxAmt).arrearsCollection(arrCollAmt)
				.currentDemand(currTaxAmt).currentCollection(currCollAmt).build();
		
		DemandDue due = DemandDue.builder().consolidatedTax(consolidatedTax).demands(demands).build();

		return new DemandDueResponse(responseInfoFactory.getResponseInfo(new RequestInfo(), HttpStatus.OK), due);
	}
	
	
}