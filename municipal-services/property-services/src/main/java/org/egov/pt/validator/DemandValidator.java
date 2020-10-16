package org.egov.pt.validator;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Demand;
import org.egov.pt.models.DemandDetail;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.web.contracts.DemandResponse;
import org.egov.pt.web.contracts.RequestInfoWrapper;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class DemandValidator {

	@Autowired
	private PropertyConfiguration config;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	private static <T> boolean listEqualsIgnoreOrder(List<T> list1, List<T> list2) {
		return new HashSet<>(list1).equals(new HashSet<>(list2));
	}

	public void validateAndfilterDemands(List<Demand> demands, String propertyId, String tenantId) {
		Map<String, DemandDetail> demandDetailMap = new HashMap<>();
		Map<String, String> errorMap = new HashMap<>();

		List<Demand> dbDemands = fetchDBDemandsByConsumerCode(propertyId, tenantId);
		if (dbDemands != null && !dbDemands.isEmpty()) {
			throw new CustomException("DUPLICATE_DEMAND", "Demand already exists for the given property.");
		}
		validateDemandDetails(demands, errorMap);
		if (!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);

		for (Demand demand : demands) {
			if (!propertyId.equalsIgnoreCase(demand.getConsumerCode())) {
				throw new CustomException("INVALID_DEMAND", "The demand is not matching with the property");
			}
			demandDetailMap.clear();
			for (DemandDetail dmdDetail : demand.getDemandDetails()) {
				if (dmdDetail.getTaxAmount() == null)
					dmdDetail.setTaxAmount(BigDecimal.ZERO);
				if (dmdDetail.getCollectionAmount() == null)
					dmdDetail.setCollectionAmount(BigDecimal.ZERO);
				demandDetailMap.put(dmdDetail.getTaxHeadMasterCode(), dmdDetail);
			}
			demand.setDemandDetails(new ArrayList<>(demandDetailMap.values()));
		}

	}

	public void validateLegacyDemands(List<Demand> demands, String propertyId, String tenantId) {

		List<String> demandIds = new ArrayList<>();
		Map<String, String> errorMap = new HashMap<>();

		for (Demand demand : demands) {
			if (!propertyId.equalsIgnoreCase(demand.getConsumerCode())) {
				throw new CustomException("INVALID_DEMAND", "The demand is not matching with the property");
			}
			if (demand.getId() != null) {
				demandIds.add(demand.getId());
			}
		}
		validateDemandDetailsForUpdate(demands, errorMap);
		if (!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);

		List<Demand> dbDemands = fetchDBDemandsByConsumerCode(propertyId, tenantId);
		List<String> dmdIdsFromDB = dbDemands.stream().map(Demand::getId).collect(Collectors.toList());

		if (!listEqualsIgnoreOrder(dmdIdsFromDB, demandIds)) {
			throw new CustomException("INVALID_DEMAND", "The demand is missing for the property");
		}
	}

	private void validateDemandDetailsForUpdate(List<Demand> demands, Map<String, String> errorMap) {

		Map<String, DemandDetail> demandDetailMap = new HashMap<>();
		for (Demand demand : demands) {
			demandDetailMap.clear();
			for (DemandDetail dmdDetail : demand.getDemandDetails()) {
				if (demandDetailMap.containsKey(dmdDetail.getTaxHeadMasterCode()))
					throw new CustomException("DUPLICATE_DEMAND", "Duplicate demand is added.");
				else {
					if (dmdDetail.getTaxAmount() == null)
						dmdDetail.setTaxAmount(BigDecimal.ZERO);
					if (dmdDetail.getCollectionAmount() == null)
						dmdDetail.setCollectionAmount(BigDecimal.ZERO);
					demandDetailMap.put(dmdDetail.getTaxHeadMasterCode(), dmdDetail);
				}
			}
		}
		validateDemandDetails(demands, errorMap);
	}

	private void validateDemandDetails(List<Demand> demands, Map<String, String> errorMap) {

		for (Demand demand : demands) {
			BigDecimal totalTax = BigDecimal.ZERO;
			BigDecimal totalCollection = BigDecimal.ZERO;
			for (DemandDetail demandDetail : demand.getDemandDetails()) {

				BigDecimal tax = demandDetail.getTaxAmount();
				BigDecimal collection = demandDetail.getCollectionAmount();
				if (tax.compareTo(BigDecimal.ZERO) >= 0
						&& (tax.compareTo(collection) < 0 || collection.compareTo(BigDecimal.ZERO) < 0)) {
					errorMap.put("INVALID_DEMAND_DEATIL",
							"collection amount cannot not be greater than taxAmount or Negative in case of positive tax");
				} else if (tax.compareTo(BigDecimal.ZERO) < 0 && collection.compareTo(BigDecimal.ZERO) != 0
						&& collection.compareTo(tax) != 0) {
					errorMap.put("INVALID_DEMAND_DEATIL",
							"collection amount should be equal to 'ZERO' or tax amount in case of negative Tax");

				}
				totalTax.add(tax);
				totalCollection.add(collection);
			}
			if (totalCollection.compareTo(totalTax) > 0) {
				errorMap.put("INVALID_DEMAND_COLLECTION",
						"Total tax collection should not be greater than total tax for the year.");

			}
		}
	}

	public List<Demand> fetchDBDemandsByConsumerCode(final String propertyId, final String tenantId) {
		StringBuilder uri = new StringBuilder(config.getEgbsHost()).append(config.getEgbsSearchDemand())
				.append("?tenantId=").append(tenantId).append("&consumerCode=").append(propertyId);
		Object res;
		try {
			res = serviceRequestRepository.fetchResult(uri, new RequestInfoWrapper()).orElse(null);
		} catch (ServiceCallException e) {
			throw e;
		}
		DemandResponse demandRes = mapper.convertValue(res, DemandResponse.class);
		return demandRes.getDemands();
	}

}
