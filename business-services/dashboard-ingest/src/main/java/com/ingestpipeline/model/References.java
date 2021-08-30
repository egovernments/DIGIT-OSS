package com.ingestpipeline.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class References {


    private String fieldName;
    private String argument;
    private String dataType;
    private String value;
    private String seperator;
    private String expression;

    @JsonProperty(value="fieldName")
    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    @JsonProperty(value="argument")
    public String getArgument() {
        return argument;
    }

    public void setArgument(String argument) {
        this.argument = argument;
    }

    @JsonProperty(value="dataType")
    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    @JsonProperty(value="value")
    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
    @JsonProperty(value="seperator")
    public String getSeperator() {
        return seperator;
    }

    public void setSeperator(String seperator) {
        this.seperator = seperator;
    }
    @JsonProperty(value="expression")
    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }
}
