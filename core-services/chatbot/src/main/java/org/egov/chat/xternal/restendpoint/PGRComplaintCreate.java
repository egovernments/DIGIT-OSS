package org.egov.chat.xternal.restendpoint;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.WriteContext;
import lombok.extern.slf4j.Slf4j;
import org.egov.chat.service.restendpoint.RestEndpoint;
import org.egov.chat.util.NumeralLocalization;
import org.egov.chat.util.URLShorteningSevice;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.net.URL;
import java.net.URLEncoder;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@PropertySource("classpath:xternal.properties")
@Slf4j
@Component
public class PGRComplaintCreate implements RestEndpoint {

    @Autowired
    private URLShorteningSevice urlShorteningService;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private NumeralLocalization numeralLocalization;

    @Value("${egov.external.host}")
    private String egovExternalHost;

    @Value("${pgr.service.host}")
    private String pgrHost;
    @Value("${pgr.service.create.path}")
    private String pgrCreateComplaintPath;

    private String localizationTemplateCode = "chatbot.template.pgrCreateComplaintEndMessage";

    String pgrCreateRequestBody = "{\"RequestInfo\":{\"authToken\":\"\",\"userInfo\":{}},\"service\":{\"tenantId\":\"\",\"serviceCode\":\"\",\"description\":\"\",\"accountId\":\"\",\"source\":\"whatsapp\",\"address\":{\"landmark\":\"\",\"city\":\"\",\"geoLocation\":{},\"locality\":{\"code\":\"\"}}},\"workflow\":{\"action\":\"APPLY\",\"verificationDocuments\":[]}}";

    @Override
    public ObjectNode getMessageForRestCall(ObjectNode params) throws Exception {
        String authToken = params.get("authToken").asText();
        String mobileNumber = params.get("mobileNumber").asText();
        String userId = params.get("userId").asText();
        String complaintType = params.get("pgr.create.complaintType").asText();
        String city = params.get("pgr.create.tenantId").asText();
        String locality = params.get("pgr.create.locality").asText();
        String complaintDetails = params.get("pgr.create.complaintDetails").asText();
        String landmark = params.get("pgr.create.landmark").asText();
        String photo = params.get("pgr.create.photo").asText();
        DocumentContext userInfo = JsonPath.parse(params.get("userInfo").asText());
        WriteContext request = JsonPath.parse(pgrCreateRequestBody);
        request.set("$.RequestInfo.authToken", authToken);
        request.set("$.RequestInfo.userInfo", userInfo.json());
        request.set("$.service.tenantId", city);
        request.set("$.service.address.city", city);
        request.set("$.service.address.locality.code", locality);
        request.set("$.service.serviceCode", complaintType);
        request.set("$.service.accountId", userId);
        if (!complaintDetails.equalsIgnoreCase("No"))
            request.set("$.service.description", complaintDetails);
        if (!landmark.equalsIgnoreCase("No"))
            request.set("$.service.address.landmark", landmark);

        if (!photo.equalsIgnoreCase("null"))
        {
            Map<String,String> docs=new HashMap<>();
            docs.put("documentType","COMPLAINTIMAGE");
            docs.put("fileStore",photo);
            request.add("$.workflow.verificationDocuments", docs);

        }
        log.info("PGR Create complaint request : " + request.jsonString());
        JsonNode requestObject = null;
        requestObject = objectMapper.readTree(request.jsonString());
        ObjectNode responseMessage = objectMapper.createObjectNode();
        responseMessage.put("type", "text");
        
        URL baseUrl = new URL(pgrHost);
        URL relativeUrl = new URL( baseUrl, pgrCreateComplaintPath);

        ResponseEntity<ObjectNode> response = restTemplate.postForEntity(relativeUrl.toString(),
                requestObject, ObjectNode.class);
        responseMessage = makeMessageForResponse(response, mobileNumber);
        responseMessage.put("timestamp", System.currentTimeMillis());
        return responseMessage;
    }

    private ObjectNode makeMessageForResponse(ResponseEntity<ObjectNode> responseEntity, String mobileNumber) throws Exception {
        ObjectNode responseMessage = objectMapper.createObjectNode();
//        if (!photo.equalsIgnoreCase("null")) {
//            responseMessage.put("type", "image");
//            responseMessage.put("fileStoreId", photo);
//        } else {
        responseMessage.put("type", "text");
//        }
        if (responseEntity.getStatusCode().is2xxSuccessful()) {
            ObjectNode pgrResponse = responseEntity.getBody();
            String complaintNumber = pgrResponse.at("/ServiceWrappers/0/service/serviceRequestId").asText();
            String encodedPath = URLEncoder.encode(complaintNumber, "UTF-8");
            String url = egovExternalHost + "citizen/otpLogin?mobileNo=" + mobileNumber + "&redirectTo=complaint-details/" + encodedPath + "?source=whatsapp";
            String shortenedURL = urlShorteningService.shortenURL(url);
            ObjectNode param;
            ObjectNode params = objectMapper.createObjectNode();
            ArrayNode localizationCodeArray = objectMapper.valueToTree(
                    numeralLocalization.getLocalizationCodesForStringContainingNumbers(complaintNumber));
            params.set("complaintNumber", localizationCodeArray);

            param = objectMapper.createObjectNode();
            param.put("value", shortenedURL);
            params.set("url", param);
            ObjectNode template = objectMapper.createObjectNode();
            template.put("templateId", localizationTemplateCode);
            template.set("params", params);

            ArrayNode localizationCodes = objectMapper.createArrayNode();
            localizationCodes.add(template);
            responseMessage.set("localizationCodes", localizationCodes);
        } else {
            log.error("Exception in PGR create", responseEntity.toString());
            throw new CustomException("PGR_CREATE_ERROR", "Exception while creating PGR complaint " + responseEntity.toString());
        }
        return responseMessage;
    }

}
