package org.egov.pt.util;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.models.Assessment;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.repository.IdGenRepository;
import org.egov.pt.service.PropertyService;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.egov.pt.web.contracts.IdResponse;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
public class AssessmentUtils {


    private PropertyService propertyService;

    private IdGenRepository idGenRepository;

    @Autowired
    public AssessmentUtils(PropertyService propertyService, IdGenRepository idGenRepository) {
        this.propertyService = propertyService;
        this.idGenRepository = idGenRepository;
    }

    /**
     * Returns a list of numbers generated from idgen
     * @param requestInfo RequestInfo from the request
     * @param tenantId tenantId of the city
     * @param idKey code of the field defined in application properties for which ids are generated for
     * @param idformat format in which ids are to be generated
     * @param count Number of ids to be generated
     * @return List of ids generated using idGen service
     */
    public List<String> getIdList(RequestInfo requestInfo, String tenantId, String idKey, String idformat, int count) {

        List<IdResponse> idResponses = idGenRepository.getId(requestInfo, tenantId, idKey, idformat, count)
                .getIdResponses();

        if (CollectionUtils.isEmpty(idResponses))
            throw new CustomException("IDGEN ERROR", "No ids returned from idgen Service");

        return idResponses.stream().map(IdResponse::getId).collect(Collectors.toList());
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


}
