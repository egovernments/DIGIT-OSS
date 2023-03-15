package org.egov.report.service;

import java.net.URI;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.domain.model.RequestInfoWrapper;
import org.egov.swagger.model.ColumnDetail;
import org.egov.swagger.model.ColumnDetail.TypeEnum;
import org.egov.swagger.model.MetadataResponse;
import org.egov.swagger.model.ReportDefinition;
import org.egov.swagger.model.SearchColumn;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class IntegrationService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${id.timezone}")
    private String timezone;
    
    @Value("${name.username.combinedreports.list}")
    private List<String> nameAndUsernameCombinedReports;

    public MetadataResponse getData(ReportDefinition reportDefinition, MetadataResponse metadataResponse, RequestInfo requestInfo, String moduleName) {


        List<SearchColumn> searchColumns = reportDefinition.getSearchParams();
        List<ColumnDetail> columnDetails = metadataResponse.getReportDetails().getSearchParams();
        Map<String, ColumnDetail> colNameMap = columnDetails.stream().collect(Collectors.toMap(ColumnDetail::getName, Function.identity()));

        for (SearchColumn searchColumn : searchColumns) {

            if (searchColumn.getType().equals(TypeEnum.SINGLEVALUELIST) || searchColumn.getType().equals(TypeEnum.SINGLEVALUELISTAC) || searchColumn.getType().equals(TypeEnum.MULTIVALUELIST) || searchColumn.getType().equals(TypeEnum.MULTIVALUELISTAC)) {
                log.info("if searchColumn:" + searchColumn);
                log.info("Pattern is:" + searchColumn.getColName());

                String[] patterns = searchColumn.getPattern().split("\\|");
                log.info("patterns:" + patterns.toString());
                String url = patterns[0];
                //url = url.replaceAll("\\$tenantid",metadataResponse.getTenantId());
                log.info("url:" + url);
                ColumnDetail columnDetail = colNameMap.get(searchColumn.getName());

                if (url != null && url.startsWith("list://")) {
                    //consider this as fixed value and send this after removing list://
                    url = url.substring(7);
                    Map<Object, Object> map = new LinkedHashMap<>();
                    String[] pairs = url.split(",");
                    for (String str : pairs) {
                        String[] keyValue = str.split(":");
                        map.put(keyValue[0].replace('_', ','), keyValue[1]);

                    }
                    columnDetail.setDefaultValue(map);
                } else {

                    String res = "";
                    String[] stateid = null;

                    url = url.replaceAll("\\$currentTime", Long.toString(getCurrentTime()));

                    log.info("url:" + url);

                    if (searchColumn.getStateData() && (!metadataResponse.getTenantId().equals("default"))) {
                        stateid = metadataResponse.getTenantId().split("\\.");
                        url = url.replaceAll("\\$tenantid", stateid[0]);
                    } else {

                        url = url.replaceAll("\\$tenantid", metadataResponse.getTenantId());
                    }

                    try {
                        if (searchColumn.getWrapper()) {
                            RequestInfoWrapper riw = generateRequestInfoWrapper(requestInfo);
                            URI uri = URI.create(url);
                            res = restTemplate.postForObject(uri, riw, String.class);

                        } else {

                            res = restTemplate.postForObject(url, requestInfo, String.class);
                        }


                        Object document = Configuration.defaultConfiguration().jsonProvider().parse(res);

                        List<Object> keys = JsonPath.read(document, patterns[1]);
                        List<Object> values = JsonPath.read(document, patterns[2]);
                        if (searchColumn.getLocalisationRequired()) {
                            List<Object> keysAfterLoc = new ArrayList<>();
                            List<Object> valuesAfterLoc = new ArrayList<>();
                            for (int i = 0; i < keys.size(); i++) {
                                String servicecode = ((String) keys.get(i));
                                String localisationLabel = searchColumn.getLocalisationPrefix() + servicecode;
                                if (!valuesAfterLoc.contains(localisationLabel)) {
                                    keysAfterLoc.add(servicecode);
                                    valuesAfterLoc.add(localisationLabel);
                                }
                            }
                            keys = keysAfterLoc;
                            values = valuesAfterLoc;
                        }
                        Map<Object, Object> map = new LinkedHashMap<>();
                        /*
                         * Temp fix to combine columns since report service will be deprecated
                         * 
                         * using a short term solution
                         */

                        if (nameAndUsernameCombinedReports.contains(reportDefinition.getReportName())) {
							List<Object> valuesSuffix = JsonPath.read(document, patterns[3]);
							for (int i = 0; i < keys.size(); i++) {
								map.put(keys.get(i), values.get(i)+"/"+valuesSuffix.get(i));
							}
						} else {
							for (int i = 0; i < keys.size(); i++) {
								map.put(keys.get(i), values.get(i));
							}
						}

                        columnDetail.setDefaultValue(map);
                    } catch (Exception e) {
                        log.error("Exception while fetching data: " + e.getMessage());
                    }

                }
            }
        }
        return metadataResponse;
    }

    private RequestInfoWrapper generateRequestInfoWrapper(RequestInfo requestInfo) {
        RequestInfoWrapper riw = new RequestInfoWrapper();
        RequestInfo ri = new RequestInfo();
        ri.setAction(requestInfo.getAction());
        ri.setAuthToken(requestInfo.getAuthToken());
        ri.setApiId(requestInfo.getApiId());
        ri.setVer(requestInfo.getVer());
        ri.setTs(1L);
        ri.setDid(requestInfo.getDid());
        ri.setKey(requestInfo.getKey());
        ri.setMsgId(requestInfo.getMsgId());
        ri.setUserInfo(requestInfo.getUserInfo());
//        ri.setRequesterId(requestInfo.getRequesterId());
        riw.setRequestInfo(ri);
        return riw;
    }

    public long getCurrentTime() {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeZone(TimeZone.getTimeZone(timezone));
        return calendar.getTimeInMillis();
    }
}
