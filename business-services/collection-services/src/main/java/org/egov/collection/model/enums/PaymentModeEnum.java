package org.egov.collection.model.enums;

public enum PaymentModeEnum {
    CASH, CHEQUE, DD, ONLINE, CARD;

    public static boolean contains(String test) {
        for (PaymentModeEnum val : PaymentModeEnum.values()) {
            if (val.name().equalsIgnoreCase(test)) {
                return true;
            }
        }
        return false;
    }
}
