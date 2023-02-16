package org.egov.demand.web.validator;

import static org.egov.demand.util.Constants.BUSINESSSERVICE_MODULE_PATH;
import static org.egov.demand.util.Constants.TAXHEADMASTER_PATH_CODE;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.amendment.model.Amendment;
import org.egov.demand.amendment.model.AmendmentCriteria;
import org.egov.demand.amendment.model.AmendmentRequest;
import org.egov.demand.amendment.model.AmendmentUpdate;
import org.egov.demand.amendment.model.AmendmentUpdateRequest;
import org.egov.demand.amendment.model.ProcessInstance;
import org.egov.demand.amendment.model.enums.AmendmentStatus;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.BusinessServiceDetail;
import org.egov.demand.model.Demand;
import org.egov.demand.model.DemandCriteria;
import org.egov.demand.model.DemandDetail;
import org.egov.demand.model.TaxHeadMaster;
import org.egov.demand.repository.AmendmentRepository;
import org.egov.demand.repository.IdGenRepo;
import org.egov.demand.service.DemandService;
import org.egov.demand.util.Constants;
import org.egov.demand.util.Util;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;

@Component
public class AmendmentValidator {
	
	@Autowired
	private Util util;
	
	@Autowired
	private ObjectMapper mapper;
	
	@Autowired
	private IdGenRepo idGenRepo;
	
	@Autowired
	private DemandService demandService;
	
	@Autowired
	private ApplicationProperties props;
	
	@Autowired
	private AmendmentRepository amendmentRepository;
	
	
	/**
	 * Validate amendment request for create
	 * @param amendmentRequest
	 */
	public void validateAmendmentForCreate(AmendmentRequest amendmentRequest) {

		Amendment amendment = amendmentRequest.getAmendment();
		
		/*
		 * Extracting the respective masters from DocumentContext 
		 * 
		 * Validating the master data fields - business-service and tax-heads
		 */
		DocumentContext mdmsData = util.getMDMSData(amendmentRequest.getRequestInfo(), amendmentRequest.getAmendment().getTenantId());
		List<BusinessServiceDetail> businessServices = Arrays.asList(mapper.convertValue(mdmsData.read(BUSINESSSERVICE_MODULE_PATH), BusinessServiceDetail[].class));
		Map<String, BusinessServiceDetail> businessMasterMap = businessServices.stream()
				.collect(Collectors.toMap(BusinessServiceDetail::getCode, Function.identity()));
		
		List<TaxHeadMaster> taxHeads = Arrays.asList(mapper.convertValue(mdmsData.read(TAXHEADMASTER_PATH_CODE), TaxHeadMaster[].class));
		Map<String, Set<String>> businessTaxCodeSet = taxHeads.stream().collect(Collectors.groupingBy(
				TaxHeadMaster::getService, Collectors.mapping(TaxHeadMaster::getCode, Collectors.toSet())));
		
		Map<String,String> errorMap = new HashMap<>();

		BusinessServiceDetail businessService = businessMasterMap.get(amendment.getBusinessService());
		if (ObjectUtils.isEmpty(businessService)) {
			errorMap.put("EG_BS_AMENDMENT_BUSINESS_ERROR",
					"Business service not found for the given code : " + amendment.getBusinessService());
		} else if (!businessService.getIsBillAmendmentEnabled()) {
			errorMap.put("EG_BS_AMENDMENT_DISABLED_ERROR",
					"Amendment is disabled for the given Business-service : " + amendment.getBusinessService());
		}
		
		/*
		 * if business-service is disabled then further validation is not needed
		 */
		if(!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);

		/*
		 * verifying presence of workflow amendments with same consumer-code
		 * 
		 * verifying the consumer-code presence in demand system
		 */
		AmendmentCriteria amendmentCriteria = AmendmentCriteria.builder()
				.consumerCode(Stream.of(amendment.getConsumerCode()).collect(Collectors.toSet()))
				.tenantId(amendment.getTenantId())
				.status(Stream.of(AmendmentStatus.INWORKFLOW.toString()).collect(Collectors.toSet()))
				.build();
		
		List<Amendment> amendmentsFromSearch = amendmentRepository.getAmendments(amendmentCriteria);
		
		if(!CollectionUtils.isEmpty(amendmentsFromSearch))
			throw new CustomException("EG_BS_AMENDMENT_DUPLICATE_ERROR",
					"An Amendment is already in workflow for given consumercode : " + amendment.getConsumerCode());
		
		DemandCriteria demandCriteria = DemandCriteria.builder()
		.tenantId(amendment.getTenantId())
		.businessService(amendment.getBusinessService())
		.consumerCode(new HashSet<>(Arrays.asList(amendment.getConsumerCode())))
		.build();
		
		List<Demand> demands = demandService.getDemands(demandCriteria, amendmentRequest.getRequestInfo());
		
//		if (CollectionUtils.isEmpty(demands))
//			throw new CustomException("EG_BS_AMENDMENT_CONSUMERCODE_ERROR",
//					"No demands found in the system for the given consumer code, An amendment cannot be created without demands in the system.");
//		
		
		Set<String> taxheadcodes = businessTaxCodeSet.get(amendment.getBusinessService());
		List<BigDecimal> allPositiveAmounts = amendment.getDemandDetails().stream()
				.filter(detail -> detail.getTaxAmount().compareTo(BigDecimal.ZERO) >= 0).map(DemandDetail::getTaxAmount)
				.collect(Collectors.toList());
		
		if (allPositiveAmounts.size() != 0 && allPositiveAmounts.size() != amendment.getDemandDetails().size())
			errorMap.put("EG_BS_AMENDMENT_TAXAMOUNT_ERROR", "All Tax amounts should either be positive or negative");
	
		if (!CollectionUtils.isEmpty(taxheadcodes)) {
			
			List<String> MissingTaxHeadCodes = amendment.getDemandDetails().stream()
					.filter(detail -> !taxheadcodes.contains(detail.getTaxHeadMasterCode()))
					.map(DemandDetail::getTaxHeadMasterCode).collect(Collectors.toList());

			if (!MissingTaxHeadCodes.isEmpty()) {
				errorMap.put("EG_BS_AMENDMENT_TAXHEAD_ERROR",
						"Taxheads not found for the following codes : " + MissingTaxHeadCodes);
			}
		} else {
			errorMap.put("EG_BS_AMENDMENT_TAXHEAD_ERROR",
					"No taxheads found for the given business service : " + amendment.getBusinessService());
		}
	
		/*
		 * validating from and to periods
		 */
		if (amendment.getEffectiveFrom() == null && amendment.getEffectiveTill() != null) {
			
			errorMap.put("EG_BS_AMENDMENT_PERIOD_ERROR", "End period cannot be given without from period");
		} else if (amendment.getEffectiveFrom() != null && amendment.getEffectiveTill() != null
				&& amendment.getEffectiveFrom().compareTo(amendment.getEffectiveTill()) >= 0) {
			errorMap.put("EG_BS_AMENDMENT_PERIOD_ERROR",
					"From period cannot be greater or equal to end period in amendment");
		}
		
		if(!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);
	}

	/**
	 * Validating search criteria
	 * 
	 */
	public void validateAmendmentCriteriaForSearch(AmendmentCriteria criteria) {

		// mobile-number integration
		Map<String, String> errorMap = new HashMap<>();

		/*
		 * validation consumer-code and business-service combination
		 */
		if (!ObjectUtils.isEmpty(criteria.getConsumerCode()) && ObjectUtils.isEmpty(criteria.getBusinessService()))
			errorMap.put("EG_BS_AMENDMENT_CRITERIA_ERROR",
					"Consumer codes require businesService as mandatory parameter for search");

		if (!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);
	}
	
	/**
	 * enrich amendment request for create
	 * @param amendmentRequest
	 */
	public void enrichAmendmentForCreate (AmendmentRequest amendmentRequest) {
		
		Amendment amendment = amendmentRequest.getAmendment();
		RequestInfo requestInfo = amendmentRequest.getRequestInfo();
		amendment.setId(UUID.randomUUID().toString());
		
		/*
		 * Id-Gen for amendment Id & UUID enrichment
		 */
		Boolean isCreditNote = amendment.getDemandDetails().get(0).getTaxAmount().compareTo(BigDecimal.ZERO) >= 0;
		String creditOrDebitString = isCreditNote ? Constants.CREDIT_NOTE_VALUE : Constants.DEBIT_NOTE_VALUE; 
		String amendmentId = idGenRepo.getId(requestInfo, amendment.getTenantId(), props.getAmendmentIdFormatName(), null, 1).get(0);
		amendmentId = amendmentId.replace(Constants.NOTETYPE_REPLACE_STRING, creditOrDebitString);
		amendmentId = amendmentId.replace(Constants.CONSUMERCODE_REPLACE_STRING, amendment.getConsumerCode());
		amendment.setAmendmentId(amendmentId); 
		
		amendment.setAuditDetails(util.getAuditDetail(requestInfo));
		amendment.getDemandDetails().forEach(detail -> {
			detail.setId(UUID.randomUUID().toString());
		});
		
		amendment.getDocuments().forEach(doc -> {
			doc.setId(UUID.randomUUID().toString());
		});
		
		/*
		 * enrich workflow fields if enabled
		 */
		String workflowName = amendment.getBusinessService().concat(".").concat(Constants.AMENDMENT_STRING_CONSTANT);
		if (props.getIsAmendmentworkflowEnabed()) {

			ProcessInstance processInstance = ProcessInstance.builder()
					.businessService(workflowName)
					.moduleName(amendment.getBusinessService())
					.action(props.getAmendmentWfOpenAction())
					.businessId(amendment.getAmendmentId())
					.tenantId(amendment.getTenantId())
					.build();
			
			amendment.setWorkflow(processInstance);
		} else {
			amendment.setStatus(AmendmentStatus.ACTIVE);
		}
		
	}

	/**
	 * Validating for update 
	 * @param amendmentUpdateRequest
	 */
	public Amendment validateAndEnrichAmendmentForUpdate(@Valid AmendmentUpdateRequest amendmentUpdateRequest) {
		
		if (!props.getIsAmendmentworkflowEnabed()) {
			throw new CustomException("EG_BS_AMENDMENT_UPDATE_WF_ERROR",
					"Amendment update is not allowed when workflow is disabled");
		}
		
		Map<String,String> errorMap = new HashMap<>();
		AmendmentUpdate amendmentUpdate = amendmentUpdateRequest.getAmendmentUpdate();
		
		/*
		 * checking for amendment in system
		 */
		List<Amendment> amendments = amendmentRepository.getAmendments(amendmentUpdate.toSearchCriteria());
		if(CollectionUtils.isEmpty(amendments))
			errorMap.put("EG_BS_AMENDMENT_UPDATE_ERROR", "No Amendment found in the system for the given amendmentId, Please provide valid id for update");

		/*
		 * validating workflow fields
		 */
		ProcessInstance workflow = amendmentUpdate.getWorkflow();
		
		if (workflow.getAction() == null || workflow.getBusinessId() == null 
				|| workflow.getBusinessService() == null || workflow.getModuleName() == null) {

			errorMap.put("EG_BS_AMENDMENT_UPDATE_WF_ERROR",
					"Mandatory workflow fileds missing in the update request, Please add all the following fields module, businessservice, businessid and action");
		} else {
			workflow.setBusinessId(amendmentUpdate.getAmendmentId());
		}

		if (!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);
		
		/*
		 * enriching the update object
		 */
		amendmentUpdate.setAdditionalDetails(util.jsonMerge(amendments.get(0).getAdditionalDetails(), amendmentUpdate.getAdditionalDetails()));
		amendmentUpdate.setAuditDetails(util.getAuditDetail(amendmentUpdateRequest.getRequestInfo()));
		return amendments.get(0);
	}
	
}
