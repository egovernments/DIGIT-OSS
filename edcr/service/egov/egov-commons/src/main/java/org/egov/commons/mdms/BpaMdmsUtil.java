
package org.egov.commons.mdms;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import org.egov.commons.mdms.config.MdmsConfiguration;
import org.egov.commons.mdms.model.MasterDetail;
import org.egov.commons.mdms.model.MdmsCriteria;
import org.egov.commons.mdms.model.MdmsCriteriaReq;
import org.egov.commons.mdms.model.ModuleDetail;
import org.egov.commons.service.RestCallService;
import org.egov.infra.microservice.models.RequestInfo;
import org.springframework.stereotype.Service;

@Service
public class BpaMdmsUtil {
    private RestCallService serviceRequestRepository;
    private MdmsConfiguration mdmsConfiguration;

    public BpaMdmsUtil(RestCallService serviceRequestRepository, MdmsConfiguration mdmsConfiguration) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.mdmsConfiguration = mdmsConfiguration;
    }

    public List<ModuleDetail> getBPAModuleRequest() {
        List<MasterDetail> bpaMasterDtls = new ArrayList<>();
        final String filterCode = "$.[?(@.active==true)].code";
        MasterDetail masterDetailAppType = new MasterDetail();
        masterDetailAppType.setName("ApplicationType");
        masterDetailAppType.setFilter(filterCode);
        bpaMasterDtls.add(masterDetailAppType);
        
        MasterDetail masterDetailServicetype = new MasterDetail();
        masterDetailServicetype.setName("ServiceType");
        masterDetailServicetype.setFilter(filterCode);
        bpaMasterDtls.add(masterDetailServicetype);
        
        MasterDetail masterDetailOccupancyType = new MasterDetail();
        masterDetailOccupancyType.setName("OccupancyType");
        masterDetailOccupancyType.setFilter("$.[?(@.active==true)]");
        bpaMasterDtls.add(masterDetailOccupancyType);
        
        MasterDetail masterDetailSubOccupancyType = new MasterDetail();
        masterDetailSubOccupancyType.setName("SubOccupancyType");
        masterDetailSubOccupancyType.setFilter("$.[?(@.active==true)]");
        bpaMasterDtls.add(masterDetailSubOccupancyType);
        
        MasterDetail masterDetailUsages = new MasterDetail();
        masterDetailUsages.setName("Usages");
        masterDetailUsages.setFilter("$.[?(@.active==true)]");
        bpaMasterDtls.add(masterDetailUsages);
        
        /*
         * MasterDetail masterDetailSubfeatureColorCode = new MasterDetail();
         * masterDetailSubfeatureColorCode.setName("SubFeatureColorCode"); masterDetailSubfeatureColorCode.setFilter("$.*");
         * bpaMasterDtls.add(masterDetailSubfeatureColorCode);
         */
        
        ModuleDetail bpaModuleDtls = new ModuleDetail();
        bpaModuleDtls.setMasterDetails(bpaMasterDtls);
        bpaModuleDtls.setModuleName("BPA");
        return Arrays.asList(bpaModuleDtls);
    }

    private MdmsCriteriaReq getBpaMDMSRequest(RequestInfo requestInfo, String tenantId) {
        List<ModuleDetail> moduleRequest = getBPAModuleRequest();
        List<ModuleDetail> moduleDetails = new LinkedList<>();
        moduleDetails.addAll(moduleRequest);
        MdmsCriteria mdmsCriteria = new MdmsCriteria();
        mdmsCriteria.setModuleDetails(moduleDetails);
        mdmsCriteria.setTenantId(tenantId);
        MdmsCriteriaReq mdmsCriteriaReq = new MdmsCriteriaReq();
        mdmsCriteriaReq.setMdmsCriteria(mdmsCriteria);
        mdmsCriteriaReq.setRequestInfo(requestInfo);
        return mdmsCriteriaReq;
    }

    public Object mDMSCall(RequestInfo requestInfo, String tenantId) {
        MdmsCriteriaReq mdmsCriteriaReq = getBpaMDMSRequest(requestInfo,
                tenantId);
        Object result = serviceRequestRepository.fetchResult(getMdmsSearchUrl(), mdmsCriteriaReq);
        return result;
    }

    public StringBuilder getMdmsSearchUrl() {
        return new StringBuilder().append(mdmsConfiguration.getMdmsHost()).append(mdmsConfiguration.getMdmsSearchUrl());
    }
}
