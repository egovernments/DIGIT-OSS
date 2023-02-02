package org.egov.egovsurveyservices.web.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import javax.validation.constraints.NotNull;

public enum Type {

    LONG_ANSWER_TYPE("LONG_ANSWER_TYPE"),

    SHORT_ANSWER_TYPE("SHORT_ANSWER_TYPE"),

    MULTIPLE_ANSWER_TYPE("MULTIPLE_ANSWER_TYPE"),

    CHECKBOX_ANSWER_TYPE("CHECKBOX_ANSWER_TYPE"),

    DATE_ANSWER_TYPE("DATE_ANSWER_TYPE"),

    TIME_ANSWER_TYPE("TIME_ANSWER_TYPE");


    private String value;

    Type(String value) {
        this.value = value;
    }

    @Override
    @JsonValue
    public String toString() {
        return String.valueOf(value);
    }

    @JsonCreator
    @NotNull
    public static Type fromValue(String text) {
        for (Type b : Type.values()) {
            if (String.valueOf(b.value).equalsIgnoreCase(text)) {
                return b;
            }
        }
        return null;
    }
}
