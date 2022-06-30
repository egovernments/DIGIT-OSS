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

    public Map<String, BigDecimal> getAggregateData(RequestDto request) {
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
            headers.put(TENANT_ID, request.getTenantId());
            aggRequest.setHeaders(headers);

            //mdms cala to fetch aggregation data
            Object mdmsData = mdmsCall(request);
            List<Map> aggregationData = JsonPath.read(mdmsData, MDMS_AGGREGATE_PATH);

                aggregationData.forEach(visualizationcodes -> {
                if (visualizationcodes.get(MDMS_AGGREGATE_MODULE_KEY).toString().equalsIgnoreCase(request.getModule())) {
                    List<String> codes = new ArrayList<>();
                    if (!visualizationcodes.get(MDMS_VIZCODES_WITH_DATE).toString().isEmpty()) {
                        Calendar cal = Calendar.getInstance();
                        aggregateRequestDto.getRequestDate().setEndDate(String.valueOf(cal.getTimeInMillis()));
                        Integer dateInMonths = Integer.parseInt(visualizationcodes.get(MDMS_DATE_IN_MONTHS).toString());
                        cal.add(Calendar.MONTH, -dateInMonths);
                        aggregateRequestDto.getRequestDate().setStartDate(String.valueOf(cal.getTimeInMillis()));
                        codes = (List<String>) visualizationcodes.get(MDMS_VIZCODES_WITH_DATE);
                        for (String code : codes) {
                            aggregateRequestDto.setVisualizationCode(code);
                            aggRequest.setAggregationRequestDto(aggregateRequestDto);
                            Object response = getHeaderData(aggRequest);
                            MetricResponse metricResponse = mapper.convertValue(response, MetricResponse.class);
                            result.put(code, metricResponse.getResponseData().getData().get(0).getHeaderValue());
                        }
                    }
                    if (!visualizationcodes.get(MDMS_VIZCODES_WITHOUT_DATE).toString().isEmpty()) {
                        aggregateRequestDto.getRequestDate().setEndDate("0");
                        aggregateRequestDto.getRequestDate().setStartDate("0");
                        codes = (List<String>) visualizationcodes.get(MDMS_VIZCODES_WITHOUT_DATE);
                        for (String code : codes) {
                            aggregateRequestDto.setVisualizationCode(code);
                            aggRequest.setAggregationRequestDto(aggregateRequestDto);
                            Object response = getHeaderData(aggRequest);
                            MetricResponse metricResponse = mapper.convertValue(response, MetricResponse.class);
                            result.put(code, metricResponse.getResponseData().getData().get(0).getHeaderValue());
                        }
                    }
                }
            });
        } catch (Exception e) {
            throw new CustomException(ErrorConstants.INVALID_MODULE_DATA, e.getMessage());
        }
        return result;
    }

    private Object mdmsCall(RequestDto request) {
        MdmsCriteriaReq mdmsCriteriaReq = enrichMdmsRequest(request);
        StringBuilder url = new StringBuilder(config.getMdmsHost()).append(config.getMdmsSearchEndPoint());
        Object result = serviceRequestRepository.fetchResult(url,mdmsCriteriaReq);
        return result;
    }

    private MdmsCriteriaReq enrichMdmsRequest(RequestDto request) {
        List<MasterDetail> aggregateMasterDetails = new ArrayList<>();

        aggregateMasterDetails.add(MasterDetail.builder().name(AGGREGATE_MASTER_CODE).build());

        ModuleDetail aggregateModuleDtls = ModuleDetail.builder().masterDetails(aggregateMasterDetails)
                .moduleName(AGGREGATE_MODULE_NAME).build();

        List<ModuleDetail> moduleDetails = new ArrayList<>();
        moduleDetails.add(aggregateModuleDtls);

        MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(moduleDetails).tenantId(request.getTenantId().split("\\.")[0])
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
