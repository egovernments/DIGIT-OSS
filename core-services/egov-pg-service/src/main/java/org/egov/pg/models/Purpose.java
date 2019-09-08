package org.egov.pg.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Purpose {

    ARREAR_AMOUNT("ARREAR_AMOUNT"),

    CURRENT_AMOUNT("CURRENT_AMOUNT"),

    ADVANCE_AMOUNT("ADVANCE_AMOUNT"),

    ARREAR_LATEPAYMENT_CHARGES("ARREAR_LATEPAYMENT_CHARGES"),

    CURRENT_LATEPAYMENT_CHARGES("CURRENT_LATEPAYMENT_CHARGES"),

    CHEQUE_BOUNCE_PENALTY("CHEQUE_BOUNCE_PENALTY"),

    REBATE("REBATE"),

    OTHERS("OTHERS");

    private String value;

    Purpose(String value) {
        this.value = value;
    }

    @JsonCreator
    public static Purpose fromValue(String text) {
        for (Purpose b : Purpose.values()) {
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