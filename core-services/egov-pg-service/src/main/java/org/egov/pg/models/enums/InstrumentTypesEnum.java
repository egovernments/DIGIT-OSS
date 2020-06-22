package org.egov.pg.models.enums;

public enum InstrumentTypesEnum {
    CASH, CHEQUE, DD, ONLINE, CARD;

    public static boolean contains(String test) {
        for (InstrumentTypesEnum val : InstrumentTypesEnum.values()) {
            if (val.name().equalsIgnoreCase(test)) {
                return true;
            }
        }
        return false;
    }
}
