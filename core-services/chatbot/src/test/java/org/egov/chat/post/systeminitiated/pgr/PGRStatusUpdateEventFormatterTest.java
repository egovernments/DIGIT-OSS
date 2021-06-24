package org.egov.chat.post.systeminitiated.pgr;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;

@Slf4j
public class PGRStatusUpdateEventFormatterTest {

    ObjectMapper objectMapper;

    @Before
    public void init() {
        objectMapper = new ObjectMapper(new JsonFactory());
    }

    @Test
    public void testAssignJsonNodeToDocumentContext() {
        DocumentContext userInfo = JsonPath.parse ("{\"id\":23593,\"userName\":\"DEVGRO\",\"name\":\"DEVGRO\",\"type\":\"EMPLOYEE\",\"mobileNumber\":\"9999999999\",\"emailId\":null,\"roles\":[{\"id\":null,\"name\":\"Grievance Routing Officer\",\"code\":\"GRO\"}]}");
        DocumentContext request = JsonPath.parse("{\"RequestInfo\":{\"userInfo\":{}}}");

        request.set("$.RequestInfo.userInfo", userInfo.json());

        System.out.println("UserInfo : " + userInfo.jsonString());
        System.out.println(request.jsonString());
    }

    @Test
    public void testGettingActionHistory() throws IOException {
        JsonNode complaintDetails = objectMapper.readTree("{\"ResponseInfo\":{\"apiId\":\"Rainmaker\",\"ver\":\".01\",\"ts\":null,\"resMsgId\":\"uief87324\",\"msgId\":\"20170310130900|en_IN\",\"status\":\"successful\"},\"services\":[{\"citizen\":{\"id\":24005,\"uuid\":\"81528b1a-5795-43a7-a6e2-8c64ff145c3d\",\"name\":\"Rushang Dhanesha\",\"permanentAddress\":\"\\\"Vrundavan\\\", 1 Rajhans Society,, Near Azad Chowk, Raiya Road,\",\"mobileNumber\":\"\",\"aadhaarNumber\":null,\"pan\":null,\"emailId\":\"rushangdhanesha@gmail.com\",\"userName\":\"\",\"password\":null,\"active\":true,\"type\":\"CITIZEN\",\"gender\":\"MALE\",\"tenantId\":\"pb\",\"roles\":[{\"name\":\"Citizen\",\"code\":\"CITIZEN\",\"tenantId\":\"pb\"}]},\"tenantId\":\"pb.amritsar\",\"serviceCode\":\"StreetLightNotWorking\",\"serviceRequestId\":\"23/07/2019/001881\",\"description\":\"R\",\"addressId\":\"87993ed1-8d2e-4936-9e33-0407ac7b3935\",\"accountId\":\"24005\",\"phone\":\"\",\"addressDetail\":{\"uuid\":\"87993ed1-8d2e-4936-9e33-0407ac7b3935\",\"mohalla\":\"SUN62\",\"locality\":\"Ekta Colony (Southern Side)\",\"city\":\"pb.amritsar\",\"tenantId\":\"pb.amritsar\"},\"active\":true,\"status\":\"resolved\",\"source\":\"whatsapp\",\"auditDetails\":{\"createdBy\":\"24005\",\"lastModifiedBy\":\"26502\",\"createdTime\":1563870448451,\"lastModifiedTime\":1563870529986}}],\"actionHistory\":[{\"actions\":[{\"uuid\":\"2cccea58-3e66-4b60-8676-0c192f9a2c66\",\"tenantId\":\"pb.amritsar\",\"by\":\"26502:EMPLOYEE\",\"when\":1563870529986,\"businessKey\":\"23/07/2019/001881\",\"action\":\"resolve\",\"status\":\"resolved\",\"media\":[\"https://egov-rainmaker.s3.ap-south-1.amazonaws.com/pb/rainmaker-pgr/July/23/15638705251136673631B-C9A1-488D-B396-4B7B73B15727.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20190723T083000Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20190723%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=c384f83977316336364c63001ab5ac571d1d79d0bc40f93e0ca2ab5eda50b516,https://egov-rainmaker.s3.ap-south-1.amazonaws.com/pb/rainmaker-pgr/July/23/15638705251136673631B-C9A1-488D-B396-4B7B73B15727_large.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20190723T083000Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20190723%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=578a0231e3300457857efaf2c0ec21013480d4129ff357c1cd12b1c9c7a21068,https://egov-rainmaker.s3.ap-south-1.amazonaws.com/pb/rainmaker-pgr/July/23/15638705251136673631B-C9A1-488D-B396-4B7B73B15727_medium.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20190723T083000Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20190723%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=b1c80cf1ab6ed98fb71689c1ea076b552db095659ec8752d18275076a30be238,https://egov-rainmaker.s3.ap-south-1.amazonaws.com/pb/rainmaker-pgr/July/23/15638705251136673631B-C9A1-488D-B396-4B7B73B15727_small.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20190723T083000Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20190723%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=1b52abdee76571c06f287f67a8e1711050dcac11712ca4e654e369b3e67ca612\"],\"comments\":\"\"},{\"uuid\":\"a8ca4f0d-4d74-47ef-a20f-3ba8763be69c\",\"tenantId\":\"pb.amritsar\",\"by\":\"23593:GRO\",\"when\":1563870500099,\"businessKey\":\"23/07/2019/001881\",\"action\":\"assign\",\"status\":\"assigned\",\"assignee\":\"26502\"},{\"uuid\":\"2a1cba5f-ba67-4660-b8b9-fa6d2ddaf4ea\",\"tenantId\":\"pb.amritsar\",\"by\":\"24005:Citizen\",\"when\":1563870448451,\"businessKey\":\"23/07/2019/001881\",\"action\":\"open\",\"status\":\"open\",\"media\":[\"https://egov-rainmaker.s3.ap-south-1.amazonaws.com/pb/chatbot/July/23/1563870427294chatbot1441340857109280016.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20190723T083000Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20190723%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=d9abdf53f399d432fb0c5a7c1e68f76e4372a376e7ba4075662ad2fddf3d81ab,https://egov-rainmaker.s3.ap-south-1.amazonaws.com/pb/chatbot/July/23/1563870427294chatbot1441340857109280016_large.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20190723T083000Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20190723%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=9d2ae1b1a731de9d8063a38d98ed7aad0a02205f5f18636c8905c20658a78abd,https://egov-rainmaker.s3.ap-south-1.amazonaws.com/pb/chatbot/July/23/1563870427294chatbot1441340857109280016_medium.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20190723T083000Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20190723%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=44c29c767ccff4928676a02c512bd8cea5f6c725adb0b8b8abc11312babc6b1a,https://egov-rainmaker.s3.ap-south-1.amazonaws.com/pb/chatbot/July/23/1563870427294chatbot1441340857109280016_small.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20190723T083000Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIA42DEGMQ2NZVNTLNI%2F20190723%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=e63b1800dfa6fcc3802f11a0c1c5e0568660b7daa52b21e8bd4fead91ca50653\"]}]}]}");

        ArrayNode actionHistory = (ArrayNode) complaintDetails.at("/actionHistory/0/actions");
        for(JsonNode action : actionHistory) {
            log.debug("Action : " + action.toString());
            if(action.get("action").asText().equalsIgnoreCase("resolve")) {
                ArrayNode media = (ArrayNode) action.get("media");
                if(media.size() > 0) {
                    log.debug("Link to media file : " + media.get(0).asText());
                    return;
                }
            }
        }
        log.debug("No image found when complaint is resolved");

    }

}