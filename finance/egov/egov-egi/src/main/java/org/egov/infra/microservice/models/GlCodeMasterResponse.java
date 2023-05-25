package org.egov.infra.microservice.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GlCodeMasterResponse {

    @JsonProperty("ResponseInfo")
    private ResponseInfo responseInfo;

    @JsonProperty("GlCodeMasters")
    private List<GlCodeMaster> glCodeMasters = new ArrayList<>();

    public ResponseInfo getResponseInfo() {
        return responseInfo;
    }

    public void setResponseInfo(ResponseInfo responseInfo) {
        this.responseInfo = responseInfo;
    }

    public List<GlCodeMaster> getGlCodeMasters() {
        return glCodeMasters;
    }

    public void setGlCodeMasters(List<GlCodeMaster> glCodeMasters) {
        this.glCodeMasters = glCodeMasters;
    }

}
