package org.egov.inbox.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.inbox.config.InboxConfiguration;
import org.egov.inbox.repository.ServiceRequestRepository;
import org.egov.inbox.util.ErrorConstants;
import org.egov.inbox.web.model.dss.*;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

import static org.egov.inbox.util.DSSConstants.*;
@Slf4j
@Service
public class DSSInboxFilterService {

    @Autowired
    private InboxConfiguration config;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Value("${egov.dashboard.analytics.host}")
    private String dashboardAnalyticsHost;

    @Value("${egov.dashboard.analytics.getchartv2.path}")
    private String dashboardAnalyticsEndPoint;

    public Map<String, BigDecimal> getAggregateData(InboxMetricCriteria request) {
        Map<String, BigDecimal> result = new HashMap<>();
        RequestDate dateReq = new RequestDate();
        Map<String, Object> headers = new HashMap<>();
        AggregateRequestDto aggregateRequestDto = new AggregateRequestDto();
        AggregationRequest aggRequest = new AggregationRequest();
        Map<String, Object> filters = new HashMap<>();
        try {
            //Adding default values
            dateReq.setInterval(DSS_INTERVAL);
            aggregateRequestDto.setRequestDate(dateReq);
            aggregateRequestDto.setVisualizationType(DSS_VISUALIZATIONTYPE);
            aggregateRequestDto.setModuleLevel("");
            filters.put(TENANT_ID, new ArrayList<>());
            aggregateRequestDto.setFilters(filters);
            String tenantId = config.getStateLevelTenantId();
            headers.put(TENANT_ID, tenantId);
            aggRequest.setHeaders(headers);

            //mdms cala to fetch aggregation data
            Object mdmsData = mdmsCall(tenantId, AGGREGATE_MASTER_CODE);
            List<Map> aggregationData = JsonPath.read(mdmsData, MDMS_AGGREGATE_PATH);

            aggregationData.forEach(aggData -> {
                if(aggData.get(MDMS_VISUALIZATION_MODULE_KEY).toString().equals(request.getModule())) {
                    List<Map<String, String>> vizCodes = JsonPath.read(aggData, MDMS_VISUALIZATION_PATH);
                    vizCodes.forEach(visualizationcodes -> {
                        try {
                            if (Integer.parseInt(String.valueOf(visualizationcodes.get(MDMS_VISUALIZATION_DATE_KEY))) > 0) {
                                Calendar cal = Calendar.getInstance();
                                aggregateRequestDto.getRequestDate().setEndDate(String.valueOf(cal.getTimeInMillis()));
                                Integer dateInMonths = Integer.parseInt(String.valueOf(visualizationcodes.get(MDMS_VISUALIZATION_DATE_KEY)));
                                cal.add(Calendar.MONTH, -dateInMonths);
                                aggregateRequestDto.getRequestDate().setStartDate(String.valueOf(cal.getTimeInMillis()));
                            } else {
                                aggregateRequestDto.getRequestDate().setEndDate("0");
                                aggregateRequestDto.getRequestDate().setStartDate("0");
                            }
                            aggregateRequestDto.setVisualizationCode(visualizationcodes.get(MDMS_VISUALIZATION_CODES_KEY).toString());
                            aggRequest.setAggregationRequestDto(aggregateRequestDto);
                            log.info("Request for " + request.getModule() + ": " + mapper.writeValueAsString(aggRequest));
                            Object response = getHeaderData(aggRequest);
                            MetricResponse metricResponse = mapper.convertValue(response, MetricResponse.class);
                            result.put(visualizationcodes.get(MDMS_VISUALIZATION_CODES_KEY), metricResponse.getResponseData().getData().get(0).getHeaderValue());
                        } catch (Exception e) {
                            throw new CustomException(ErrorConstants.INVALID_MODULE_DATA, e.getMessage());
                        }
                    });
                }
            });
        } catch (Exception e) {
            throw new CustomException(ErrorConstants.INVALID_MODULE_DATA, e.getMessage());
        }
        return result;
    }

    public Object mdmsCall(String tenantId, String mastername) {
        MdmsCriteriaReq mdmsCriteriaReq = enrichMdmsRequest(tenantId, mastername);
        StringBuilder url = new StringBuilder(config.getMdmsHost()).append(config.getMdmsSearchEndPoint());
        Object result = serviceRequestRepository.fetchResult(url,mdmsCriteriaReq);
        return result;
    }

    public MdmsCriteriaReq enrichMdmsRequest(String tenantId, String mastername) {
        List<MasterDetail> aggregateMasterDetails = new ArrayList<>();

        aggregateMasterDetails.add(MasterDetail.builder().name(mastername).build());

        ModuleDetail aggregateModuleDtls = ModuleDetail.builder().masterDetails(aggregateMasterDetails)
                .moduleName(AGGREGATE_MODULE_NAME).build();

        List<ModuleDetail> moduleDetails = new ArrayList<>();
        moduleDetails.add(aggregateModuleDtls);

        MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(moduleDetails).tenantId(tenantId)
                .build();

        return MdmsCriteriaReq.builder().requestInfo(new RequestInfo()).mdmsCriteria(mdmsCriteria).build();
    }

    public Object getHeaderData(AggregationRequest request) {
        StringBuilder uri = new StringBuilder(dashboardAnalyticsHost)
                .append(dashboardAnalyticsEndPoint);
        try {
            Object response = serviceRequestRepository.fetchResult(uri, request);
            return response;
        } catch (IllegalArgumentException e) {
            throw new CustomException("IllegalArgumentException", "ObjectMapper not able to convertValue in dss call");
        } catch (Exception e) {
            throw new CustomException("ServiceCallException", "Exception while fetching the result for dss");
        }
    }
}
