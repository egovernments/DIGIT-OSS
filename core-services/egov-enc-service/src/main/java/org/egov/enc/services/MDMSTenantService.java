package org.egov.enc.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;

@ConditionalOnProperty(name = "tenant.service", havingValue = "MDMSTenantService", matchIfMissing = true)
@Service
public class MDMSTenantService implements TenantService {
    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsEndpoint;

    @Value(("${egov.state.level.tenant.id}"))
    private String stateLevelTenantId;
    @Override
    public List<String> getTenantIds() {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestJson = "{\"RequestInfo\":{},\"MdmsCriteria\":{\"tenantId\":\"" + stateLevelTenantId + "\"," +
                "\"moduleDetails\":[{\"moduleName\":\"tenant\",\"masterDetails\":[{\"name\":\"tenants\"," +
                "\"filter\":\"$.*.code\"}]}]}}";

        String url = mdmsHost + mdmsEndpoint;

        HttpEntity<String> entity = new HttpEntity<>(requestJson, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        JSONObject jsonObject = new JSONObject(response.getBody());
        JSONArray jsonArray = jsonObject.getJSONObject("MdmsRes").getJSONObject("tenant").getJSONArray("tenants");

        List<String> tenantIds = new ArrayList<>();
        for(int i = 0; i < jsonArray.length(); i++) {
            tenantIds.add(jsonArray.getString(i));
        }

        return tenantIds;
    }
}
