package org.egov.infra.microservice.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(value = Include.NON_NULL)
public class InstrumentAccountCodeResponse {
    private ResponseInfo responseInfo;
    private List<InstrumentAccountCode> instrumentAccountCodes;

    public ResponseInfo getResponseInfo() {
        return responseInfo;
    }

    public void setResponseInfo(ResponseInfo responseInfo) {
        this.responseInfo = responseInfo;
    }

    public List<InstrumentAccountCode> getInstrumentAccountCodes() {
        return instrumentAccountCodes;
    }

    public void setInstrumentAccountCodes(List<InstrumentAccountCode> instrumentAccountCodes) {
        this.instrumentAccountCodes = instrumentAccountCodes;
    }

}