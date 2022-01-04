package org.egov.web.contract;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResponseInfo   {
    private String apiId;
    private String ver;
    private String ts;
    private String resMsgId;
    private String msgId;
    private String status;
}
