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
package org.egov.demand.web.validator;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.egov.demand.model.BusinessServiceDetail;
import org.egov.demand.model.Demand;
import org.egov.demand.model.DemandCriteria;
import org.egov.demand.model.DemandDetail;
import org.egov.demand.model.TaxHeadMaster;
import org.egov.demand.model.TaxHeadMasterCriteria;
import org.egov.demand.model.TaxPeriod;
import org.egov.demand.repository.DemandRepository;
import org.egov.demand.repository.PayerRepository;
import org.egov.demand.service.BusinessServDetailService;
import org.egov.demand.service.TaxHeadMasterService;
import org.egov.demand.service.TaxPeriodService;
import org.egov.demand.web.contract.BusinessServiceDetailCriteria;
import org.egov.demand.web.contract.DemandRequest;
import org.egov.demand.web.contract.TaxPeriodCriteria;
import org.egov.demand.web.contract.User;
import org.egov.demand.web.contract.UserSearchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class DemandValidator implements Validator {

	@Autowired
	private TaxHeadMasterService taxHeadMasterService;

	@Autowired
	private PayerRepository ownerRepository;

	@Autowired
	private BusinessServDetailService businessServDetailService;

	@Autowired
	private TaxPeriodService taxPeriodService;

	@Autowired
	private DemandRepository demandRepository;

	@Override
	public boolean supports(Class<?> clazz) {

		return DemandRequest.class.equals(clazz);
	}

	@Override
	public void validate(Object target, Errors errors) {

		DemandRequest demandRequest = null;
		if (target instanceof DemandRequest)
			demandRequest = (DemandRequest) target;
		else
			throw new RuntimeException("Invalid Object type for Demand validator");
		validateDemand(demandRequest.getDemands(), errors);

		List<DemandDetail> demandDetails = new ArrayList<>();
		for (Demand demand : demandRequest.getDemands()) {
			demandDetails.addAll(demand.getDemandDetails());
		}
		validateDemandDetails(demandDetails, errors);
		validateTaxHeadMaster(demandRequest, errors);
		validateBusinessService(demandRequest, errors);
		validateTaxPeriod(demandRequest, errors);
		validateOwner(demandRequest, errors);
	}

	public void validateForUpdate(Object target, Errors errors) {

		DemandRequest demandRequest = null;
		if (target instanceof DemandRequest)
			demandRequest = (DemandRequest) target;
		else
			throw new RuntimeException("Invalid Object type for Demand validator");
		validateDemandForUpdate(demandRequest, errors);
		validateTaxHeadMaster(demandRequest, errors);
		validateBusinessService(demandRequest, errors);
		validateTaxPeriod(demandRequest, errors);
		validateOwner(demandRequest, errors);
	}

	private void validateDemandForUpdate(DemandRequest demandRequest, Errors errors) {

		List<Demand> demands = demandRequest.getDemands();
		String tenantId = demands.get(0).getTenantId();

		List<Demand> oldDemands = new ArrayList<>();
		List<DemandDetail> olddemandDetails = new ArrayList<>();
		List<Demand> newDemands = new ArrayList<>();
		List<DemandDetail> newDemandDetails = new ArrayList<>();

		for (Demand demand : demandRequest.getDemands()) {
			if (demand.getId() != null) {
				oldDemands.add(demand);
				for (DemandDetail demandDetail : demand.getDemandDetails()) {
					if (demandDetail.getId() != null)
						olddemandDetails.add(demandDetail);
					else
						newDemandDetails.add(demandDetail);
				}
			} else {
				newDemands.add(demand);
				newDemandDetails.addAll(demand.getDemandDetails());
			}
		}
		validateOldDemands(oldDemands, olddemandDetails, errors, tenantId);
		validateDemand(newDemands, errors);
		validateDemandDetails(newDemandDetails, errors);
	}

	private void validateOldDemands(List<Demand> oldDemands, List<DemandDetail> olddemandDetails, Errors errors,
			String tenantId) {

		Set<String> demandIds = oldDemands.stream().map(demand -> demand.getId()).collect(Collectors.toSet());
		DemandCriteria demandCriteria = DemandCriteria.builder().tenantId(tenantId).demandId(demandIds).build();
		Map<String, Demand> demandMap = demandRepository.getDemands(demandCriteria).stream()
				.collect(Collectors.toMap(Demand::getId, Function.identity()));
		Map<String, DemandDetail> dbDemandDetailMap = new HashMap<>();
		int index = 0;
		for (Demand demand : oldDemands) {
			Demand dbDemand = demandMap.get(demand.getId());
			if (dbDemand == null)
				errors.rejectValue("Demands[" + index + "].id", "DEMAND_INVALID_ID",
						"the given demandId value is invalid and cannot be updated");
			else {
				for (DemandDetail demandDetail : dbDemand.getDemandDetails()) {
					dbDemandDetailMap.put(demandDetail.getId(), demandDetail);
				}
			}
			index++;
		}

		for (DemandDetail demandDetail : olddemandDetails) {
			if (dbDemandDetailMap.get(demandDetail.getId()) == null)
				errors.rejectValue("Demands", "DEMAND_DETAIL_INVALID_ID", "the given demandDetailId value  : "
						+ demandDetail.getId() + " is invalid and cannot be updated");
		}
	}

	private void validateDemand(List<Demand> demands, Errors errors) {

		Map<String, Set<String>> businessConsumerValidatorMap = new HashMap<>();
		String tenatId = null;

		for (Demand demand : demands) {
			tenatId = demand.getTenantId();
			Set<String> consumerCodes = businessConsumerValidatorMap.get(demand.getBusinessService());
			if (consumerCodes != null)
				consumerCodes.add(demand.getConsumerCode());
			else {
				consumerCodes = new HashSet<>();
				consumerCodes.add(demand.getConsumerCode());
				businessConsumerValidatorMap.put(demand.getBusinessService(), consumerCodes);
			}
		}
		List<Demand> dbDemands = demandRepository.getDemandsForConsumerCodes(businessConsumerValidatorMap, tenatId);
		Map<String, List<Demand>> dbDemandMap = dbDemands.stream()
				.collect(Collectors.groupingBy(Demand::getConsumerCode, Collectors.toList()));

		int index = 0;
		if (!dbDemandMap.isEmpty()) {
			for (Demand demand : demands) {
				for (Demand demandFromMap : dbDemandMap.get(demand.getConsumerCode())) {
					if (demand.getTaxPeriodFrom().equals(demandFromMap.getTaxPeriodFrom())
							&& demand.getTaxPeriodTo().equals(demandFromMap.getTaxPeriodTo()))
						errors.rejectValue("Demands[" + index + "].consumerCode", "DEMAND_DUPLICATE_CONSUMERCODE",
								"the consumerCode value : " + demand.getConsumerCode() + " with tax period from "
										+ demand.getTaxPeriodFrom() + " and tax period to " + demand.getTaxPeriodTo()
										+ " already exists for businessService: " + demand.getBusinessService());
				}
				index++;
			}
		}
	}

	private void validateDemandDetails(List<DemandDetail> demandDetails, Errors errors) {

		
		for (DemandDetail demandDetail : demandDetails) {
			
			if (!"ADVANCE".equalsIgnoreCase(demandDetail.getTaxHeadMasterCode())) {
				BigDecimal tax = demandDetail.getTaxAmount();
				BigDecimal collection = demandDetail.getCollectionAmount();
				int i = tax.compareTo(collection);
				if (i < 0)
					errors.rejectValue("Demands", "", "DEMAND_DETAIL_COLLECTIONAMOUNT : " + collection
							+ " should not be greater than taxAmount : " + tax + " for demandDetail");
			}
		}
		 
	}

	private void validateTaxPeriod(DemandRequest demandRequest, Errors errors) {

		List<Demand> demands = demandRequest.getDemands();
		Long startDate = demands.get(0).getTaxPeriodFrom();
		Long endDate = demands.get(0).getTaxPeriodTo();
		String tenantId = demands.get(0).getTenantId();
		Set<String> businessServiceDetails = new HashSet<>();

		for (Demand demand : demands) {
			businessServiceDetails.add(demand.getBusinessService());
			if (startDate > demand.getTaxPeriodFrom())
				startDate = demand.getTaxPeriodFrom();
			if (endDate < demand.getTaxPeriodTo())
				endDate = demand.getTaxPeriodTo();
		}

		TaxPeriodCriteria taxPeriodCriteria = TaxPeriodCriteria.builder().service(businessServiceDetails)
				.fromDate(startDate).toDate(endDate).tenantId(tenantId).build();
		Map<String, List<TaxPeriod>> taxPeriodMap = taxPeriodService
				.searchTaxPeriods(taxPeriodCriteria, demandRequest.getRequestInfo()).getTaxPeriods().stream()
				.collect(Collectors.groupingBy(TaxPeriod::getService));

		int index = 0;
		for (Demand demand : demands) {
			List<TaxPeriod> taxPeriods = taxPeriodMap.get(demand.getBusinessService());
			if (taxPeriods != null) {
				TaxPeriod taxPeriod = taxPeriods.stream()
						.filter(t -> demand.getTaxPeriodFrom().compareTo(t.getFromDate()) >= 0
								&& demand.getTaxPeriodTo().compareTo(t.getToDate()) <= 0)
						.findAny().orElse(null);
				if (taxPeriod == null) {

					boolean isFromPeriodAvailable = false;
					boolean isToPeriodAvailable = false;

					for (TaxPeriod tp : taxPeriods) {
						if (tp.getFromDate().equals(demand.getTaxPeriodFrom()))
							isFromPeriodAvailable = true;
						if (tp.getToDate().equals(demand.getTaxPeriodTo()))
							isToPeriodAvailable = true;
					}
					if (!(isFromPeriodAvailable && isToPeriodAvailable))
						errors.rejectValue("Demands[" + index + "]", "DEMAND_BAD_TAXPERIOD",
								"the given taxPeriod value periodFrom : '" + demand.getTaxPeriodFrom()
										+ "and periodTo : " + demand.getTaxPeriodTo()
										+ "'in Demand is invalid, please give a valid taxPeriod");
				}
			} else {
				errors.rejectValue("Demands[" + index + "].businessService", "DEMAND_BAD_BUSINESS_SERVICE_TAXPERIOD",
						"no taxperiods found for value of Demand.businessService : " + demand.getBusinessService()
								+ " please give a valid businessService code");
			}
			index++;
		}
	}

	private void validateBusinessService(DemandRequest demandRequest, Errors errors) {

		Set<String> businessServiceSet = demandRequest.getDemands().stream().map(demand -> demand.getBusinessService())
				.collect(Collectors.toSet());
		BusinessServiceDetailCriteria businessServiceDetailCriteria = BusinessServiceDetailCriteria.builder()
				.tenantId(demandRequest.getDemands().get(0).getTenantId()).businessService(businessServiceSet).build();
		List<BusinessServiceDetail> businessServiceDetails = businessServDetailService
				.searchBusinessServiceDetails(businessServiceDetailCriteria, demandRequest.getRequestInfo())
				.getBusinessServiceDetails();
		if (businessServiceDetails.isEmpty())
			errors.rejectValue("Demands", "DEMAND_INVALID_BUSINESS_SERVICE",
					"no businessService is found for value of Demand.businessService, please give a valid businessService code");
		else {
			Map<String, BusinessServiceDetail> map = businessServiceDetails.stream()
					.collect(Collectors.toMap(BusinessServiceDetail::getBusinessService, Function.identity()));
			for (String businessService : businessServiceSet) {
				if (map.get(businessService) == null)
					errors.rejectValue("Demands", "DEMAND_INVALID_BUSINESS_SERVICE", "the given businessService value '"
							+ businessService
							+ "'of Demand.businessService is invalid, please give a valid businessService code");
			}
		}
	}

	private void validateTaxHeadMaster(DemandRequest demandRequest, Errors errors) {

		Map<String, Demand> codeDemandMap = new HashMap<>();
		for (Demand demand : demandRequest.getDemands()) {
			for (DemandDetail demandDetail : demand.getDemandDetails()) {
				codeDemandMap.put(demandDetail.getTaxHeadMasterCode(), demand);
			}
		}
		TaxHeadMasterCriteria taxHeadMasterCriteria = TaxHeadMasterCriteria.builder()
				.tenantId(demandRequest.getDemands().get(0).getTenantId()).code(codeDemandMap.keySet()).build();
		List<TaxHeadMaster> taxHeadMasters = taxHeadMasterService
				.getTaxHeads(taxHeadMasterCriteria, demandRequest.getRequestInfo()).getTaxHeadMasters();
		if (taxHeadMasters.isEmpty())
			errors.rejectValue("Demands", "DEMAND_INVALID_TAXHEADMASTERS",
					"no taxheadmasters found for the given code value DemandDetail.code, please give a valid code");
		else {
			Map<String, List<TaxHeadMaster>> taxHeadMap = taxHeadMasters.stream()
					.collect(Collectors.groupingBy(TaxHeadMaster::getCode, Collectors.toList()));
			for (String code : codeDemandMap.keySet()) {
				Demand demand = codeDemandMap.get(code);
				if (taxHeadMap.get(code) == null)
					errors.rejectValue("Demands", "DEMAND_INVALID_TAXHEADMASTERS", "the given code value '" + code
							+ "'of teaxheadmaster in DemandDetail.code is invalid, please give a valid code");
				else {
					TaxHeadMaster taxHeadMaster = taxHeadMasters.stream()
							.filter(t -> demand.getTaxPeriodFrom().compareTo(t.getValidFrom()) >= 0
									&& demand.getTaxPeriodTo().compareTo(t.getValidTill()) <= 0)
							.findAny().orElse(null);
					if (taxHeadMaster == null)
						errors.rejectValue("Demands", "DEMAND_INVALID_TAXHEADMASTERS_TAXPERIOD",
								" No TaxHeadMaster found for given code value '" + code + "' and from date'"
										+ demand.getTaxPeriodFrom() + "' and To date '" + demand.getTaxPeriodTo()
										+ "', please give valid code and period");
				}
			}
		}
	}

	private void validateOwner(DemandRequest demandRequest, Errors errors) {

		List<Demand> demands = demandRequest.getDemands();
		List<User> owners = null;
		List<Long> ownerIds = new ArrayList<>(demands.stream().filter(demand -> null != demand.getPayer())
				.map(demand -> demand.getPayer().getId()).collect(Collectors.toSet()));

		if (!CollectionUtils.isEmpty(ownerIds)) {

			UserSearchRequest userSearchRequest = UserSearchRequest.builder()
					.requestInfo(demandRequest.getRequestInfo()).id(ownerIds).tenantId(demands.get(0).getTenantId())
					.userType("CITIZEN").pageSize(500).build();

			log.info("The user search req : " + userSearchRequest);
			owners = ownerRepository.getPayers(userSearchRequest);
		}

		if (!CollectionUtils.isEmpty(owners)) {

			Map<Long, Long> ownerMap = owners.stream().collect(Collectors.toMap(User::getId, User::getId));
			for (Long rsId : ownerIds) {
				if (null != rsId && ownerMap.get(rsId) == null)
					errors.rejectValue("demands", "DEMAND_INVALID_OWNER", "the given user id value '" + rsId
							+ "' in Owner.id is invalid, please give a valid user id");
			}
		}
	}

	public void validateDemandCriteria(DemandCriteria demandCriteria, Errors errors) {

		if (demandCriteria.getDemandId() == null && demandCriteria.getConsumerCode() == null
				&& demandCriteria.getEmail() == null && demandCriteria.getMobileNumber() == null
				&& demandCriteria.getBusinessService() == null && demandCriteria.getDemandFrom() == null
				&& demandCriteria.getDemandTo() == null && demandCriteria.getType() == null)
			errors.rejectValue("businessService", "", " Any one of the fields additional to tenantId is mandatory");
		else if (demandCriteria.getReceiptRequired()
				&& (demandCriteria.getBusinessService() == null || demandCriteria.getConsumerCode() == null))
			errors.rejectValue("businessService", "",
					"For searching collected receipts, businessService and consumerCode are mandatory");
	}

}
