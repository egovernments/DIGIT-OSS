package org.egov.egovdocumentuploader.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.egovdocumentuploader.repository.ServiceRequestRepository;
import org.egov.egovdocumentuploader.web.models.IdGenerationRequest;
import org.egov.egovdocumentuploader.web.models.IdGenerationResponse;
import org.egov.egovdocumentuploader.web.models.IdRequest;
import org.egov.egovdocumentuploader.web.models.IdResponse;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Component
public class DocumentUtil {

    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsUrl;

    @Value("${egov.idgen.host}")
    private String idGenHost;

    @Value("${egov.idgen.path}")
    private String idGenPath;


    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ServiceRequestRepository restRepo;


    public Map<String, Set<String>> fetchCategoryMapFromMdms(RequestInfo requestInfo, List<String> tenantIds) {
        Map<String, Set<String>> ulbToCategoryListMap = new HashMap<>();
        StringBuilder uri = new StringBuilder();
        uri.append(mdmsHost).append(mdmsUrl);
        if(CollectionUtils.isEmpty(tenantIds))
            return new HashMap<>();
        MdmsCriteriaReq mdmsCriteriaReq = getMdmsRequestForCategoryList(requestInfo, tenantIds.get(0));
        Object response = new HashMap<>();
        try {
            response = restTemplate.postForObject(uri.toString(), mdmsCriteriaReq, Map.class);
            List<HashMap<String, Object>> temp = JsonPath.read(response, "$.MdmsRes.DocumentUploader.UlbLevelCategories.*");
            temp.forEach(tempMap ->{
                String ulb = (String)tempMap.get("ulb");
                List<String> categoryList = (List<String>)tempMap.get("categoryList");
                ulbToCategoryListMap.put(ulb, new HashSet<>(categoryList));
            });
        }catch(Exception e) {
            log.error("Exception occurred while fetching category lists from mdms: ",e);
        }
        //log.info(ulbToCategoryListMap.toString());
        return ulbToCategoryListMap;
    }

    private MdmsCriteriaReq getMdmsRequestForCategoryList(RequestInfo requestInfo, String tenantId) {
        MasterDetail masterDetail = new MasterDetail();
        masterDetail.setName("UlbLevelCategories");
        List<MasterDetail> masterDetailList = new ArrayList<>();
        masterDetailList.add(masterDetail);

        ModuleDetail moduleDetail = new ModuleDetail();
        moduleDetail.setMasterDetails(masterDetailList);
        moduleDetail.setModuleName("DocumentUploader");
        List<ModuleDetail> moduleDetailList = new ArrayList<>();
        moduleDetailList.add(moduleDetail);

        MdmsCriteria mdmsCriteria = new MdmsCriteria();
        mdmsCriteria.setTenantId(tenantId.split("\\.")[0]);
        mdmsCriteria.setModuleDetails(moduleDetailList);

        MdmsCriteriaReq mdmsCriteriaReq = new MdmsCriteriaReq();
        mdmsCriteriaReq.setMdmsCriteria(mdmsCriteria);
        mdmsCriteriaReq.setRequestInfo(requestInfo);

        return mdmsCriteriaReq;
    }

    public List<String> getIdList(RequestInfo requestInfo, String tenantId, String idName, String idformat, Integer count) {
        List<IdRequest> reqList = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            reqList.add(IdRequest.builder().idName(idName).format(idformat).tenantId(tenantId).build());
        }

        IdGenerationRequest request = IdGenerationRequest.builder().idRequests(reqList).requestInfo(requestInfo).build();
        StringBuilder uri = new StringBuilder(idGenHost).append(idGenPath);
        IdGenerationResponse response = mapper.convertValue(restRepo.fetchResult(uri, request).get(), IdGenerationResponse.class);

        List<IdResponse> idResponses = response.getIdResponses();

        if (CollectionUtils.isEmpty(idResponses))
            throw new CustomException("IDGEN ERROR", "No ids returned from idgen Service");

        return idResponses.stream().map(IdResponse::getId).collect(Collectors.toList());
    }
}
