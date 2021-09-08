package org.egov.egovsurveyservices.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.egovsurveyservices.producer.Producer;
import org.egov.egovsurveyservices.validators.SurveyValidator;
import org.egov.egovsurveyservices.web.models.AuditDetails;
import org.egov.egovsurveyservices.web.models.SurveyEntity;
import org.egov.egovsurveyservices.web.models.SurveyRequest;
import org.egov.egovsurveyservices.web.models.SurveySearchCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.egov.egovsurveyservices.utils.SurveyServiceConstants.*;

@Slf4j
@Service
public class SurveyService {

    @Autowired
    private SurveyValidator surveyValidator;

    @Autowired
    private Producer producer;

    @Autowired
    private EnrichmentService enrichmentService;

    public SurveyEntity createSurvey(SurveyRequest surveyRequest) {

        SurveyEntity surveyEntity = surveyRequest.getSurveyEntity();

        // Validate whether usertype employee is trying to create survey.
        surveyValidator.validateUserType(surveyRequest.getRequestInfo());
        // Validate survey uniqueness.
        surveyValidator.validateSurveyUniqueness(surveyEntity);
        // Validate question types.
        surveyValidator.validateQuestions(surveyEntity);

        // Enrich survey entity
        enrichmentService.enrichSurveyEntity(surveyRequest);

        // Persist survey if it passes all validations
        List<String> listOfTenantIds = new ArrayList<>(surveyEntity.getTenantIds());
        listOfTenantIds.forEach(tenantId ->{
            surveyEntity.setTenantId(tenantId);
            producer.push("save-ss-survey", surveyRequest);
        });

        return surveyEntity;
    }

    public List<SurveyEntity> searchSurveys(RequestInfo requestInfo, SurveySearchCriteria criteria) {
        return new ArrayList<>();
    }
}
