package org.egov.pgr.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pgr.config.PGRConfiguration;
import org.egov.pgr.repository.ServiceRequestRepository;
import org.egov.pgr.web.models.RequestInfoWrapper;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.List;

import static org.egov.pgr.util.PGRConstants.HRMS_DEPARTMENT_JSONPATH;

@Component
public class HRMSUtil {


    private ServiceRequestRepository serviceRequestRepository;

    private PGRConfiguration config;


    @Autowired
    public HRMSUtil(ServiceRequestRepository serviceRequestRepository, PGRConfiguration config) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.config = config;
    }

    /**
     * Gets the list of department for the given list of uuids of employees
     * @param uuids
     * @param requestInfo
     * @return
     */
    public List<String> getDepartment(List<String> uuids, RequestInfo requestInfo){

        StringBuilder url = getHRMSURI(uuids);

        RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();

        Object res = serviceRequestRepository.fetchResult(url, requestInfoWrapper);

        List<String> departments = null;

        try {
             departments = JsonPath.read(res, HRMS_DEPARTMENT_JSONPATH);
        }
        catch (Exception e){
            throw new CustomException("PARSING_ERROR","Failed to parse HRMS response");
        }

        if(CollectionUtils.isEmpty(departments))
            throw new CustomException("DEPARTMENT_NOT_FOUND","The Department of the user with uuid: "+uuids.toString()+" is not found");

        return departments;

    }

    /**
     * Builds HRMS search URL
     * @param uuids
     * @return
     */

    public StringBuilder getHRMSURI(List<String> uuids){

        StringBuilder builder = new StringBuilder(config.getHrmsHost());
        builder.append(config.getHrmsEndPoint());
        builder.append("?uuids=");
        builder.append(StringUtils.join(uuids, ","));

        return builder;
    }


}
