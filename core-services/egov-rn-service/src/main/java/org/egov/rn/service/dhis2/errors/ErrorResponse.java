
package org.egov.rn.service.dhis2.errors;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "responseType",
    "klass",
    "uid",
    "errorReports"
})
@Generated("jsonschema2pojo")
public class ErrorResponse {

    @JsonProperty("responseType")
    private String responseType;
    @JsonProperty("klass")
    private String klass;
    @JsonProperty("uid")
    private String uid;
    @JsonProperty("errorReports")
    private List<ErrorReport> errorReports = new ArrayList<ErrorReport>();
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    /**
     * No args constructor for use in serialization
     * 
     */
    public ErrorResponse() {
    }

    /**
     * 
     * @param uid
     * @param responseType
     * @param klass
     * @param errorReports
     */
    public ErrorResponse(String responseType, String klass, String uid, List<ErrorReport> errorReports) {
        super();
        this.responseType = responseType;
        this.klass = klass;
        this.uid = uid;
        this.errorReports = errorReports;
    }

    @JsonProperty("responseType")
    public String getResponseType() {
        return responseType;
    }

    @JsonProperty("responseType")
    public void setResponseType(String responseType) {
        this.responseType = responseType;
    }

    public ErrorResponse withResponseType(String responseType) {
        this.responseType = responseType;
        return this;
    }

    @JsonProperty("klass")
    public String getKlass() {
        return klass;
    }

    @JsonProperty("klass")
    public void setKlass(String klass) {
        this.klass = klass;
    }

    public ErrorResponse withKlass(String klass) {
        this.klass = klass;
        return this;
    }

    @JsonProperty("uid")
    public String getUid() {
        return uid;
    }

    @JsonProperty("uid")
    public void setUid(String uid) {
        this.uid = uid;
    }

    public ErrorResponse withUid(String uid) {
        this.uid = uid;
        return this;
    }

    @JsonProperty("errorReports")
    public List<ErrorReport> getErrorReports() {
        return errorReports;
    }

    @JsonProperty("errorReports")
    public void setErrorReports(List<ErrorReport> errorReports) {
        this.errorReports = errorReports;
    }

    public ErrorResponse withErrorReports(List<ErrorReport> errorReports) {
        this.errorReports = errorReports;
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

    public ErrorResponse withAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
        return this;
    }

}
