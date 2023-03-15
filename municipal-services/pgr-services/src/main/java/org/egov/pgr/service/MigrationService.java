package org.egov.pgr.service;


import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.User;
import org.egov.pgr.config.PGRConfiguration;
import org.egov.pgr.producer.Producer;
import org.egov.pgr.util.MigrationUtils;
import org.egov.pgr.web.models.*;
import org.egov.pgr.web.models.pgrV1.*;
import org.egov.pgr.web.models.pgrV1.Address;
import org.egov.pgr.web.models.pgrV1.Service;
import org.egov.pgr.web.models.pgrV1.ServiceResponse;
import org.egov.pgr.web.models.workflow.*;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import javax.annotation.PostConstruct;
import java.util.*;

import static org.egov.pgr.util.PGRConstants.IMAGE_DOCUMENT_TYPE;
import static org.egov.pgr.util.PGRConstants.PGR_BUSINESSSERVICE;
import static org.egov.pgr.util.PGRConstants.PGR_MODULENAME;

@Component
@Slf4j
public class MigrationService {


    @Autowired
    private MigrationUtils migrationUtils;

    @Autowired
    private Producer producer;

    @Autowired
    private PGRConfiguration config;

    private Map<String,String> statusToUUIDMap;

    private Map<String, Long> serviceCodeToSLA;

    private final Map<String, String> oldToNewStatus = new HashMap<String, String>() {
        {

            put("open", "PENDINGFORASSIGNMENT");
            put("assigned", "PENDINGATLME");
            put("closed", "CLOSEDAFTERRESOLUTION");
            put("rejected", "REJECTED");
            put("resolved", "RESOLVED");
            put("reassignrequested", "PENDINGFORREASSIGNMENT");

        }
    };

    private final Map<String, String> oldToNewAction = new HashMap<String, String>() {
        {

            put("open", "APPLY");
            put("ropen", "REOPEN");
            put("assign", "ASSIGN");
            put("reassign", "REASSIGN");
            put("resolve", "RESOLVE");
            put("close", "PENDINGFORREASSIGNMENT");
            put("reject", "REJECT");
            put("requestforreassign", "ASSIGN");

        }
    };

    @PostConstruct
    private void setStatusToUUIDMap(){
        this.statusToUUIDMap = migrationUtils.getStatusToUUIDMap(config.getTenantId());
        this.serviceCodeToSLA = migrationUtils.getServiceCodeToSLAMap(config.getTenantId());
    }




    /**
     *
     * Comment actions has to be added in workflow
     * Active field has to be added
     * Media contains the complete url path instead of fileStoreId
     *
     *
     * Data Assumptions:
     * All records have actionHistory
     * Is AuditDetails of old address different from service auditDetails
     * Every citizen and employee has uuid
     *
     *
     *
     */

    /*
     *
     * 1. Skipping records with empty actionHistory as no linking with service is possible in that case
     * Images are added in workflow doument with documentType as PHOTO which is defined in constants file
     * Citizen object is not migrated as it is stored in user service only it's reference i.e accountId is migrated
     * Splitting Role in 'by' in actionInfo and storing only uuid not role in workflow (Why was it stored in that way?)
     * Removed @Pattern in citizen from name, mobileNumber, address from SearchReponse in old pgr so that batch don't fail for any data
     * id field set by generating new uuid as old one didn't have this field
     * Assumed ActionHistory comes in descending order from old pgr search API
     *
     *
     * 2. tenantid, servicecode, servicerequestid, createdby and createdtime were all NOT NULL constraints
     * in PGR v1 eg_pgr_service table, hence no additional checks have been considered in the migrate flow.
     * However, there is no such constraint of NOT NULL in case of description attribute, hence, a check has
     * been placed here which will set the description as "NOT_SPECIFIED" in case description in v1 table is
     * null.
     *
     *
     * */
    public Map<String, Object> migrate(ServiceResponse serviceResponse) {


        List<Service> servicesV1 = serviceResponse.getServices();
        List<ActionHistory> actionHistories = serviceResponse.getActionHistory();

        Set<String> ids = new HashSet<>();

        servicesV1.forEach(service -> {
            ids.add(service.getAuditDetails().getCreatedBy());
            ids.add(service.getAuditDetails().getLastModifiedBy());
            ids.add(service.getAccountId());
        });

        actionHistories.forEach(actionHistory -> {
            actionHistory.getActions().forEach(actionInfo -> {

                if (actionInfo.getAssignee() != null)
                    ids.add(actionInfo.getAssignee());

                ids.add(actionInfo.getBy().split(":")[0]);
            });
        });

        Map<Long, String> idToUuidMap = migrationUtils.getIdtoUUIDMap(new LinkedList<>(ids));

        /*############### FOR LOCAL TESTING ONLY ###########################################
        Map<Long, String> idToUuidMap = new HashMap<>();
        for(String id : ids){
            if(id != null)
                idToUuidMap.put(Long.parseLong(id), UUID.randomUUID().toString());
        }
        //##################################################################################*/

        Map<String, Object> response = transform(servicesV1, actionHistories, idToUuidMap);

        return response;

    }


    /**
     * @param servicesV1
     * @param actionHistories
     * @return
     */
    private Map<String, Object> transform(List<Service> servicesV1, List<ActionHistory> actionHistories, Map<Long, String> idToUuidMap) {


        Map<String, List<ActionInfo>> idToActionMap = new HashMap<>();

        for (ActionHistory actionHistory : actionHistories) {
            List<ActionInfo> actions = actionHistory.getActions();

            if (CollectionUtils.isEmpty(actions))
                log.error("Skiping record with empty actionHistory");

            String id = actions.get(0).getBusinessKey();
            idToActionMap.put(id, actions);
        }

        // Temporary for testing
        List<org.egov.pgr.web.models.Service> services = new LinkedList<>();
        List<ProcessInstance> workflowResponse = new LinkedList<>();

        for (Service serviceV1 : servicesV1) {

            List<ActionInfo> actionInfos = idToActionMap.get(serviceV1.getServiceRequestId());

            Map<String, Long> actionUuidToSlaMap = getActionUUidToSLAMap(actionInfos, serviceV1.getServiceCode());

            List<ProcessInstance> workflows = new LinkedList<>();

            org.egov.pgr.web.models.Service service = transformService(serviceV1, idToUuidMap);

            actionInfos.forEach(actionInfo -> {
                ProcessInstance workflow = transformAction(actionInfo, idToUuidMap, actionUuidToSlaMap);
                workflows.add(workflow);
            });


            service.setApplicationStatus(oldToNewStatus.get(serviceV1.getStatus().toString()));
            ProcessInstanceRequest processInstanceRequest = ProcessInstanceRequest.builder().processInstances(workflows).build();
            ServiceRequest serviceRequest = ServiceRequest.builder().service(service).build();
            //log.info("Pushing service request: " + serviceRequest);
            /*#################### TEMPORARY FOR TESTING, REMOVE THE COMMENTS*/
               producer.push(config.getBatchCreateTopic(),serviceRequest);
               producer.push(config.getBatchWorkflowSaveTopic(),processInstanceRequest);

            // Temporary for testing
            services.add(service);
            workflowResponse.addAll(workflows);
        }

        Map<String, Object> response = new HashMap<>();

        response.put("Service:", services);
        response.put("Workflows:", workflowResponse);

        return response;


    }


    private org.egov.pgr.web.models.Service transformService(Service serviceV1, Map<Long, String> idToUuidMap) {

        String tenantId = serviceV1.getTenantId();
        String serviceCode = serviceV1.getServiceCode();
        String serviceRequestId = serviceV1.getServiceRequestId();
        String description = serviceV1.getDescription();
        String source = (!ObjectUtils.isEmpty(serviceV1.getSource())) ? serviceV1.getSource().toString() : null;
        String rating = serviceV1.getRating();

        String feedback = serviceV1.getFeedback();
        String addressInService = serviceV1.getAddress();
        String landmark = serviceV1.getLandmark();

        Map<String, Object> additionalDetailMap = new HashMap<>();

        if(!StringUtils.isEmpty(feedback))
            additionalDetailMap.put("feedback", feedback);

        if(!StringUtils.isEmpty(addressInService))
            additionalDetailMap.put("address", addressInService);

        if(!StringUtils.isEmpty(landmark))
            additionalDetailMap.put("landmark", landmark);

        /**
         * AccountId is id, not uuid in old pgr. Mapping has to fetched
         * of id to uuid i.e. accountId in new PGR is the UUID.
         */

        String accountId = null;
        if(serviceV1.getAccountId() != null)
            accountId = idToUuidMap.get(Long.parseLong(serviceV1.getAccountId()));

        AuditDetails auditDetails = serviceV1.getAuditDetails();

        // Setting uuid in place of id in auditDetails
        auditDetails.setCreatedBy(idToUuidMap.get(Long.parseLong(auditDetails.getCreatedBy())));
        auditDetails.setLastModifiedBy(auditDetails.getLastModifiedBy() != null ? idToUuidMap.get(Long.parseLong(auditDetails.getLastModifiedBy())):"NOT_SPECIFIED");

        Object attributes = serviceV1.getAttributes();


        Double latitude = serviceV1.getLat();
        Double longitutude = serviceV1.getLongitutde();

        /**
         * Transform address and set geo location
         */
        GeoLocation geoLocation = GeoLocation.builder().longitude(longitutude).latitude(latitude).build();
        //log.info("Address details: " + serviceV1.getAddressDetail());
        org.egov.pgr.web.models.Address address = null;
        address = transformAddress(serviceV1.getAddressDetail());
        address.setGeoLocation(geoLocation);
        address.setTenantId(tenantId);

        Boolean active = serviceV1.getActive();

        // ACTIVE FLAG NEEDS TO BE ACCOUNTED FOR BELOW FOR POPULATING v2 POJO --->

        org.egov.pgr.web.models.Service service = org.egov.pgr.web.models.Service.builder()
                .id(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .accountId(accountId)
                .additionalDetail(attributes)
                .serviceCode(serviceCode)
                .serviceRequestId(serviceRequestId)
                .description(description)
                .source(source)
                .address(address)
                .active(active)
                .auditDetails(auditDetails)
                .build();

        if(!CollectionUtils.isEmpty(additionalDetailMap))
            service.setAdditionalDetail(additionalDetailMap);

        if (org.apache.commons.lang3.StringUtils.isNumeric(rating)) {
            service.setRating(Integer.parseInt(rating));
        }




        return service;

    }

    /**
     * No auditDetails in address
     * Geolocation will be enriched in service transform as that data is available there
     *
     * @param addressV1
     * @return
     */
    private org.egov.pgr.web.models.Address transformAddress(Address addressV1) {

        String id = addressV1.getUuid();
        String locality = addressV1.getMohalla() != null ? addressV1.getMohalla() : "NOT_AVAILABLE";
        String colony = addressV1.getLocality();
        String city = addressV1.getCity();
        String landmark = addressV1.getLandmark();
        String houseNoAndStreetName = addressV1.getHouseNoAndStreetName();

        /**
         * FIXME : houseNoAndStreetName and colony mapping has to be corrected
         */

        org.egov.pgr.web.models.Address address = org.egov.pgr.web.models.Address.builder()
                .id(id)
                .locality(Boundary.builder().code(locality).build())
                .city(city)
                .landmark(landmark)
                .street(houseNoAndStreetName)
                .region(colony)
                .build();

        return address;

    }


    private ProcessInstance transformAction(ActionInfo actionInfo, Map<Long, String> idToUuidMap, Map<String, Long> actionUuidToSlaMap) {

        String uuid = actionInfo.getUuid();

        // FIXME Should the role be stored
        String createdBy = actionInfo.getBy().split(":")[0];

        String tenantId = actionInfo.getTenantId();
        Long createdTime = actionInfo.getWhen();
        String businessId = actionInfo.getBusinessKey();
        String action = (!StringUtils.isEmpty(actionInfo.getAction())) ? oldToNewAction.get(actionInfo.getAction()) : "COMMENT";
        String status = actionInfo.getStatus();
        String assignee = actionInfo.getAssignee();
        String comments = actionInfo.getComment();
        List<String> fileStoreIds = actionInfo.getMedia();
        String stateUUID = statusToUUIDMap.get(oldToNewStatus.get(status));


        State state = State.builder().uuid(stateUUID).state(oldToNewStatus.get(status)).build();

        // LastmodifiedTime and by is same as that for created as every time new entry is created whenever any action is taken
        AuditDetails auditDetails = AuditDetails.builder().createdBy(createdBy)
                .createdTime(createdTime).lastModifiedBy(createdBy).lastModifiedTime(createdTime).build();

        // Setting uuid in place of id in auditDetails
        auditDetails.setCreatedBy(idToUuidMap.get(Long.parseLong(auditDetails.getCreatedBy())));
        auditDetails.setLastModifiedBy(idToUuidMap.get(Long.parseLong(auditDetails.getLastModifiedBy())));

        ProcessInstance workflow = ProcessInstance.builder()
                .id(uuid)
                .tenantId(tenantId)
                .action(action)
                .comment(comments)
                .businessId(businessId)
                .moduleName(PGR_MODULENAME)
                .state(state)
                .businessService(PGR_BUSINESSSERVICE)
                .businesssServiceSla(actionUuidToSlaMap.get(actionInfo.getUuid()))
                .auditDetails(auditDetails)
                .build();


        // Wrapping assignee uuid in User object to add it in workflow
        if (!StringUtils.isEmpty(assignee)) {
            User user = new User();
            user.setUuid(idToUuidMap.get(Long.parseLong(assignee)));
            workflow.setAssignes(Collections.singletonList(user));
        }

        User assigner = new User();
        assigner.setUuid(idToUuidMap.get(Long.parseLong(createdBy)));
        workflow.setAssigner(assigner);


        // Setting the images uploaded in workflow document
        if (!CollectionUtils.isEmpty(fileStoreIds)) {
            List<Document> documents = new LinkedList<>();
            for (String fileStoreId : fileStoreIds) {

                if(!StringUtils.isEmpty(fileStoreId) && !fileStoreId.equalsIgnoreCase("null")
                    && fileStoreId.length()<=64){
                    Document document = Document.builder()
                            .documentType(IMAGE_DOCUMENT_TYPE)
                            .fileStoreId(fileStoreId)
                            .id(UUID.randomUUID().toString())
                            .build();
                    documents.add(document);
                }
            }
            workflow.setDocuments(documents);
        }

        return workflow;
    }

    private Map<String, Long> getActionUUidToSLAMap(List<ActionInfo> actionInfos, String serviceCode){

        Map<String, Long> uuidTOSLAMap = new HashMap<>();

        if(CollectionUtils.isEmpty(actionInfos))
            return uuidTOSLAMap;

        actionInfos.sort(Comparator.comparing(ActionInfo::getWhen));
        int totalCount = actionInfos.size();

        uuidTOSLAMap.put(actionInfos.get(0).getUuid(), (serviceCodeToSLA.get(serviceCode)!=null)?serviceCodeToSLA.get(serviceCode):432000000l);

        for(int i = 1; i < totalCount; i++){

            ActionInfo actionInfo = actionInfos.get(i);
            ActionInfo previousActionInfo = actionInfos.get(i-1);
            Long timeSpent = actionInfo.getWhen() - previousActionInfo.getWhen();
            Long slaLeft = uuidTOSLAMap.get(previousActionInfo.getUuid()) - timeSpent;
            uuidTOSLAMap.put(actionInfo.getUuid(), slaLeft);
        }
        return uuidTOSLAMap;
    }

}
