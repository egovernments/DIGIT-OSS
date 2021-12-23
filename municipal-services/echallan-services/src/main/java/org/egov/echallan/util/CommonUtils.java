package org.egov.echallan.util;


import org.egov.common.contract.request.RequestInfo;
import org.egov.echallan.config.ChallanConfiguration;
import org.egov.echallan.model.AuditDetails;
import org.egov.echallan.model.ChallanRequest;
import org.egov.echallan.repository.ServiceRequestRepository;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Component
@Getter
public class CommonUtils {

	
	@Autowired
	private ObjectMapper mapper;
	
	@Autowired
	private ChallanConfiguration configs;

    @Autowired
	private ServiceRequestRepository serviceRequestRepository;

    private ChallanConstants constants;
	

  
    /**
     * Method to return auditDetails for create/update flows
     *
     * @param by
     * @param isCreate
     * @return AuditDetails
     */
    public AuditDetails getAuditDetails(String by, Boolean isCreate) {
    	
        Long time = System.currentTimeMillis();
        
        if(isCreate)
            return AuditDetails.builder().createdBy(by).lastModifiedBy(by).createdTime(time).lastModifiedTime(time).build();
        else
            return AuditDetails.builder().lastModifiedBy(by).lastModifiedTime(time).build();
    }

    public Object mDMSCall(ChallanRequest request){
        RequestInfo requestInfo = request.getRequestInfo();
        String tenantId = request.getChallan().getTenantId();
        String service = request.getChallan().getBusinessService();
        MdmsCriteriaReq mdmsCriteriaReq = getMDMSRequest(requestInfo, tenantId, service);
        Object result = serviceRequestRepository.fetchResult(getMdmsSearchUrl(), mdmsCriteriaReq);
        return result;
    }

    public StringBuilder getMdmsSearchUrl() {
        return new StringBuilder().append(configs.getMdmsHost()).append(configs.getMdmsEndPoint());
    }

    private MdmsCriteriaReq getMDMSRequest(RequestInfo requestInfo,String tenantId, String service){
        ModuleDetail moduleDeatilRequest = getModuleDeatilRequest(service);
        List<ModuleDetail> moduleDetails = new LinkedList<>();
        moduleDetails.add(moduleDeatilRequest);

        MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(moduleDetails).tenantId(tenantId)
                .build();

        MdmsCriteriaReq mdmsCriteriaReq = MdmsCriteriaReq.builder().mdmsCriteria(mdmsCriteria)
                .requestInfo(requestInfo).build();
        return mdmsCriteriaReq;
    }

    private ModuleDetail getModuleDeatilRequest(String service) {
        List<MasterDetail> masterDetails = new ArrayList<>();

        // filter to only get code field from master data
        final String filterCode = "$.[?(@.service=='"+service+"')]";

        masterDetails.add(MasterDetail.builder().name(constants.TAXPERIOD_MASTER).filter(filterCode).build());
        masterDetails.add(MasterDetail.builder().name(constants.TAXPHEADCODE_MASTER).filter(filterCode).build());

        ModuleDetail moduleDtls = ModuleDetail.builder().masterDetails(masterDetails)
                .moduleName(constants.BILLING_SERVICE).build();

        return moduleDtls;
    }

}
