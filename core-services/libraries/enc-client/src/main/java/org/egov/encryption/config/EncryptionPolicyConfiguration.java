package org.egov.encryption.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.minidev.json.JSONArray;
import org.egov.encryption.util.MdmsFetcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.*;

@Component
public class EncryptionPolicyConfiguration {

    @Autowired
    private EncProperties encProperties;
    @Autowired
    private MdmsFetcher mdmsFetcher;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    private String attributesFilter = "$[?(@.model == \"${modelName}\")].attributes.*.jsonPath";

    private String attributesDetailFilter = "$[?(@.model == \"${modelName}\")].attributes.*";

    @PostConstruct
    void initializeKeyAttributeMapFromMdms() {
        //TODO: Space to initialize at boot time if required after latency test
    }

    public List<String> getAttributesJsonPathForModel(String modelName) throws IOException {
        String filter = attributesFilter.replace("${modelName}", modelName);
        JSONArray attributesJSON = mdmsFetcher.getSecurityMdmsForFilter(filter);
        return objectMapper.readValue(attributesJSON.toString(), List.class);
    }

    public JSONArray getAttributeDetailsFormodel(String modelName) throws IOException {
        String filter = attributesDetailFilter.replace("${modelName}", modelName);
        JSONArray attributesDetailsJSON = mdmsFetcher.getMaskingMdmsForFilter(filter);
        return attributesDetailsJSON;
    }

}
