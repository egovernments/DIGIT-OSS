package org.egov.collection.util.v1;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.collection.model.v1.ReceiptRequest_v1;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
public class ReceiptValidator_v1 {

    public void validateUserInfo(ReceiptRequest_v1 receiptReq, Map<String, String> errorMap) {
        if (null == receiptReq.getRequestInfo()) {
            errorMap.put("INVALID_REQUEST_INFO", "RequestInfo cannot be null");
        } else {
            if (null == receiptReq.getRequestInfo().getUserInfo()) {
                errorMap.put("INVALID_USER_INFO", "UserInfo within RequestInfo cannot be null");
            } else {
                if (StringUtils.isEmpty(receiptReq.getRequestInfo().getUserInfo().getUuid())) {
                    errorMap.put("INVALID_USER_ID", "UUID of the user within RequestInfo cannot be null");
                }
            }
        }
    }
}
