package org.egov.collection.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.HashSet;
import java.util.Set;

public enum InstrumentStatusEnum {

    APPROVED("Approved", InstrumentStatusEnum.Category.OPEN),
    APPROVALPENDING("Approval Pending", InstrumentStatusEnum.Category.OPEN),
    TOBESUBMITTED("To be Submitted", InstrumentStatusEnum.Category.OPEN),
    REMITTED("Remitted", InstrumentStatusEnum.Category.OPEN),
    REJECTED("Rejected", InstrumentStatusEnum.Category.CLOSED),
    CANCELLED("Cancelled", InstrumentStatusEnum.Category.CLOSED),
    DISHONOURED("Dishonoured", InstrumentStatusEnum.Category.CLOSED);


    private String value;

    private InstrumentStatusEnum.Category category;

    InstrumentStatusEnum(String value, InstrumentStatusEnum.Category category) {
        this.value = value;
        this.category = category;
    }

    public boolean isCategory(InstrumentStatusEnum.Category category) {
        return this.category == category;
    }

    public static Set<String> statusesByCategory(InstrumentStatusEnum.Category category) {
        Set<String> statuses = new HashSet<>();
        for (InstrumentStatusEnum b : InstrumentStatusEnum.values()) {
            if (b.category == category) {
                statuses.add(b.value);
            }
        }

        return statuses;
    }

    @Override
    @JsonValue
    public String toString() {
        return String.valueOf(value);
    }

    @JsonCreator
    public static InstrumentStatusEnum fromValue(String text) {
        for (InstrumentStatusEnum b : InstrumentStatusEnum.values()) {
            if (String.valueOf(b.value).equals(text)) {
                return b;
            }
        }
        return null;
    }

    public enum Category {
        OPEN,
        CLOSED;
    }

}
