package org.egov.collection.model.enums;

public enum InstrumentTypesEnum {
    CASH, CHEQUE, DD, ONLINE, CARD,
    OFFLINE_NEFT,
    OFFLINE_RTGS,
    ONLINE_NEFT,
    ONLINE_RTGS,
    POSTAL_ORDER;

    public static boolean contains(String test) {
        for (InstrumentTypesEnum val : InstrumentTypesEnum.values()) {
            if (val.name().equalsIgnoreCase(test)) {
                return true;
            }
        }
        return false;
    }
}
