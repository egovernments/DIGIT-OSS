package org.egov.chat.xternal.valuefetch;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;
import org.egov.chat.service.valuefetch.ExternalValueFetcher;
import org.egov.chat.util.LocalizationService;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@PropertySource("classpath:xternal.properties")
@Slf4j
@Component
public class ComplainTypeValueFetcher implements ExternalValueFetcher {

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private LocalizationService localizationService;

    private String localizationPrefix = "pgr.complaint.category.";

    private String moduleName = "RAINMAKER-PGR";
    private String masterDetailsName = "ServiceDefs";

    @Value("${mdms.service.host}")
    private String mdmsHost;
    @Value("${mdms.service.search.path}")
    private String mdmsSearchPath;

    @Override
    public ArrayNode getValues(ObjectNode params) {
        String tenantIdArg = params.get("tenantId").asText();

        MasterDetail masterDetail = MasterDetail.builder().name(masterDetailsName).build();
        ModuleDetail moduleDetail =
                ModuleDetail.builder().moduleName(moduleName).masterDetails(Collections.singletonList(masterDetail)).build();
        MdmsCriteria mdmsCriteria =
                MdmsCriteria.builder().tenantId(tenantIdArg).moduleDetails(Collections.singletonList(moduleDetail)).build();
        MdmsCriteriaReq mdmsCriteriaReq = MdmsCriteriaReq.builder().mdmsCriteria(mdmsCriteria).requestInfo(RequestInfo.builder().build()).build();

        MdmsResponse mdmsResponse = restTemplate.postForObject(mdmsHost + mdmsSearchPath, mdmsCriteriaReq, MdmsResponse.class);

        Map<String, Map<String, JSONArray>> mdmsRes = mdmsResponse.getMdmsRes();

        JSONArray mdmsResValues = mdmsRes.get(moduleName).get(masterDetailsName);

        List<String> values = getActiveComplaintTypes(mdmsResValues);

        return getLocalizedCodes(values);
    }

    @Override
    public String getCodeForValue(ObjectNode params, String value) {
        return value.substring(value.lastIndexOf(".") + 1);
    }

    @Override
    public String createExternalLinkForParams(ObjectNode params) {
        return null;
    }

    List<String> getActiveComplaintTypes(JSONArray mdmsResValues) {
        List<String> values = new ArrayList<>();
        Map<Integer, String> entriesWithOrder = new HashMap<>();
        for (Object mdmsResValue : mdmsResValues) {
            HashMap mdmsValue = (HashMap) mdmsResValue;
            if (mdmsValue.get("active").toString().equalsIgnoreCase("true") && (mdmsValue.get("order") != null)) {
                entriesWithOrder.put(Integer.parseInt(mdmsValue.get("order").toString()), mdmsValue.get("serviceCode").toString());
            }
        }
        TreeSet<Integer> sortedSet = new TreeSet<>(entriesWithOrder.keySet());
        for (Integer key : sortedSet) {
            values.add(entriesWithOrder.get(key));
        }
        return values;
    }


    private ArrayNode getLocalizedCodes(List<String> values) {
        ArrayNode localizationCodes = objectMapper.createArrayNode();
        for (String value : values) {
            ObjectNode localizationCode = objectMapper.createObjectNode();
            localizationCode.put("code", localizationPrefix + value);
            localizationCodes.add(localizationCode);
        }
        return localizationCodes;
    }

}
