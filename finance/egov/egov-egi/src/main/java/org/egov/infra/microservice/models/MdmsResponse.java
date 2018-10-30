package org.egov.infra.microservice.models;

import java.util.Map;

import org.json.simple.JSONArray;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MdmsResponse {
    @JsonProperty("ResponseInfo")
    private ResponseInfo responseInfo;
    
    @JsonProperty("MdmsRes")
    private Map<String, Map<String, JSONArray>> mdmsRes;
    public MdmsResponse(ResponseInfo responseInfo, Map<String, Map<String, JSONArray>> mdmsRes) {
        this.responseInfo = responseInfo;
        this.mdmsRes = mdmsRes;
    }
    public MdmsResponse() {
    }
    public ResponseInfo getResponseInfo() {
        return responseInfo;
    }
    public void setResponseInfo(ResponseInfo responseInfo) {
        this.responseInfo = responseInfo;
    }
    public Map<String, Map<String, JSONArray>> getMdmsRes() {
        return mdmsRes;
    }
    public void setMdmsRes(Map<String, Map<String, JSONArray>> mdmsRes) {
        this.mdmsRes = mdmsRes;
    }
    
    
}
