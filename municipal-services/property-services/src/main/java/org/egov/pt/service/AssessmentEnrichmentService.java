package org.egov.pt.service;


import org.egov.common.contract.request.User;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.*;
import org.egov.pt.models.enums.Status;
import org.egov.pt.models.workflow.BusinessService;
import org.egov.pt.models.workflow.State;
import org.egov.pt.util.AssessmentUtils;
import org.egov.pt.util.PropertyUtil;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import static org.egov.pt.util.AssessmentConstants.WORKFLOW_SENDBACK_CITIZEN;

@Service
public class AssessmentEnrichmentService {


    private AssessmentUtils assessmentUtils;

    private PropertyConfiguration config;

    private PropertyUtil propertyUtil;

    @Autowired
    public AssessmentEnrichmentService(AssessmentUtils assessmentUtils, PropertyConfiguration config, PropertyUtil propertyUtil) {
        this.assessmentUtils = assessmentUtils;
        this.config = config;
        this.propertyUtil = propertyUtil;
    }





    /**
     * Service layer to enrich assessment object in create flow
     *
     * @param request
     */
    public void enrichAssessmentCreate(AssessmentRequest request) {
        Assessment assessment = request.getAssessment();
        assessment.setId(String.valueOf(UUID.randomUUID()));
        assessment.setAssessmentNumber(getAssessmentNo(request));
        if(null == assessment.getStatus())
            assessment.setStatus(Status.ACTIVE);

        AuditDetails auditDetails = AuditDetails.builder()
                .createdBy(request.getRequestInfo().getUserInfo().getUuid())
                .createdTime(new Date().getTime())
                .lastModifiedBy(request.getRequestInfo().getUserInfo().getUuid())
                .lastModifiedTime(new Date().getTime()).build();

        if(!CollectionUtils.isEmpty(assessment.getUnitUsageList())) {
            for(UnitUsage unitUsage: assessment.getUnitUsageList()) {
                unitUsage.setId(String.valueOf(UUID.randomUUID()));
                unitUsage.setAuditDetails(auditDetails);
            }
        }
        if(!CollectionUtils.isEmpty(assessment.getDocuments())) {
            for(Document doc: assessment.getDocuments()) {
                doc.setId(String.valueOf(UUID.randomUUID()));
                doc.setAuditDetails(auditDetails);
                doc.setStatus(Status.ACTIVE);
            }
        }
        assessment.setAuditDetails(auditDetails);
    }


    /**
     * Service layer to enrich assessment object in update flow
     *
     * @param request
     */
    public void enrichAssessmentUpdate(AssessmentRequest request) {
        Assessment assessment = request.getAssessment();

        AuditDetails auditDetails = AuditDetails.builder()
                .createdBy(request.getRequestInfo().getUserInfo().getUuid())
                .createdTime(new Date().getTime())
                .lastModifiedBy(request.getRequestInfo().getUserInfo().getUuid())
                .lastModifiedTime(new Date().getTime()).build();

        if(!CollectionUtils.isEmpty(assessment.getUnitUsageList())) {
            for(UnitUsage unitUsage: assessment.getUnitUsageList()) {
                if(StringUtils.isEmpty(unitUsage.getId())) {
                    unitUsage.setId(String.valueOf(UUID.randomUUID()));
                    unitUsage.setAuditDetails(auditDetails);
                }
            }
        }
        if(!CollectionUtils.isEmpty(assessment.getDocuments())) {
            for(Document doc: assessment.getDocuments()) {
                if(StringUtils.isEmpty(doc.getId())) {
                    doc.setId(String.valueOf(UUID.randomUUID()));
                    doc.setAuditDetails(auditDetails);
                    doc.setStatus(Status.ACTIVE);
                }
            }
        }
        assessment.getAuditDetails().setLastModifiedBy(auditDetails.getLastModifiedBy());
        assessment.getAuditDetails().setLastModifiedTime(auditDetails.getLastModifiedTime());
    }



    /**
     * Enriches the processInstance
     * @param request The assessment request
     * @param property The property corresponding to the assessment
     */
    public void enrichAssessmentProcessInstance(AssessmentRequest request, Property property){

        if(request.getAssessment().getWorkflow().getAction().equalsIgnoreCase(WORKFLOW_SENDBACK_CITIZEN)){

           List<User> owners = propertyUtil.getUserForWorkflow(property);

           request.getAssessment().getWorkflow().setAssignes(owners);
        }

    }


    /**\
     *
     * @param state
     * @param assessment
     * @param businessService
     */
    public void enrichStatus(String state, Assessment assessment, BusinessService businessService){

        Boolean isTerminateState = false;
        for(State stateObj : businessService.getStates()){
            if(stateObj.getApplicationStatus().equalsIgnoreCase(state)){
                isTerminateState = stateObj.getIsTerminateState();
                break;
            }
        }
        if(!isTerminateState){
            assessment.setStatus(Status.INWORKFLOW);
        }
        else assessment.setStatus(Status.ACTIVE);
    }


    public String getAssessmentNo(AssessmentRequest request) {
        return assessmentUtils.getIdList(request.getRequestInfo(), request.getAssessment().getTenantId(),
                config.getAssessmentIdGenName(), config.getAssessmentIdGenFormat(), 1).get(0);
    }




}
