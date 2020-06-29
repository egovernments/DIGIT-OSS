package org.egov.collection.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PaymentModeEnum {
    CASH("CASH"),
    CHEQUE("CHEQUE"),
    DD("DD"),
    ONLINE("ONLINE"),
    OFFLINE_NEFT("OFFLINE_NEFT"),
    OFFLINE_RTGS("OFFLINE_RTGS"),
    ONLINE_NEFT("ONLINE_NEFT"),
    ONLINE_RTGS("ONLINE_RTGS"),
    POSTAL_ORDER("POSTAL_ORDER"),
    CARD("CARD");


    private String value;

    PaymentModeEnum(String value) {
        this.value = value;
    }

    @Override
    @JsonValue
    public String toString() {
        return String.valueOf(value);
    }

    public static boolean contains(String test) {
        for (PaymentModeEnum val : PaymentModeEnum.values()) {
            if (val.name().equalsIgnoreCase(test)) {
                return true;
            }
        }
        return false;
    }

    @JsonCreator
    public static PaymentModeEnum fromValue(String text) {
        for (PaymentModeEnum b : PaymentModeEnum.values()) {
            if (String.valueOf(b.value).equalsIgnoreCase(text)) {
                return b;
            }
        }
        return null;
    }
}
