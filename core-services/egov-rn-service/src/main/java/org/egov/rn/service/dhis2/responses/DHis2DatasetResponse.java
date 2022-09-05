
package org.egov.rn.service.dhis2.responses;

import com.fasterxml.jackson.annotation.*;

import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class DHis2DatasetResponse {

    @JsonProperty("httpStatus")
    private String httpStatus;
    @JsonProperty("httpStatusCode")
    private int httpStatusCode;
    @JsonProperty("status")
    private String status;
    @JsonProperty("response")
    private Response response;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    /**
     * No args constructor for use in serialization
     * 
     */
    public DHis2DatasetResponse() {
    }

    /**
     * 
     * @param response
     * @param httpStatus
     * @param httpStatusCode
     * @param status
     */
    public DHis2DatasetResponse(String httpStatus, int httpStatusCode, String status, Response response) {
        super();
        this.httpStatus = httpStatus;
        this.httpStatusCode = httpStatusCode;
        this.status = status;
        this.response = response;
    }

    @JsonProperty("httpStatus")
    public String getHttpStatus() {
        return httpStatus;
    }

    @JsonProperty("httpStatus")
    public void setHttpStatus(String httpStatus) {
        this.httpStatus = httpStatus;
    }

    public DHis2DatasetResponse withHttpStatus(String httpStatus) {
        this.httpStatus = httpStatus;
        return this;
    }

    @JsonProperty("httpStatusCode")
    public int getHttpStatusCode() {
        return httpStatusCode;
    }

    @JsonProperty("httpStatusCode")
    public void setHttpStatusCode(int httpStatusCode) {
        this.httpStatusCode = httpStatusCode;
    }

    public DHis2DatasetResponse withHttpStatusCode(int httpStatusCode) {
        this.httpStatusCode = httpStatusCode;
        return this;
    }

    @JsonProperty("status")
    public String getStatus() {
        return status;
    }

    @JsonProperty("status")
    public void setStatus(String status) {
        this.status = status;
    }

    public DHis2DatasetResponse withStatus(String status) {
        this.status = status;
        return this;
    }

    @JsonProperty("response")
    public Response getResponse() {
        return response;
    }

    @JsonProperty("response")
    public void setResponse(Response response) {
        this.response = response;
    }

    public DHis2DatasetResponse withResponse(Response response) {
        this.response = response;
        return this;
    }

    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    @JsonAnySetter
    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }

    public DHis2DatasetResponse withAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
        return this;
    }

}
