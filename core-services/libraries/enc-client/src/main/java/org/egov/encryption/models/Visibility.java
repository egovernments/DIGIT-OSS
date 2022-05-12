package org.egov.encryption.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;


public enum Visibility {
    PLAIN("PLAIN"),
    MASKED("MASKED"),
    NONE("NONE");

    private final String value;

    Visibility(String value) {
        this.value = value;
    }

    @JsonCreator
    public static Visibility fromValue(String text) {
        for (Visibility b : Visibility.values()) {
            if (String.valueOf(b.value).equals(text)) {
                return b;
            }
        }
        return null;
    }

    @Override
    @JsonValue
    public String toString() {
        return String.valueOf(value);
    }
}
