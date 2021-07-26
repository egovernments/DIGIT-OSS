package org.egov.wf.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.wf.config.WorkflowConfig;
import org.egov.wf.producer.Producer;
import org.egov.wf.repository.EscalationRepository;
import org.egov.wf.util.EscalationUtil;
import org.egov.wf.web.models.Escalation;
import org.egov.wf.web.models.EscalationSearchCriteria;
import org.egov.wf.web.models.ProcessInstance;
import org.egov.wf.web.models.ProcessInstanceRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EscalationService {



    private EscalationUtil escalationUtil;

    private MDMSService mdmsService;

    private EscalationRepository escalationRepository;

    private WorkflowService workflowService;

    private Producer producer;

    private WorkflowConfig config;

    @Autowired
    public EscalationService(EscalationUtil escalationUtil, MDMSService mdmsService, EscalationRepository escalationRepository,
                             WorkflowService workflowService, Producer producer, WorkflowConfig config) {
        this.escalationUtil = escalationUtil;
        this.mdmsService = mdmsService;
        this.escalationRepository = escalationRepository;
        this.workflowService = workflowService;
        this.producer = producer;
        this.config = config;
    }


    /**
     * Fetches all escalations defined for the given businessService and escalates
     * the applications which have breached the SLA based on the escalation config defined
     * @param requestInfo
     * @param businessService
     */
    public void escalateApplications(RequestInfo requestInfo, String businessService){

        Object mdmsData = mdmsService.mDMSCall(requestInfo);
        List<Escalation> escalations = escalationUtil.getEscalationsFromConfig(businessService, mdmsData);
        List<String> tenantIds = escalationUtil.getTenantIds(mdmsData);

        for(Escalation escalation : escalations){

            processEscalation(requestInfo, escalation, tenantIds);

        }

    }


    /**
     * Processes the escalation
     * @param escalation
     * @param tenantIds
     */
    private void processEscalation(RequestInfo requestInfo, Escalation escalation, List<String> tenantIds){

        for(String tenantId: tenantIds){


            String stateUUID = escalationUtil.getStatusUUID(escalation.getStatus(), tenantId, escalation.getBusinessService());

            EscalationSearchCriteria criteria = EscalationSearchCriteria.builder().tenantId(tenantId)
                                                .status(stateUUID)
                                                .businessService(escalation.getBusinessService())
                                                .businessSlaExceededBy(escalation.getBusinessSlaExceededBy())
                                                .stateSlaExceededBy(escalation.getStateSlaExceededBy())
                                                .build();



            List<String> businessIds = escalationRepository.getBusinessIds(criteria);
            Integer numberOfBusinessIds = businessIds.size();
            Integer batchSize = config.getEscalationBatchSize();

            for(int i = 0; i < numberOfBusinessIds; i = i + batchSize){

                // Processing the businessIds in batches
                Integer start = i;
                Integer end = ((i + batchSize) < numberOfBusinessIds ? (i + batchSize) : numberOfBusinessIds) ;

                List<ProcessInstance> processInstances = escalationUtil.getProcessInstances(tenantId, businessIds.subList(start,end), escalation);
                processInstances = workflowService.transition(new ProcessInstanceRequest(requestInfo, processInstances));
                producer.push(escalation.getTopic(),new ProcessInstanceRequest(requestInfo, processInstances));

            }

        }

    }

    /**
     * Temporary added for testing
     * @param requestInfo
     * @param businessService
     */
    public List<String> escalateApplicationsTest(RequestInfo requestInfo, String businessService){

        Object mdmsData = mdmsService.mDMSCall(requestInfo);
        List<Escalation> escalations = escalationUtil.getEscalationsFromConfig(businessService, mdmsData);
        List<String> tenantIds = escalationUtil.getTenantIds(mdmsData);

        List<String> ids = new LinkedList<>();

        for(Escalation escalation : escalations){

            ids.addAll(getEscalations(requestInfo, escalation, tenantIds));

        }

        return ids;
    }

    /**
     * Temporary added for testing
     * @param escalation
     * @param tenantIds
     */
    private List<String> getEscalations(RequestInfo requestInfo, Escalation escalation, List<String> tenantIds){

        List<String> ids = new LinkedList<>();

        for(String tenantId: tenantIds){


            String stateUUID = escalationUtil.getStatusUUID(escalation.getStatus(), tenantId, escalation.getBusinessService());

            EscalationSearchCriteria criteria = EscalationSearchCriteria.builder().tenantId(tenantId)
                    .status(stateUUID)
                    .businessService(escalation.getBusinessService())
                    .businessSlaExceededBy(escalation.getBusinessSlaExceededBy())
                    .stateSlaExceededBy(escalation.getStateSlaExceededBy())
                    .build();



            List<String> businessIds = escalationRepository.getBusinessIds(criteria);
            Integer numberOfBusinessIds = businessIds.size();
            Integer batchSize = config.getEscalationBatchSize();

            for(int i = 0; i < numberOfBusinessIds; i = i + batchSize){

                // Processing the businessIds in batches
                Integer start = i;
                Integer end = ((i + batchSize) < numberOfBusinessIds ? (i + batchSize) : numberOfBusinessIds) ;

                List<ProcessInstance> processInstances = escalationUtil.getProcessInstances(tenantId, businessIds.subList(start,end), escalation);
                ids.addAll(processInstances.stream().map(ProcessInstance::getBusinessId).collect(Collectors.toList()));
            }

        }

        return ids;

    }




}
