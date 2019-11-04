package org.egov.pg.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CollectionPaymentModeEnum {
    CASH("CASH"),
    CHEQUE("CHEQUE"),
    DD("DD"),
    ONLINE("ONLINE"),
    CARD("CARD");


    private String value;

    CollectionPaymentModeEnum(String value) {
        this.value = value;
    }

    @Override
    @JsonValue
    public String toString() {
        return String.valueOf(value);
    }

    public static boolean contains(String test) {
        for (CollectionPaymentModeEnum val : CollectionPaymentModeEnum.values()) {
            if (val.name().equalsIgnoreCase(test)) {
                return true;
            }
        }
        return false;
    }

    @JsonCreator
    public static CollectionPaymentModeEnum fromValue(String text) {
        for (CollectionPaymentModeEnum b : CollectionPaymentModeEnum.values()) {
            if (String.valueOf(b.value).equalsIgnoreCase(text)) {
                return b;
            }
        }
        return null;
    }
}
