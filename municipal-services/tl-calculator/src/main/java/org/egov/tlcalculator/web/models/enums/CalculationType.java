package org.egov.tlcalculator.web.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CalculationType {

    SUM("SUM"),

    AVERAGE("AVERAGE"),

    MAX("MAX"),

    MIN("MIN");

    private String value;


    CalculationType(String value) {
        this.value = value;
    }

    @Override
    @JsonValue
    public String toString() {
        return String.valueOf(value);
    }

    @JsonCreator
    public static CalculationType fromValue(String text) {
        for (CalculationType b : CalculationType.values()) {
            if (String.valueOf(b.value).equalsIgnoreCase(text)) {
                return b;
            }
        }
        return null;
    }

}
