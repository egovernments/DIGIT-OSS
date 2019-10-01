package org.egov.collection.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.HashSet;
import java.util.Set;

public enum PaymentDetailStatusEnum {

    APPROVED("Approved", PaymentDetailStatusEnum.Category.OPEN),
    APPROVALPENDING("Approval Pending", PaymentDetailStatusEnum.Category.OPEN),
    TOBESUBMITTED("To be Submitted", PaymentDetailStatusEnum.Category.OPEN),
    REMITTED("Remitted", PaymentDetailStatusEnum.Category.OPEN),
    REJECTED("Rejected", PaymentDetailStatusEnum.Category.CLOSED),
    CANCELLED("Cancelled", PaymentDetailStatusEnum.Category.CLOSED),
    DISHONOURED("Dishonoured", PaymentDetailStatusEnum.Category.CLOSED);


    private String value;

    private PaymentDetailStatusEnum.Category category;

    PaymentDetailStatusEnum(String value, PaymentDetailStatusEnum.Category category) {
        this.value = value;
        this.category = category;
    }

    public boolean isCategory(PaymentDetailStatusEnum.Category category) {
        return this.category == category;
    }

    public static Set<String> statusesByCategory(PaymentDetailStatusEnum.Category category) {
        Set<String> statuses = new HashSet<>();
        for (PaymentDetailStatusEnum b : PaymentDetailStatusEnum.values()) {
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
    public static PaymentDetailStatusEnum fromValue(String text) {
        for (PaymentDetailStatusEnum b : PaymentDetailStatusEnum.values()) {
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
