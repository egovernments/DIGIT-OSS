
package org.egov.rn.service.dhis2.responses;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "httpStatus",
    "httpStatusCode",
    "status",
    "message",
    "response"
})
@Generated("jsonschema2pojo")
public class CampaginDataEntryResponse {

    @JsonProperty("httpStatus")
    private String httpStatus;
    @JsonProperty("httpStatusCode")
    private int httpStatusCode;
    @JsonProperty("status")
    private String status;
    @JsonProperty("message")
    private String message;
    @JsonProperty("response")
    private Response response;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    /**
     * No args constructor for use in serialization
     * 
     */
    public CampaginDataEntryResponse() {
    }

    @Override
    public String toString() {
        return "CampaginDataEntryResponse{" +
                "httpStatus='" + httpStatus + '\'' +
                ", httpStatusCode=" + httpStatusCode +
                ", status='" + status + '\'' +
                ", message='" + message + '\'' +
                ", response=" + response +
                ", additionalProperties=" + additionalProperties +
                '}';
    }

    /**
     * 
     * @param response
     * @param httpStatus
     * @param message
     * @param httpStatusCode
     * @param status
     */
    public CampaginDataEntryResponse(String httpStatus, int httpStatusCode, String status, String message, Response response) {
        super();
        this.httpStatus = httpStatus;
        this.httpStatusCode = httpStatusCode;
        this.status = status;
        this.message = message;
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

    public CampaginDataEntryResponse withHttpStatus(String httpStatus) {
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

    public CampaginDataEntryResponse withHttpStatusCode(int httpStatusCode) {
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

    public CampaginDataEntryResponse withStatus(String status) {
        this.status = status;
        return this;
    }

    @JsonProperty("message")
    public String getMessage() {
        return message;
    }

    @JsonProperty("message")
    public void setMessage(String message) {
        this.message = message;
    }

    public CampaginDataEntryResponse withMessage(String message) {
        this.message = message;
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

    public CampaginDataEntryResponse withResponse(Response response) {
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

    public CampaginDataEntryResponse withAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
        return this;
    }

}
