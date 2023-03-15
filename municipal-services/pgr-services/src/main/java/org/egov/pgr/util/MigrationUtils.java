package org.egov.pgr.util;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.pgr.config.PGRConfiguration;
import org.egov.pgr.repository.ServiceRequestRepository;
import org.egov.pgr.web.models.RequestInfoWrapper;
import org.egov.pgr.web.models.User;
import org.egov.pgr.web.models.user.UserDetailResponse;
import org.egov.pgr.web.models.user.UserSearchRequest;
import org.egov.pgr.web.models.workflow.BusinessServiceResponse;
import org.egov.pgr.web.models.workflow.State;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.egov.pgr.util.PGRConstants.*;

@Slf4j
@Component
public class MigrationUtils {


    private UserUtils userUtils;

    private PGRConfiguration config;

    private ObjectMapper mapper;

    private ServiceRequestRepository repository;

    private MDMSUtils mdmsUtils;

    @Autowired
    public MigrationUtils(UserUtils userUtils, PGRConfiguration config, ObjectMapper mapper, ServiceRequestRepository repository, MDMSUtils mdmsUtils) {
        this.userUtils = userUtils;
        this.config = config;
        this.mapper = mapper;
        this.repository = repository;
        this.mdmsUtils = mdmsUtils;
    }





    public Map<Long, String> getIdtoUUIDMap(List<String> ids) {

        /**
         * calls the user search API based on the given list of user uuids
         * @param uuids
         * @return
         */

        ids.removeAll(Collections.singleton(null));

        UserSearchRequest userSearchRequest = new UserSearchRequest();

        if (!CollectionUtils.isEmpty(ids))
            userSearchRequest.setId(ids);

        StringBuilder uri = new StringBuilder(config.getUserHost()).append(config.getUserSearchEndpoint());
        UserDetailResponse userDetailResponse = userUtils.userCall(userSearchRequest, uri);
        List<User> users = userDetailResponse.getUser();

        if (CollectionUtils.isEmpty(users))
            throw new CustomException("USER_NOT_FOUND", "No user found for the uuids");

        Map<Long, String> idToUuidMap = users.stream().collect(Collectors.toMap(User::getId, User::getUuid));

        if (idToUuidMap.keySet().size() != ids.size())
            throw new CustomException("UUID_NOT_FOUND", "Number of ids searched: " + ids.size() + " uuids returned: " + idToUuidMap.keySet().size());

        return idToUuidMap;

    }




    public Map<String,String> getStatusToUUIDMap(String tenantId) {
        StringBuilder url = getSearchURLWithParams(tenantId, PGR_BUSINESSSERVICE);
        RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(new RequestInfo()).build();
        Object result = repository.fetchResult(url, requestInfoWrapper);
        BusinessServiceResponse response = null;
        try {
            response = mapper.convertValue(result, BusinessServiceResponse.class);
        } catch (IllegalArgumentException e) {
            throw new CustomException("PARSING ERROR", "Failed to parse response of workflow business service search");
        }

        if (CollectionUtils.isEmpty(response.getBusinessServices()))
            throw new CustomException("BUSINESSSERVICE_NOT_FOUND", "The businessService " + PGR_BUSINESSSERVICE + " is not found");

        Map<String,String> statusToUUIDMap = response.getBusinessServices().get(0).getStates().stream()
                .collect(Collectors.toMap(State::getState,State::getUuid));

        return statusToUUIDMap;
    }


    public Map<String,Long> getServiceCodeToSLAMap(String tenantId) {

        Map<String, Long> serviceCodeToSLA = new HashMap<>();

        MdmsCriteriaReq mdmsCriteriaReq = mdmsUtils.getMDMSRequest(new RequestInfo(),tenantId);
        Object result = repository.fetchResult(mdmsUtils.getMdmsSearchUrl(), mdmsCriteriaReq);
        List<Map<String, Object>> res = new LinkedList<>();


        try{
            res = JsonPath.read(result,MDMS_DATA_JSONPATH);
        }
        catch (Exception e){
            throw new CustomException("JSONPATH_ERROR","Failed to parse mdms response");
        }

        for(Map<String, Object> map : res){
            Long SLA = TimeUnit.HOURS.toMillis((Integer)map.get(MDMS_DATA_SLA_KEYWORD));
            serviceCodeToSLA.put((String)map.get(MDMS_DATA_SERVICE_CODE_KEYWORD), SLA);
        }

        return serviceCodeToSLA;
    }



    private StringBuilder getSearchURLWithParams(String tenantId, String businessService) {

        StringBuilder url = new StringBuilder(config.getWfHost());
        url.append(config.getWfBusinessServiceSearchPath());
        url.append("?tenantId=");
        url.append(tenantId);
        url.append("&businessServices=");
        url.append(businessService);
        return url;
    }


}
