package org.egov.pt.calculator.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.egov.pt.calculator.web.models.CalculationCriteria;
import org.egov.pt.calculator.web.models.CalculationReq;
import org.egov.pt.calculator.web.models.property.Property;
import org.egov.pt.calculator.web.models.property.PropertyDetail;
import org.egov.pt.calculator.web.models.registry.Assessment;
import org.egov.pt.calculator.web.models.registry.CalculationRequestV2;
import org.springframework.stereotype.Service;

@Service
public class RegistryService {
	
	public CalculationReq calculationWrapper(CalculationRequestV2 requestV2) {
		org.egov.pt.calculator.web.models.registry.Property propertyV2 = requestV2.getCalculationCriteria().getProperty();
		Assessment assessmentV2 = requestV2.getCalculationCriteria().getAssessment();
		
		PropertyDetail detail = PropertyDetail.builder()
				.additionalDetails(assessmentV2.getAdditionalDetails())
				.adhocExemption(BigDecimal.ZERO) //Where to pick this from?
				.adhocPenalty(BigDecimal.ZERO) //Where to pick this from?
				.assessmentDate(assessmentV2.getAssessmentDate())
				.assessmentNumber(assessmentV2.getAssessmentNumber())
				.buildUpArea(assessmentV2.getBuildUpArea())
				.channel(assessmentV2.getChannel())
				.documents(assessmentV2.getDocuments())
				.financialYear(assessmentV2.getFinancialYear())
				.landArea(propertyV2.getLandArea())
				.noOfFloors(propertyV2.getNoOfFloors())
				.owners(propertyV2.getOwners())
				.ownershipCategory(propertyV2.getOwnershipCategory())
				.propertyType(propertyV2.getPropertyType())
				.units(assessmentV2.getUnits())
				.usageCategoryMajor(propertyV2.getUsageCategory())
				.build();
		
		List<PropertyDetail> details = new ArrayList<>();
		details.add(detail);
				
		
		Property property = Property.builder()
				.address(propertyV2.getAddress())
				.auditDetails(propertyV2.getAuditDetails())
				.creationReason(propertyV2.getCreationReason())
				.occupancyDate(propertyV2.getOccupancyDate())
				.oldPropertyId(propertyV2.getOldPropertyId())
				.propertyId(propertyV2.getPropertyId())
				.status(propertyV2.getStatus())
				.propertyDetail(details)
				.tenantId(propertyV2.getTenantId())
				.build();
		
		CalculationCriteria calculationCriteria = CalculationCriteria.builder()
				.property(property).build();
		List<CalculationCriteria> criteriaList = new ArrayList<>();
		criteriaList.add(calculationCriteria);
		
		
		return CalculationReq.builder()
				.requestInfo(requestV2.getRequestInfo())
				.calculationCriteria(criteriaList)
				.build();
	}
	

}
