package org.egov.pt.service;


import static org.egov.pt.util.AssessmentConstants.WORKFLOW_SENDBACK_CITIZEN;
import static org.egov.pt.util.PTConstants.ASMT_MODULENAME;
import static org.egov.pt.util.PTConstants.ASMT_WORKFLOW_CODE;
import static org.egov.pt.util.PTConstants.WORKFLOW_START_ACTION;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.egov.common.contract.request.User;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Assessment;
import org.egov.pt.models.AuditDetails;
import org.egov.pt.models.Document;
import org.egov.pt.models.Property;
import org.egov.pt.models.Unit;
import org.egov.pt.models.UnitUsage;
import org.egov.pt.models.enums.Status;
import org.egov.pt.models.workflow.BusinessService;
import org.egov.pt.models.workflow.ProcessInstance;
import org.egov.pt.models.workflow.State;
import org.egov.pt.util.AssessmentUtils;
import org.egov.pt.util.PropertyUtil;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

@Service
public class AssessmentEnrichmentService {


    private AssessmentUtils assessmentUtils;

    private PropertyConfiguration config;

    private PropertyUtil propertyUtil;

    private WorkflowService workflowService;

    @Autowired
    public AssessmentEnrichmentService(AssessmentUtils assessmentUtils, PropertyConfiguration config, PropertyUtil propertyUtil, WorkflowService workflowService) {
        this.assessmentUtils = assessmentUtils;
        this.config = config;
        this.propertyUtil = propertyUtil;
        this.workflowService = workflowService;
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

        if(config.getIsAssessmentWorkflowEnabled())
            assessment.setStatus(Status.INWORKFLOW);
        else
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
    public void enrichAssessmentUpdate(AssessmentRequest request, Property property) {
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
                enrichPropertyFromAssessment(property, request.getAssessment());
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

        State state = workflowService.getCurrentState(request.getRequestInfo(), request.getAssessment());

        ProcessInstance processInstance = request.getAssessment().getWorkflow();
        processInstance.setBusinessId(request.getAssessment().getAssessmentNumber());
        processInstance.setModuleName(ASMT_MODULENAME);
        processInstance.setTenantId(request.getAssessment().getTenantId());
        processInstance.setBusinessService(ASMT_WORKFLOW_CODE);
        processInstance.setState(state);

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
            if(stateObj.getApplicationStatus()!=null && stateObj.getApplicationStatus().equalsIgnoreCase(state)){
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

    /**
     * Enriches Units from unitUsages from assessment
     * @param property Property for which assessment is done
     * @param assessment
     */
    private void enrichPropertyFromAssessment(Property property, Assessment assessment){

        Map<String, UnitUsage> unitIdToUnitUsage = assessment.getUnitUsageList().stream().collect(Collectors.toMap(UnitUsage::getUnitId, Function.identity()));

        List<Unit> units  = property.getUnits();

        for(Unit unit : units){

            if(unitIdToUnitUsage.containsKey(unit.getId())){
                UnitUsage unitUsage = unitIdToUnitUsage.get(unit.getId());
                if(unitUsage.getOccupancyDate()!=null)
                    unit.setOccupancyDate(unitUsage.getOccupancyDate());

                if(unitUsage.getOccupancyType()!=null)
                    unit.setOccupancyType(unitUsage.getOccupancyType());

                if(unitUsage.getUsageCategory()!=null)
                 unit.setUsageCategory(unitUsage.getUsageCategory());
            }
        }

    }


    /**
     * Enriches workflow object for new assessments
     * @param assessmentRequest
     */
    public void enrichWorkflowForInitiation(AssessmentRequest assessmentRequest){

        Assessment assessment = assessmentRequest.getAssessment();

        ProcessInstance processInstance = new ProcessInstance();
        processInstance.setBusinessId(assessment.getAssessmentNumber());
        processInstance.setAction(WORKFLOW_START_ACTION);
        processInstance.setModuleName(ASMT_MODULENAME);
        processInstance.setTenantId(assessment.getTenantId());
        processInstance.setBusinessService(ASMT_WORKFLOW_CODE);

        assessment.setWorkflow(processInstance);

    }




}
