package org.egov.pt.util;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.models.Assessment;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.service.PropertyService;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
public class AssessmentUtils extends CommonUtils {


    private PropertyService propertyService;

    @Autowired
    public AssessmentUtils(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    public Property getPropertyForAssessment(AssessmentRequest assessmentRequest){
    	
        RequestInfo requestInfo = assessmentRequest.getRequestInfo();
        Assessment assessment = assessmentRequest.getAssessment();
        PropertyCriteria criteria = PropertyCriteria.builder()
                .tenantId(assessment.getTenantId())
                .propertyIds(Collections.singleton(assessment.getPropertyId()))
                .build();
        List<Property> properties = propertyService.searchProperty(criteria, requestInfo);

        if(CollectionUtils.isEmpty(properties))
            throw new CustomException("PROPERTY_NOT_FOUND","The property with id: "+assessment.getPropertyId()+" is not found");

        return properties.get(0);
    }

	public String getCurrentFinYearValue() {
		LocalDate date = LocalDate.now();
		int currentMonth = date.getMonthValue();
		int finStartYear = currentMonth > 3 ? date.getYear() : date.getYear() - 1;
		return String.valueOf(finStartYear).concat("-").concat(String.valueOf(finStartYear + 1).substring(2, 4));
	}

}
