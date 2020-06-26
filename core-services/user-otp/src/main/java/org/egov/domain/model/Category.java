package org.egov.domain.model;

public enum Category {
    //HIGH, MEDIUM, LOW;
    OTP, TRANSACTION, PROMOTION, NOTIFICATION, OTHERS;

    @Override
    public String toString() {
        return this.name().toLowerCase();
    }
}

