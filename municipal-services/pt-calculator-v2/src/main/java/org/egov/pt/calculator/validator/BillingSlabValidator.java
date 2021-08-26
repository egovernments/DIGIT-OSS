package org.egov.pt.calculator.validator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.jayway.jsonpath.JsonPath;

import org.apache.commons.lang3.StringUtils;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.pt.calculator.repository.PTCalculatorRepository;
import org.egov.pt.calculator.service.BillingSlabService;
import org.egov.pt.calculator.util.BillingSlabConstants;
import org.egov.pt.calculator.util.BillingSlabUtils;
import org.egov.pt.calculator.web.models.BillingSlab;
import org.egov.pt.calculator.web.models.BillingSlabReq;
import org.egov.pt.calculator.web.models.BillingSlabRes;
import org.egov.pt.calculator.web.models.BillingSlabSearchCriteria;
import org.egov.tracer.model.CustomException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BillingSlabValidator {

	@Autowired
	private BillingSlabUtils billingSlabUtils;

	@Autowired
	private PTCalculatorRepository repository;

	@Autowired
	private BillingSlabService billingSlabService;

	@Value("${egov.location.host}")
    private String locationHost;

    @Value("${egov.location.context.path}")
    private String locationContextPath;

    @Value("${egov.location.endpoint}")
    private String locationEndpoint;
	
	public void validateCreate(BillingSlabReq billingSlabReq) {
		Map<String, String> errorMap = new HashMap<>();
		validateIfTenantIdIsUnique(billingSlabReq, errorMap);
		validateDuplicateBillingSlabs(billingSlabReq, errorMap);
		fetchAndvalidateMDMSCodes(billingSlabReq, errorMap);
		if (!CollectionUtils.isEmpty(errorMap)) {
			throw new CustomException(errorMap);
		}
	}

	public void validateUpdate(BillingSlabReq billingSlabReq) {
		Map<String, String> errorMap = new HashMap<>();
		validateIfTenantIdIsUnique(billingSlabReq, errorMap);
		checkIfBillingSlabsExist(billingSlabReq, errorMap);
		fetchAndvalidateMDMSCodes(billingSlabReq, errorMap);
		if (!CollectionUtils.isEmpty(errorMap)) {
			throw new CustomException(errorMap);
		}
	}
	
	
	public void validateIfTenantIdIsUnique(BillingSlabReq billingSlabReq, Map<String, String> errorMap) {
		Set<String> tenantIds = billingSlabReq.getBillingSlab().parallelStream().map(BillingSlab::getTenantId)
				.collect(Collectors.toSet());
		if(tenantIds.isEmpty())
			errorMap.put("EG_PT_INVALID_INPUT", "Input must have atleast one billing slab");
		else if(tenantIds.size() > 1)
			errorMap.put("EG_PT_INVALID_INPUT", "All billing slabs must belong to same tenant");
		
		if (!CollectionUtils.isEmpty(errorMap)) {
			throw new CustomException(errorMap);
		}
	}

	public void checkIfBillingSlabsExist(BillingSlabReq billingSlabReq, Map<String, String> errorMap) {
		List<String> ids = billingSlabReq.getBillingSlab().parallelStream().map(BillingSlab::getId)
				.collect(Collectors.toList());
		BillingSlabRes billingSlabRes = billingSlabService.searchBillingSlabs(billingSlabReq.getRequestInfo(),
				BillingSlabSearchCriteria.builder().id(ids).tenantId(billingSlabReq.getBillingSlab().get(0).getTenantId()).build());
		if (CollectionUtils.isEmpty(billingSlabRes.getBillingSlab())) {
			errorMap.put("EG_PT_INVALID_IDS", "Following records are unavailable, IDs: "+ ids);
		} else {
			List<String> idsAvailableintheDB = billingSlabRes.getBillingSlab().parallelStream().map(BillingSlab::getId)
					.collect(Collectors.toList());
			if (idsAvailableintheDB.size() != ids.size()) {
				List<String> invalidIds = new ArrayList<>();
				for (String id : ids) {
					if (!idsAvailableintheDB.contains(id))
						invalidIds.add(id);
				}
				errorMap.put("EG_PT_INVALID_IDS", "Following records are unavailable, IDs: " + invalidIds);
			}
		}
		
		if (!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);
	}

	/**
	 * Validates the Incoming request for duplicate Records
	 *  
	 * @param billingSlabReq
	 * @param errorMap
	 */
	public void validateDuplicateBillingSlabs(BillingSlabReq billingSlabReq, Map<String, String> errorMap) {

		List<BillingSlab> incomingSlabs = billingSlabReq.getBillingSlab();
		String tenantId = incomingSlabs.get(0).getTenantId();
		List<Integer> errorList = new ArrayList<>();

		List<BillingSlab> dbSlabs = billingSlabService.searchBillingSlabs(billingSlabReq.getRequestInfo(),
				BillingSlabSearchCriteria.builder().tenantId(tenantId).build()).getBillingSlab();

		if (!CollectionUtils.isEmpty(dbSlabs)) {
			for (int i = 0; i < incomingSlabs.size(); i++) {
				Integer index = null;
				if (dbSlabs.contains(incomingSlabs.get(i))) {
					log.info("Equals passed!");
					errorList.add(i);
/*					index = dbSlabs.indexOf(incomingSlabs.get(i));
					BillingSlab dbSlab = dbSlabs.get(index);
					if(!billingSlabUtils.checkIfRangeSatisfies(dbSlab, incomingSlabs.get(i))){
						log.info("Range doesn't statisfy.");
						errorList.add(i);
					}*/
				}
			}
			if (!CollectionUtils.isEmpty(errorList))
				errorMap.put("EG_PT_BILLING_SLAB_DUPLICATE",
						"Records in following indices are duplicate, : " + errorList);
		}
		if (!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);
	}

	public void fetchAndvalidateMDMSCodes(BillingSlabReq billingSlabReq, Map<String, String> errorMap) {
		StringBuilder uri = new StringBuilder();
		MdmsCriteriaReq request = billingSlabUtils.prepareRequest(uri,
				billingSlabReq.getBillingSlab().get(0).getTenantId(), billingSlabReq.getRequestInfo());
		Object response = null;
		try {
			response = repository.fetchResult(uri, request);
			if (null == response) {
				log.info(BillingSlabConstants.MDMS_DATA_NOT_FOUND_MESSAGE);
				throw new CustomException();
			}
			validateMDMSCodes(billingSlabReq, errorMap, response);
		} catch (Exception e) {
			log.error(BillingSlabConstants.MDMS_DATA_NOT_FOUND_KEY, e);
			errorMap.put(BillingSlabConstants.MDMS_DATA_NOT_FOUND_KEY,
					BillingSlabConstants.MDMS_DATA_NOT_FOUND_MESSAGE);
			return;
		}
	}

	//TODO: Check validate ward
	public void fetchAndvalidateMohalla(BillingSlabReq billingSlabReq, Map<String, String> errorMap) {

		String tenantId = billingSlabReq.getBillingSlab().get(0).getTenantId();

		StringBuilder uri = new StringBuilder(locationHost);
        uri.append(locationContextPath).append(locationEndpoint);
        uri.append("?").append("tenantId=").append(tenantId);
        uri.append("&").append("boundaryType=").append("Locality");

		LinkedHashMap responseMap = (LinkedHashMap) repository.fetchResult(uri, billingSlabReq.getRequestInfo());

        if(CollectionUtils.isEmpty(responseMap))
            throw new CustomException("BOUNDARY ERROR","The response from location service is empty or null");
		String jsonString = new JSONObject(responseMap).toString();
		

	}

	public void validateMDMSCodes(BillingSlabReq billingSlabReq, Map<String, String> errorMap, Object mdmsResponse) {
				
		List<Object> propertyTypes = new ArrayList<>();
		List<Object> constructionTypes = new ArrayList<>();
		List<Object> roadTypes = new ArrayList<>();
		
		try {
			propertyTypes = JsonPath.read(mdmsResponse, BillingSlabConstants.MDMS_PROPERTYTAX_JSONPATH + BillingSlabConstants.MDMS_PROPERTYTYPE_MASTER_NAME);
			roadTypes = JsonPath.read(mdmsResponse, BillingSlabConstants.MDMS_PROPERTYTAX_JSONPATH + BillingSlabConstants.MDMS_ROADTYPE_MASTER_NAME);
			constructionTypes = JsonPath.read(mdmsResponse, BillingSlabConstants.MDMS_PROPERTYTAX_JSONPATH + BillingSlabConstants.MDMS_CONSTRUCTIONTYPE_MASTER_NAME);
		} catch (Exception e) {
			if (CollectionUtils.isEmpty(propertyTypes) && CollectionUtils.isEmpty(roadTypes)
					&& CollectionUtils.isEmpty(constructionTypes)) {
				log.error("MDMS data couldn't be fetched. Skipping code validation.....", e);
				return;
			}
		}
		/*
		 * occupancy type is not allowed to have ALL string value
		 */
		for (BillingSlab billingSlab : billingSlabReq.getBillingSlab()) {
		
			if(!StringUtils.isEmpty(billingSlab.getPropertyType())) {
				List<String> allowedPropertyTypes = JsonPath.read(propertyTypes,BillingSlabConstants.MDMS_CODE_JSONPATH);
				if(!allowedPropertyTypes.contains(billingSlab.getPropertyType())) {
					errorMap.put("INVALID_PROPERTY_TYPE","Property Type provided is invalid");
				}
			}

			if(!StringUtils.isEmpty(billingSlab.getRoadType())) {
				List<String> allowedRoadTypes = JsonPath.read(roadTypes,BillingSlabConstants.MDMS_CODE_JSONPATH);
				if(!allowedRoadTypes.contains(billingSlab.getRoadType())) {
					errorMap.put("INVALID_ROAD_TYPE","Road Type provided is invalid");
				}
			}

			if(!StringUtils.isEmpty(billingSlab.getConstructionType())) {
				List<String> allowedConstructionTypes = JsonPath.read(constructionTypes,BillingSlabConstants.MDMS_CODE_JSONPATH);
				if(!allowedConstructionTypes.contains(billingSlab.getConstructionType())) {
					errorMap.put("INVALID_CONSTRUCTION_TYPE","Construction Type provided is invalid");
				}
			}
		}
	}
}
