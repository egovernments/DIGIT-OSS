package org.egov.enc.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ModeEnum {

    ENCRYPT("ENCRYPT"),

    DECRYPT("DECRYPT");

    private String value;

    ModeEnum(String value) {
        this.value = value;
    }

    @Override
    @JsonValue
    public String toString() {
        return String.valueOf(value);
    }

    @JsonCreator
    public static ModeEnum fromValue(String text) {
        for (ModeEnum b : ModeEnum.values()) {
            if (String.valueOf(b.value).equals(text)) {
                return b;
            }
        }
        return null;
    }

}
