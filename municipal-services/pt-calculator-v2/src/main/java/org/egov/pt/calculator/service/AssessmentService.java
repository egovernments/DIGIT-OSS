package org.egov.pt.calculator.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.calculator.repository.AssessmentRepository;
import org.egov.pt.calculator.util.CalculatorConstants;
import org.egov.pt.calculator.util.CalculatorUtils;
import org.egov.pt.calculator.web.models.Assessment;
import org.egov.pt.calculator.web.models.demand.Demand;
import org.egov.pt.calculator.web.models.property.AuditDetails;
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

	/**
	 * persists the assessments 
	 * 
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
	public List<Assessment> getMaxAssessment(Assessment assessment){
		
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
	public List<Assessment> getAssessments(Assessment assessment){
		
		List<Object> preparedStatementList = new ArrayList<>();
		String query = utils.getAssessmentQuery(assessment, preparedStatementList);
		return repository.getAssessments(query, preparedStatementList.toArray());
	}
}
