package org.egov.chat.xternal.valuefetch;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import net.minidev.json.JSONArray;
import org.egov.chat.service.valuefetch.ExternalValueFetcher;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Component
public class TenantIdValueFetcher implements ExternalValueFetcher {

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    private String moduleName = "tenant";
    private String masterDetailsName = "citymodule";
    private String filter = "$.[?(@.module=='PGR.WHATSAPP')].tenants.*";
    @Value("${mdms.service.host}")
    private String mdmsHost;
    @Value("${mdms.service.search.path}")
    private String mdmsSearchPath;


    @Override
    public ArrayNode getValues(ObjectNode params) {
        String tenantId = params.get("tenantId").asText();
        return getCityName(fetchMdmsData(tenantId), tenantId);
    }

    @Override
    public String getCodeForValue(ObjectNode params, String value) {
        return value;
    }

    @Override
    public String createExternalLinkForParams(ObjectNode params) {
        return null;
    }

    private JSONArray fetchMdmsData(String tenantId) {
        MasterDetail masterDetail = MasterDetail.builder().name(masterDetailsName).filter(filter).build();
        ModuleDetail moduleDetail =
                ModuleDetail.builder().moduleName(moduleName).masterDetails(Collections.singletonList(masterDetail)).build();
        MdmsCriteria mdmsCriteria =
                MdmsCriteria.builder().tenantId(tenantId).moduleDetails(Collections.singletonList(moduleDetail)).build();
        MdmsCriteriaReq mdmsCriteriaReq = MdmsCriteriaReq.builder().mdmsCriteria(mdmsCriteria).requestInfo(RequestInfo.builder().build()).build();

        MdmsResponse mdmsResponse = restTemplate.postForObject(mdmsHost + mdmsSearchPath, mdmsCriteriaReq, MdmsResponse.class);

        Map<String, Map<String, JSONArray>> mdmsRes = mdmsResponse.getMdmsRes();

        JSONArray mdmsResValues = mdmsRes.get(moduleName).get(masterDetailsName);

        return mdmsResValues;
    }

    ArrayNode getCityName(JSONArray mdmsResValues, String tenantId) {
        ArrayNode values = objectMapper.createArrayNode();

        for (Object mdmsResValue : mdmsResValues) {
            ObjectNode value = objectMapper.createObjectNode();
            HashMap mdmsValue = (HashMap) mdmsResValue;
            value.put("code", mdmsValue.get("code").toString());
            value.put("tenantId", tenantId);
            values.add(value);
        }

        return values;
    }

    String getTenantIdCode(JSONArray mdmsResValues, String cityName) {
        String tenantIdCode = "";
        for (Object mdmsResValue : mdmsResValues) {
            HashMap mdmsValue = (HashMap) mdmsResValue;
            if (mdmsValue.get("name").toString().equalsIgnoreCase(cityName)) {
                return mdmsValue.get("code").toString();
            }
        }
        return tenantIdCode;
    }
}
