package org.egov.wf.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.wf.config.WorkflowConfig;
import org.egov.wf.repository.ServiceRequestRepository;
import org.egov.wf.util.WorkflowConstants;
import org.egov.wf.web.models.ProcessInstanceRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

import static org.egov.wf.util.WorkflowConstants.*;

@Service
public class MDMSService {

   private WorkflowConfig config;

   private ServiceRequestRepository serviceRequestRepository;


   @Autowired
    public MDMSService(WorkflowConfig config, ServiceRequestRepository serviceRequestRepository) {
        this.config = config;
        this.serviceRequestRepository = serviceRequestRepository;
    }

    /**
     *  Calls the MDMS search api to fetch data
     * @param request The incoming ProcessInstanceRequest
     * @return The data recevied from MDMS search
     */
    public Object mdmsCall(ProcessInstanceRequest request){
        RequestInfo requestInfo = request.getRequestInfo();
        String tenantId = request.getProcessInstances().get(0).getTenantId();
        MdmsCriteriaReq mdmsCriteriaReq = getMDMSRequest(requestInfo,tenantId);
        Object result = serviceRequestRepository.fetchResult(getMdmsSearchUrl(), mdmsCriteriaReq);
        return result;
    }

    /**
     * Overloaded method for Calls the MDMS search api to fetch data
     * @param requestInfo The requestInfo of the search request
     * @param tenantId TenantId of the request
     * @return The data recevied from MDMS search
     */
    public Object mdmsCall(RequestInfo requestInfo,String tenantId){
        MdmsCriteriaReq mdmsCriteriaReq = getMDMSRequest(requestInfo,tenantId);
        Object result = serviceRequestRepository.fetchResult(getMdmsSearchUrl(), mdmsCriteriaReq);
        return result;
    }


    /**
     * Creates MDMSCriteria
     * @param requestInfo The RequestInfo of the request
     * @param tenantId TenantId of the request
     * @return MDMSCriteria for search call
     */
    private MdmsCriteriaReq getMDMSRequest(RequestInfo requestInfo, String tenantId){
        ModuleDetail wfModuleDetail = getWorkflowMDMSDetail();

        MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Collections.singletonList(wfModuleDetail))
                .tenantId(tenantId)
                .build();

        MdmsCriteriaReq mdmsCriteriaReq = MdmsCriteriaReq.builder().mdmsCriteria(mdmsCriteria)
                .requestInfo(requestInfo).build();
        return mdmsCriteriaReq;
    }


    /**
     * Creates MDMS ModuleDetail object for workflow
     * @return ModuleDetail for workflow
     */
    private ModuleDetail getWorkflowMDMSDetail() {

        // master details for WF module
        List<MasterDetail> wfMasterDetails = new ArrayList<>();

        wfMasterDetails.add(MasterDetail.builder().name(MDMS_BUSINESSSERVICE).build());

        ModuleDetail wfModuleDtls = ModuleDetail.builder().masterDetails(wfMasterDetails)
                .moduleName(MDMS_WORKFLOW).build();

        return wfModuleDtls;
    }




    /**
     * Returns the url for mdms search endpoint
     * @return url for mdms search endpoint
     */
    public StringBuilder getMdmsSearchUrl() {
        return new StringBuilder().append(config.getMdmsHost()).append(config.getMdmsEndPoint());
    }







}
