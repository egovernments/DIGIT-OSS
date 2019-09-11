package org.egov.pt.calculator.service;

import java.util.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.calculator.repository.AssessmentRepository;
import org.egov.pt.calculator.repository.PTCalculatorRepository;
import org.egov.pt.calculator.util.CalculatorConstants;
import org.egov.pt.calculator.util.CalculatorUtils;
import org.egov.pt.calculator.web.models.Assessment;
import org.egov.pt.calculator.web.models.CalculationReq;
import org.egov.pt.calculator.web.models.demand.Demand;
import org.egov.pt.calculator.web.models.property.AuditDetails;
import org.egov.pt.calculator.web.models.property.Property;
import org.egov.pt.calculator.web.models.property.PropertyResponse;
import org.egov.pt.calculator.web.models.property.RequestInfoWrapper;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * AssesmentService
 * 
 * Serves for the purpose of saving and retrieving of assessments
 * 
 * @author kavi elrey
 */
@Service
public class AssessmentService {

	@Autowired
	private CalculatorUtils utils;

	@Autowired
	private AssessmentRepository repository;

	@Autowired
	private PTCalculatorRepository ptCalculatorRepository;

	@Autowired
	private ObjectMapper mapper;

	/**
	 * persists the assessments
	 * <p>
	 * adds the data to the respective kafka topic
	 *
	 * @param demands
	 * @param info
	 */
	public List<Assessment> saveAssessments(List<Demand> demands, Map<String, String> consumerCodeFinYearMap, RequestInfo info) {

		List<Assessment> assessments = new ArrayList<>();

		AuditDetails details = utils.getAuditDetails(info.getUserInfo().getId().toString(), true);
		demands.forEach(demand -> {

			String[] consumerCodeSplitArray = demand.getConsumerCode().split(CalculatorConstants.PT_CONSUMER_CODE_SEPARATOR);
			assessments.add(Assessment.builder().propertyId(consumerCodeSplitArray[0]).assessmentYear(consumerCodeFinYearMap.get(demand.getConsumerCode()))
					.uuid(UUID.randomUUID().toString()).assessmentNumber(consumerCodeSplitArray[1])
					.tenantId(demand.getTenantId()).demandId(demand.getId()).auditDetails(details).build());
		});
		return repository.saveAssessments(assessments, info);
	}

	/**
	 * Returns the latest assessment for the given criteria
	 *
	 * @param assessment
	 * @return
	 */
	public List<Assessment> getMaxAssessment(Assessment assessment) {

		List<Object> preparedStatementList = new ArrayList<>();
		String query = utils.getMaxAssessmentQuery(assessment, preparedStatementList);
		return repository.getAssessments(query, preparedStatementList.toArray());
	}

	/**
	 * Returns list of assessments for the given criteria
	 *
	 * @param assessment
	 * @return
	 */
	public List<Assessment> getAssessments(Assessment assessment) {

		List<Object> preparedStatementList = new ArrayList<>();
		String query = utils.getAssessmentQuery(assessment, preparedStatementList);
		return repository.getAssessments(query, preparedStatementList.toArray());
	}


	/**
	 * Enriches the property object from assessment numnber
	 *
	 * @param calculationReq The input calculation requests
	 */
	public void enrichAssessment(CalculationReq calculationReq) {

		Map<String, Property> propertyMap = getPropertyMap(calculationReq);

		Map<String, String> errorMap = new HashMap<>();

		calculationReq.getCalculationCriteria().forEach(calculationCriteria -> {
			if (propertyMap.containsKey(calculationCriteria.getAssessmentNumber()))
				calculationCriteria.setProperty(propertyMap.get(calculationCriteria.getAssessmentNumber()));
			else errorMap.put("INVALID_CRITERIA", "Property for the assessment number : "
					+ calculationCriteria.getAssessmentNumber() + " is not found ");
		});

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);

	}


	/**
	 * Searches property based on assessment number and returns a map
	 *
	 * @param calculationReq The CalculationReq for which demand is to be generated
	 * @return Map of assessmentNumber to property
	 */
	private Map<String, Property> getPropertyMap(CalculationReq calculationReq) {

		String tenantId = calculationReq.getCalculationCriteria().get(0).getTenantId();
		RequestInfo requestInfo = calculationReq.getRequestInfo();
		List<String> assessmentNumbers = new LinkedList<>();

		calculationReq.getCalculationCriteria().forEach(calculationCriteria ->
		{
			assessmentNumbers.add(calculationCriteria.getAssessmentNumber());
		});

		StringBuilder url = utils.getPTSearchQuery(tenantId, assessmentNumbers);

		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();

		Object res = ptCalculatorRepository.fetchResult(url, requestInfoWrapper);

		PropertyResponse response = mapper.convertValue(res, PropertyResponse.class);

		Map<String, Property> propertyMap = new HashMap<>();

		response.getProperties().forEach(property -> {
			propertyMap.put(property.getPropertyDetails().get(0).getAssessmentNumber(), property);
		});

		return propertyMap;
	}

}