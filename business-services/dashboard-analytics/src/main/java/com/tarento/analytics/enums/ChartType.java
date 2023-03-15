package com.tarento.analytics.enums;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ChartType {

    XTABLE("xtable"), TABLE("table"), PERFORM("perform"), METRIC("metric"), PIE("pie"), LINE("line");
    
    private String value;

    ChartType(final String value) {
        this.value = value;
    }

    
    @JsonValue
    public String toString() {
        return value;
    }

    @JsonCreator
    public static ChartType fromValue(final String passedValue) {
        for (final ChartType obj : ChartType.values())
            if (String.valueOf(obj.value).toLowerCase().equals(passedValue.toLowerCase()))
                return obj;
        return null;
    }
}
