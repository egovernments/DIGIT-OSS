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
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;

@PropertySource("classpath:xternal.properties")
@Component
public class MdmsValueFetcher implements ExternalValueFetcher {

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    @Value("${mdms.service.host}")
    private String mdmsHost;
    @Value("${mdms.service.search.path}")
    private String mdmsSearchPath;

    @Override
    public ArrayNode getValues(ObjectNode params) {
        String tenantIdArg = params.get("tenantId").asText();
        String moduleNameArg = params.get("moduleName").asText();
        String masterDetailsNameArg = params.get("masterDetailsName").asText();
        String filterArg = params.get("filter").asText();

        MasterDetail masterDetail = MasterDetail.builder().name(masterDetailsNameArg).filter(filterArg).build();
        ModuleDetail moduleDetail =
                ModuleDetail.builder().moduleName(moduleNameArg).masterDetails(Collections.singletonList(masterDetail)).build();
        MdmsCriteria mdmsCriteria =
                MdmsCriteria.builder().tenantId(tenantIdArg).moduleDetails(Collections.singletonList(moduleDetail)).build();
        MdmsCriteriaReq mdmsCriteriaReq = MdmsCriteriaReq.builder().mdmsCriteria(mdmsCriteria).requestInfo(RequestInfo.builder().build()).build();

        MdmsResponse mdmsResponse = restTemplate.postForObject(mdmsHost + mdmsSearchPath, mdmsCriteriaReq, MdmsResponse.class);

        Map<String, Map<String, JSONArray>> mdmsRes = mdmsResponse.getMdmsRes();

        JSONArray mdmsResValues = mdmsRes.get(moduleNameArg).get(masterDetailsNameArg);

        ArrayNode values = objectMapper.createArrayNode();

        for (Object mdmsResValue : mdmsResValues) {
            ObjectNode value = objectMapper.createObjectNode();
            value.put("value", (String) mdmsResValue);
            values.add(value);
        }

        return values;
    }

    @Override
    public String getCodeForValue(ObjectNode params, String value) {
        return value;
    }

    @Override
    public String createExternalLinkForParams(ObjectNode params) {
        return null;
    }
}
