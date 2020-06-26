package org.egov.web.notification.sms.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Category {
    OTP("OTP"), TRANSACTION("TRANSACTION"), PROMOTION("PROMOTION"),
    NOTIFICATION("NOTIFICATION"), OTHERS("OTHERS");

    private String value;

    Category(String value) {
        this.value = value;
    }

    @JsonCreator
    public static Category fromValue(String passedValue) {
        for (Category obj : Category.values()) {
            if (String.valueOf(obj.value).equals(passedValue.toUpperCase())) {
                return obj;
            }
        }
        return null;
    }

    @Override
    @JsonValue
    public String toString() {
        return name();
    }
}
