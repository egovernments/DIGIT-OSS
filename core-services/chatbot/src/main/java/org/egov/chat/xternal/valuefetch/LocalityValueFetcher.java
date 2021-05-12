package org.egov.chat.xternal.valuefetch;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import org.egov.chat.service.valuefetch.ExternalValueFetcher;
import org.egov.chat.util.URLShorteningSevice;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@PropertySource("classpath:xternal.properties")
@Component
public class LocalityValueFetcher implements ExternalValueFetcher {

    private static final Logger logger = LoggerFactory.getLogger(LocalityValueFetcher.class);

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    @Value("${location.service.host}")
    private String locationServiceHost;
    @Value("${location.service.search.path}")
    private String locationServiceSearchPath;

    @Value("${egov.external.host}")
    private String egovExternalHost;
    @Value("${locality.options.path}")
    private String localityOptionsPath;
    @Autowired
    private URLShorteningSevice urlShorteningSevice;

    private Map<String, String> defaultQueryParams = new HashMap<String, String>() {{
        put("hierarchyTypeCode", "ADMIN");
        put("boundaryType", "Locality");
    }};

    private String requestBodyString = "{\"RequestInfo\":{\"authToken\":\"\"}}";

    @Override
    public ArrayNode getValues(ObjectNode params) {
        return extractLocalities(fetchValues(params));
    }

    @Override
    public String getCodeForValue(ObjectNode params, String value) {
        return getMohallaCode(fetchValues(params), value);
    }

    @Override
    public String createExternalLinkForParams(ObjectNode params) {
        String mobile = params.get("recipient").asText();
        String tenantId = params.get("tenantId").asText();

        String url = egovExternalHost + localityOptionsPath + "?phone=" + mobile + "&tenantId=" + tenantId;
        String shortenedURL = urlShorteningSevice.shortenURL(url);
        return shortenedURL;
    }

    private ObjectNode fetchValues(ObjectNode params) {
        String tenantId = params.get("tenantId").asText();
        String authToken = params.get("authToken").asText();

        UriComponentsBuilder uriComponents = UriComponentsBuilder.fromUriString(locationServiceHost + locationServiceSearchPath);
        defaultQueryParams.forEach((key, value) -> uriComponents.queryParam(key, value));
        uriComponents.queryParam("tenantId", tenantId);

        String url = uriComponents.buildAndExpand().toUriString();

        DocumentContext request = JsonPath.parse(requestBodyString);
        request.set("$.RequestInfo.authToken", authToken);

        ObjectMapper mapper = new ObjectMapper(new JsonFactory());
        ObjectNode requestBody = null;
        try {
            requestBody = (ObjectNode) mapper.readTree(request.jsonString());
        } catch (IOException e) {
            logger.error("Exception while reading request: " + e.getMessage());
        }

        ObjectNode locationData = restTemplate.postForObject(url, requestBody, ObjectNode.class);

        return locationData;
    }

    ArrayNode extractLocalities(ObjectNode locationData) {
        ArrayNode localities = objectMapper.createArrayNode();

        ArrayNode boundries = (ArrayNode) locationData.get("TenantBoundary").get(0).get("boundary");

        for (JsonNode boundry : boundries) {
            ObjectNode value = objectMapper.createObjectNode();
            value.put("value", boundry.get("name").asText());
            localities.add(value);
        }

        return localities;
    }

    private String getMohallaCode(ObjectNode locationData, String locality) {

        ArrayNode boundaryData = (ArrayNode) locationData.get("TenantBoundary").get(0).get("boundary");

        for (JsonNode boundary : boundaryData) {
            String currentLocalityName = boundary.get("name").asText();
            if (currentLocalityName.equalsIgnoreCase(locality)) {
                return boundary.get("code").asText();
            }
        }

        return "";
    }


}
