
package org.egov.rn.service.dhis2.responses;

import com.fasterxml.jackson.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {

    @JsonProperty("responseType")
    private String responseType;
    @JsonProperty("klass")
    private String klass;
    @JsonProperty("uid")
    private String uid;
    @JsonProperty("errorReports")
    private List<Object> errorReports = new ArrayList<Object>();
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    /**
     * No args constructor for use in serialization
     * 
     */
    public Response() {
    }

    /**
     * 
     * @param uid
     * @param responseType
     * @param klass
     * @param errorReports
     */
    public Response(String responseType, String klass, String uid, List<Object> errorReports) {
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

    public Response withResponseType(String responseType) {
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

    public Response withKlass(String klass) {
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

    public Response withUid(String uid) {
        this.uid = uid;
        return this;
    }

    @JsonProperty("errorReports")
    public List<Object> getErrorReports() {
        return errorReports;
    }

    @JsonProperty("errorReports")
    public void setErrorReports(List<Object> errorReports) {
        this.errorReports = errorReports;
    }

    public Response withErrorReports(List<Object> errorReports) {
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

    public Response withAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
        return this;
    }

}
