package org.egov.infra.microservice.models;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum InstrumentStatusEnum {
    APPROVED("APPROVED", InstrumentStatusEnum.Category.OPEN), APPROVAL_PENDING("APPROVAL_PENDING",
            InstrumentStatusEnum.Category.OPEN), TO_BE_SUBMITTED("TO_BE_SUBMITTED",
                    InstrumentStatusEnum.Category.OPEN), REMITTED("REMITTED",
                            InstrumentStatusEnum.Category.OPEN), REJECTED("REJECTED",
                                    InstrumentStatusEnum.Category.CLOSED), CANCELLED("CANCELLED",
                                            InstrumentStatusEnum.Category.CLOSED), DISHONOURED("DISHONOURED",
                                                    InstrumentStatusEnum.Category.CLOSED);

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
            if (String.valueOf(b.value).equalsIgnoreCase(text)) {
                return b;
            }
        }
        return null;
    }

    public enum Category {
        OPEN, CLOSED;
    }
}
