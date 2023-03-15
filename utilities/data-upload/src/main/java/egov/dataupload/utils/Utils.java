package egov.dataupload.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import egov.dataupload.models.AuditDetails;
import org.apache.logging.log4j.util.Strings;
import org.egov.common.contract.request.RequestInfo;

import java.time.Instant;
import java.util.Base64;
import java.util.List;

public class Utils {

    public static AuditDetails getAuditDetails(String by, boolean isCreate) {
        Long time = Instant.now().toEpochMilli();
        if(isCreate)
            return AuditDetails.builder().createdBy(by).lastModifiedBy(by).createdTime(time).lastModifiedTime(time).build();
        else
            return AuditDetails.builder().lastModifiedBy(by).lastModifiedTime(time).build();
    }

    public static RequestInfo getRequestInfo(ObjectMapper mapper, String requestInfoBase64) {
        try {
            String decoded = new String(Base64.getDecoder().decode(requestInfoBase64));
            return mapper.readValue(decoded, RequestInfo.class);

        } catch (JsonProcessingException e) {

            return new RequestInfo();
        }
    }

    public static String getErrorMessages(String json){
        if(json == null)
            return "";
       List<String> messages = JsonPath.read(json, "$.Errors[*].message");
       if(!messages.isEmpty()){
           return Strings.join(messages, ';');
       } else
           return "";
    }

}
