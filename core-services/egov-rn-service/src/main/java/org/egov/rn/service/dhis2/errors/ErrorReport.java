
package org.egov.rn.service.dhis2.errors;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "message",
    "mainKlass",
    "errorCode",
    "errorKlass",
    "errorProperty",
    "errorProperties"
})
@Generated("jsonschema2pojo")
public class ErrorReport {

    @JsonProperty("message")
    private String message;
    @JsonProperty("mainKlass")
    private String mainKlass;
    @JsonProperty("errorCode")
    private String errorCode;
    @JsonProperty("errorKlass")
    private String errorKlass;
    @JsonProperty("errorProperty")
    private String errorProperty;
    @JsonProperty("errorProperties")
    private List<String> errorProperties = new ArrayList<String>();
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    /**
     * No args constructor for use in serialization
     * 
     */
    public ErrorReport() {
    }

    /**
     * 
     * @param errorKlass
     * @param errorProperties
     * @param errorProperty
     * @param errorCode
     * @param mainKlass
     * @param message
     */
    public ErrorReport(String message, String mainKlass, String errorCode, String errorKlass, String errorProperty, List<String> errorProperties) {
        super();
        this.message = message;
        this.mainKlass = mainKlass;
        this.errorCode = errorCode;
        this.errorKlass = errorKlass;
        this.errorProperty = errorProperty;
        this.errorProperties = errorProperties;
    }

    @JsonProperty("message")
    public String getMessage() {
        return message;
    }

    @JsonProperty("message")
    public void setMessage(String message) {
        this.message = message;
    }

    public ErrorReport withMessage(String message) {
        this.message = message;
        return this;
    }

    @JsonProperty("mainKlass")
    public String getMainKlass() {
        return mainKlass;
    }

    @JsonProperty("mainKlass")
    public void setMainKlass(String mainKlass) {
        this.mainKlass = mainKlass;
    }

    public ErrorReport withMainKlass(String mainKlass) {
        this.mainKlass = mainKlass;
        return this;
    }

    @JsonProperty("errorCode")
    public String getErrorCode() {
        return errorCode;
    }

    @JsonProperty("errorCode")
    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public ErrorReport withErrorCode(String errorCode) {
        this.errorCode = errorCode;
        return this;
    }

    @JsonProperty("errorKlass")
    public String getErrorKlass() {
        return errorKlass;
    }

    @JsonProperty("errorKlass")
    public void setErrorKlass(String errorKlass) {
        this.errorKlass = errorKlass;
    }

    public ErrorReport withErrorKlass(String errorKlass) {
        this.errorKlass = errorKlass;
        return this;
    }

    @JsonProperty("errorProperty")
    public String getErrorProperty() {
        return errorProperty;
    }

    @JsonProperty("errorProperty")
    public void setErrorProperty(String errorProperty) {
        this.errorProperty = errorProperty;
    }

    public ErrorReport withErrorProperty(String errorProperty) {
        this.errorProperty = errorProperty;
        return this;
    }

    @JsonProperty("errorProperties")
    public List<String> getErrorProperties() {
        return errorProperties;
    }

    @JsonProperty("errorProperties")
    public void setErrorProperties(List<String> errorProperties) {
        this.errorProperties = errorProperties;
    }

    public ErrorReport withErrorProperties(List<String> errorProperties) {
        this.errorProperties = errorProperties;
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

    public ErrorReport withAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
        return this;
    }

}
